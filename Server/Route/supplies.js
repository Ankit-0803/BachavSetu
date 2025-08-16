import express from 'express';
import Supply from '../Model/supply.model.js';
import { authenticateToken } from '../Middleware/auth.js';

const router = express.Router();

// GET all supplies (optionally by category)
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const supplies = await Supply.find(query);
    res.json(supplies);
  } catch (err) { next(err); }
});

// CREATE supply item
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });
    const { name, category, quantity, threshold, location, description } = req.body;
    const supply = new Supply({
      name, category, quantity, threshold, location, description, createdBy: req.user._id
    });
    await supply.save();
    res.status(201).json(supply);
  } catch (err) { next(err); }
});

// UPDATE supply item (edit name/category/location/threshold/cover)
router.patch('/:id', authenticateToken, async (req, res, next) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });
    const updated = await Supply.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) { next(err); }
});

// INCREASE/DECREASE quantity
router.post('/:id/quantity', authenticateToken, async (req, res, next) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });
    const { action, amount } = req.body; // action: "increase" or "decrease"
    const supply = await Supply.findById(req.params.id);
    if (!supply) return res.status(404).json({ message: "Supply not found" });
    supply.quantity += action === "increase" ? amount : -amount;
    await supply.save();
    res.json(supply);
  } catch (err) { next(err); }
});

// DELETE supply item
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });
    await Supply.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

export { router as suppliesRouter };
