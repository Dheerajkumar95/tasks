import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Comment", CommentSchema);
