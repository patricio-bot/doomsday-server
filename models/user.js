const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  image: String,
  tasksCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  //hasSins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sin' }],
  status: { type: String, enum: ['alive', 'dead'] },
  age: { type: Number, default: 0 },
  yearsRemaining: Number,
  isDrinker: { type: Boolean, default: false },
  isSmoker: { type: Boolean, default: false },
  health: { type: String, default: '' },
  description: { type: String, default: '' },
  weight: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  country: { type: String, default: '' },
  hasSins: []
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});
userSchema.pre('save', function (next) {
  if (this.gender === 'male') {
    this.image = 'https://res.cloudinary.com/dk85ozjx3/image/upload/v1598258354/images/male-satan-bg_wjvaiw.png';
  } else {
    this.image = 'https://res.cloudinary.com/dk85ozjx3/image/upload/v1598258602/images/female-satan-bg_qscvwl.png';
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;