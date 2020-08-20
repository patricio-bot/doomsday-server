const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    punctuation: { type: Number, required: true },
    kind: { type: String, enum: [true, false] },
    image: { type: String },
    author: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
});



const Task = mongoose.model('Task', taskSchema);
module.exports = Task;