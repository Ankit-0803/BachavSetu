import mongoose from 'mongoose';

const supplySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['FOOD', 'CLOTHES', 'SHELTER'], required: true },
  quantity: { type: Number, required: true, default: 0 },
  threshold: { type: Number, default: 10 }, // min alert level
  location: { type: String, default: 'Main Warehouse' }, // could be expanded
  description: { type: String }, // e.g. `/uploads/food_bachavSetu.jpg`
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Supply', supplySchema);
