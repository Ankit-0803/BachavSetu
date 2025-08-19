// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// // Location schema for the user
// const GeoSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     default: 'point',
//   },
//   coordinates: {
//     type: [Number],
//     index: '2dsphere',
//   },
// });

// const UserSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     userName: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     phoneNumber: {
//       type: Number,
//       unique: true,
//       maxLength: 10,
//     },
//     password: {
//       type: String,
//       required: [true, 'Your password cannot be blank'],
//     },
//     adhaarNumber: {
//       type: String,
//       required: true,
//       maxlength: 12,
//       minlength: 12,
//       required: [true, 'Your aadhar cannot be blank'],
//     },
//     assignments: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Assignment',
//       },
//     ],
//     isAdmin: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },
//     geometry: GeoSchema,
//     address: {
//       type: String,
//     },
//   },
//   { timestamps: true }
// );

// UserSchema.methods.matchPassword = async function (enteredPassword) {
//   let isValidPassword = await bcrypt.compare(enteredPassword, this.password);
//   return isValidPassword;
// };

// UserSchema.pre('save', async function (next) {
//   // in case of updates, don't hash password if not modified
//   if (!this.isModified('password')) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// const User = mongoose.model('User', UserSchema);
// export default User;
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  userName: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  phoneNumber: { 
    type: String, 
    required: true,
    unique: true,
    match: [/^[0-9]{10}$/, 'Phone number must be 10 digits']
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  isAdmin: { 
    type: Boolean, 
    default: false 
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

// Index for geospatial queries
userSchema.index({ geometry: '2dsphere' });

const User = mongoose.model('User', userSchema);
export default User;
