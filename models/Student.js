const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, trim: true, lowercase: true },
  course: { type: String, required: true, trim: true, maxlength: 80 },
  phone: { type: String, trim: true, default: '' },
  enrollmentNo: { type: String, required: true, unique: true, trim: true, uppercase: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
studentSchema.index({ name: 'text', email: 'text', enrollmentNo: 'text', course: 'text' });
module.exports = mongoose.model('Student', studentSchema);
