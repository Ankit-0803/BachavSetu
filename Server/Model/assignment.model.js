import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const GeoSchema = new mongoose.Schema({
  type: { type: String, default: 'Point' },
  coordinates: { type: [Number], index: '2dsphere' }
});

const AssignmentSchema = new mongoose.Schema({
  area: GeoSchema,
  status: {
    type: String,
    enum: ['REPORTED','ASSIGNED','IN_PROGRESS','RESOLVED','COMPLETED'],
    default: 'REPORTED'
  },
  supplies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Supply' }],
  image: String,
  hash: String
}, { timestamps: true });

AssignmentSchema.pre('save', function(next) {
  if (!this.hash) this.hash = nanoid();
  next();
});

export default mongoose.model('Assignment', AssignmentSchema);
