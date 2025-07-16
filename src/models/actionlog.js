import mongoose from 'mongoose';

const actionLogSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  details: { type: Object },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('ActionLog', actionLogSchema);
