import express from 'express';
import Incident from '../Model/incident.model.js';
import Assignment from '../Model/assignment.model.js';
import { authenticateToken } from '../Middleware/auth.js';

const router = express.Router();

// GET /incidents - Get all incidents (admin view)
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const incidents = await Incident.find()
      .populate('reportedBy', 'name userName phoneNumber')
      .populate('assignmentCreated')
      .sort({ createdAt: -1 });
    
    res.json(incidents);
  } catch (err) {
    next(err);
  }
});

// GET /incidents/my - Get incidents reported by current user
router.get('/my', authenticateToken, async (req, res, next) => {
  try {
    const incidents = await Incident.find({ reportedBy: req.user.id })
      .populate('assignmentCreated')
      .sort({ createdAt: -1 });
    
    res.json(incidents);
  } catch (err) {
    next(err);
  }
});

// POST /incidents - Create new incident report
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      severity,
      category,
      contactInfo,
      images
    } = req.body;

    const incident = new Incident({
      title,
      description,
      reportedBy: req.user.id,
      location,
      severity,
      category,
      contactInfo,
      images: images || []
    });

    await incident.save();
    await incident.populate('reportedBy', 'name userName phoneNumber');
    
    res.status(201).json(incident);
  } catch (err) {
    next(err);
  }
});

// PATCH /incidents/:id - Update incident status or details (admin only)
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
    ).populate('reportedBy', 'name userName phoneNumber')
     .populate('assignmentCreated');

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json(incident);
  } catch (err) {
    next(err);
  }
});

// POST /incidents/:id/create-assignment - Convert incident to assignment (admin only)
router.post('/:id/create-assignment', authenticateToken, async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    const { supplies } = req.body;

    // Create assignment from incident
    const assignment = new Assignment({
      area: incident.location,
      status: 'UPCOMING',
      supplies: supplies || [],
      incidentReference: incident._id,
      priority: incident.severity === 'CRITICAL' ? 'HIGH' : 'MEDIUM'
    });

    await assignment.save();

    // Update incident with assignment reference
    incident.assignmentCreated = assignment._id;
    incident.status = 'ASSIGNED';
    await incident.save();

    res.json({ assignment, incident });
  } catch (err) {
    next(err);
  }
});

export { router as incidentsRouter };
