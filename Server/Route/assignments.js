// Route/assignments.js
import express from 'express';
import Assignment from '../Model/assignment.model.js';

const router = express.Router();

// GET /assignments - Fetch all assignments with their related supplies
router.get('/', async (req, res, next) => {
  try {
    const assignments = await Assignment.find().populate('supplies');
    res.json(assignments); // returns an array to frontend
  } catch (err) {
    next(err);
  }
});

// PATCH /assignments/:id - Update assignment status
router.patch('/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    const updated = await Assignment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('supplies');
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export { router as assignmentsRouter };
