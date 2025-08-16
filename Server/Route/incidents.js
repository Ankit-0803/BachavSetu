import express from 'express';
import Incident from '../Model/incident.model.js';
import Assignment from '../Model/assignment.model.js';
import SupplyRequest from '../Model/supplyRequest.model.js';
import Supply from '../Model/supply.model.js';
import { authenticateToken } from '../Middleware/auth.js';
import { upload } from '../Middleware/upload.js';

const router = express.Router();

// GET all incidents (admin)
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const incidents = await Incident.find()
      .populate('reportedBy', 'name userName phoneNumber')
      .populate('assignmentCreated')
      .populate('supplyRequest')
      .sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    next(err);
  }
});

// GET my incidents (user)
router.get('/my', authenticateToken, async (req, res, next) => {
  try {
    const incidents = await Incident.find({ reportedBy: req.user.id })
      .populate('assignmentCreated')
      .populate('supplyRequest')
      .sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    next(err);
  }
});

// POST new incident with images & automatic supply request creation
router.post(
  '/',
  authenticateToken,
  upload.array('images', 8),
  async (req, res, next) => {
    try {
      const {
        title,
        description,
        severity,
        category,
        location,
        contactInfo,
        requestedSupplies
      } = req.body;

      console.log('Received requestedSupplies:', requestedSupplies);

      // Build image URLs
      const images = req.files.map(f => `/uploads/${f.filename}`);

      // Parse JSON fields
      const loc = JSON.parse(location);
      const contact = JSON.parse(contactInfo);
      
      // Parse requestedSupplies
      let supplies = [];
      if (requestedSupplies) {
        try {
          supplies = JSON.parse(requestedSupplies);
          console.log('Parsed supplies:', supplies);
        } catch (e) {
          console.error('Error parsing supplies:', e);
          supplies = [];
        }
      }

      // Filter out empty supplies
      const validSupplies = supplies.filter(s => s.item && s.quantity > 0 && s.people > 0);

      // Create incident
      const incident = new Incident({
        title,
        description,
        reportedBy: req.user.id,
        location: loc,
        severity,
        category,
        contactInfo: contact,
        requestedSupplies: validSupplies,
        images
      });

      await incident.save();

      // Create supply request if supplies were requested
      if (validSupplies.length > 0) {
        try {
          // Map requested supplies to actual supply IDs
          const requestedSuppliesWithIds = [];
          
          for (const supplyReq of validSupplies) {
            // Find matching supply in database
            const supply = await Supply.findOne({ 
              name: { $regex: new RegExp(supplyReq.item, 'i') } 
            });
            
            if (supply) {
              requestedSuppliesWithIds.push({
                supply: supply._id,
                quantity: supplyReq.quantity
              });
            }
          }

          if (requestedSuppliesWithIds.length > 0) {
            const supplyRequest = new SupplyRequest({
              incident: incident._id,
              requestedSupplies: requestedSuppliesWithIds,
              requestedBy: req.user.id,
              status: 'PENDING'
            });

            await supplyRequest.save();
            
            // Link supply request to incident
            incident.supplyRequest = supplyRequest._id;
            await incident.save();

            console.log('Created supply request:', supplyRequest._id);
          }
        } catch (supplyReqError) {
          console.error('Error creating supply request:', supplyReqError);
          // Don't fail the incident creation if supply request fails
        }
      }

      await incident.populate('reportedBy', 'name userName phoneNumber');
      await incident.populate('supplyRequest');
      
      console.log('Saved incident with supplies:', incident.requestedSupplies);
      
      res.status(201).json(incident);
    } catch (err) {
      console.error('Incident creation error:', err);
      next(err);
    }
  }
);

// PATCH status/details (admin only)
router.patch('/:id', authenticateToken, async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const { status, assignmentCreated } = req.body;
    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status, assignmentCreated },
      { new: true }
    )
      .populate('reportedBy', 'name userName phoneNumber')
      .populate('assignmentCreated')
      .populate('supplyRequest');
    
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    res.json(incident);
  } catch (err) {
    next(err);
  }
});

// POST create-assignment from incident (admin only)
router.post(
  '/:id/create-assignment',
  authenticateToken,
  async (req, res, next) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }
      
      const incident = await Incident.findById(req.params.id);
      if (!incident) {
        return res.status(404).json({ message: 'Incident not found' });
      }

      const { supplies } = req.body;
      
      // Create assignment with proper structure
      const assignment = new Assignment({
        area: incident.location, // Use incident location
        status: 'UPCOMING', // Start with UPCOMING status
        supplies: supplies || [], // Supplies array from request
      });
      
      await assignment.save();
      
      // Update incident with assignment reference and status
      incident.assignmentCreated = assignment._id;
      incident.status = 'ASSIGNED';
      await incident.save();
      
      // Populate the assignment before sending response
      await assignment.populate('supplies');
      
      console.log('Created assignment:', assignment);
      
      res.json({ 
        assignment, 
        incident,
        message: 'Assignment created successfully'
      });
    } catch (err) {
      console.error('Assignment creation error:', err);
      next(err);
    }
  }
);

export { router as incidentsRouter };
