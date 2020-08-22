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
  hasSins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sin' }],
  status: { type: String, enum: ['alive', 'dead'] },
  age: { type: Number },
  birthDate: { type: Date }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;