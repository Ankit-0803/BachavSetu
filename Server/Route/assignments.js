// routes/assignments.js

import express from 'express';
import Assignment from '../Model/assignment.model.js';

const router = express.Router();

// GET /assignments - Fetch all assignments with their related supplies
router.get('/', async (req, res, next) => {
  try {
    const assignments = await Assignment.find().populate('supplies');
    res.json(assignments);
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

    if (!updated) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /assignments/:id - Delete assignment by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Assignment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// Optional: POST /assignments - Create a new assignment (if needed)
router.post('/', async (req, res, next) => {
  try {
    const { area, status, supplies, image } = req.body;

    const assignment = new Assignment({
      area,
      status: status || 'REPORTED', // default to 'REPORTED'
      supplies: supplies || [],
      image,
    });

    await assignment.save();

    await assignment.populate('supplies');

    res.status(201).json(assignment);

  } catch (err) {
    next(err);
  }
});

export { router as assignmentsRouter };
