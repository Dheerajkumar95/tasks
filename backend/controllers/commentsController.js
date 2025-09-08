import Comment from "../models/Comment.js";

// Get comments for a task
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ taskId: req.params.taskId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add comment to a task
export const addComment = async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update comment
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
