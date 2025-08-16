import express from 'express';
import SupplyRequest from '../Model/supplyRequest.model.js';
import Supply from '../Model/supply.model.js';
import { authenticateToken } from '../Middleware/auth.js';

const router = express.Router();

// GET all supply requests (ADMIN)
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });
    const requests = await SupplyRequest.find()
      .populate('incident')
      .populate('requestedSupplies.supply')
      .populate('approvedSupplies.supply')
      .populate('requestedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) { next(err); }
});

// APPROVE a supply request (deduct from inventory)
router.post('/:id/approve', authenticateToken, async (req, res, next) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });
    const request = await SupplyRequest.findById(req.params.id)
      .populate('requestedSupplies.supply');
    if (!request) return res.status(404).json({ message: "Request not found" });

    let approvedSupplies = [];
    for (const reqItem of request.requestedSupplies) {
      const supply = await Supply.findById(reqItem.supply._id);
      const quantityToSupply = Math.min(supply.quantity, reqItem.quantity);
      supply.quantity -= quantityToSupply;
      await supply.save();

      approvedSupplies.push({
        supply: supply._id,
        quantitySupplied: quantityToSupply
      });
    }
    request.status = "APPROVED";
    request.approvedSupplies = approvedSupplies;
    request.handledBy = req.user._id;
    await request.save();
    res.json(request);
  } catch (err) { next(err); }
});

// REJECT a supply request
router.post('/:id/reject', authenticateToken, async (req, res, next) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });
    const request = await SupplyRequest.findById(req.params.id);
    request.status = "REJECTED";
    request.adminComments = req.body.adminComments || "";
    request.handledBy = req.user._id;
    await request.save();
    res.json(request);
  } catch (err) { next(err); }
});

export { router as supplyRequestsRouter };
