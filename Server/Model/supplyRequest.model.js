import mongoose from 'mongoose';

const supplyRequestSchema = new mongoose.Schema({
  incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true },
  requestedSupplies: [
    {
      supply: { type: mongoose.Schema.Types.ObjectId, ref: 'Supply', required: true },
      quantity: { type: Number, required: true }
    }
  ],
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'PARTIAL', 'REJECTED'], default: 'PENDING' },
  approvedSupplies: [
    {
      supply: { type: mongoose.Schema.Types.ObjectId, ref: 'Supply' },
      quantitySupplied: { type: Number }
    }
  ],
  adminComments: String,
  handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('SupplyRequest', supplyRequestSchema);
