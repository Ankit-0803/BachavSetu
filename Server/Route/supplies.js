// Route/supplies.js
import express from 'express';
import Supply from '../Model/supply.model.js';
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const supplies = await Supply.find();
    res.json(supplies);
  } catch (err) {
    next(err);
  }
});

export { router as suppliesRouter };
