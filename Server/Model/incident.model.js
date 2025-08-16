import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 1000 },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM',
  },
  category: {
    type: String,
    enum: ['FIRE', 'FLOOD', 'EARTHQUAKE', 'MEDICAL', 'ACCIDENT', 'OTHER'],
    required: true,
  },
  status: {
    type: String,
    enum: ['REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'],
    default: 'REPORTED',
  },
  images: [{ type: String }], // urls to uploaded images
  assignmentCreated: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  contactInfo: {
    phone: String,
    email: String,
  },
  // Fixed: Properly define requestedSupplies structure
  requestedSupplies: [{
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    people: { type: Number, required: true }
  }],
  supplyRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'SupplyRequest' },
}, { timestamps: true });

// Geospatial Index for location queries
incidentSchema.index({ location: '2dsphere' });

const Incident = mongoose.model('Incident', incidentSchema);
export default Incident;
