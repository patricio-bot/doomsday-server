const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const sinSchema = new Schema({
    title: String,
    symptoms: String,
    image: String,
    causes: [String]

}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Sin = mongoose.model('Sin', sinSchema);
module.exports = Sin;