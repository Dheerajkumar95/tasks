import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Edit2, CheckCircle, PlusCircle } from "lucide-react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState({});
  const VITE_API_URL="https://task-kf8g.onrender.com"
  const fetchTasks = async () => {
    const res = await axios.get(`${VITE_API_URL}/api/tasks`);
    setTasks(res.data);
  };

  const fetchComments = async (taskId) => {
    const res = await axios.get(`${VITE_API_URL}/api/comments/${taskId}`);
    setComments((prev) => ({ ...prev, [taskId]: res.data }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingTaskId) {
      await axios.put(`${VITE_API_URL}/api/tasks/${editingTaskId}`, form);
      setEditingTaskId(null);
    } else {
      await axios.post(`${VITE_API_URL}/api/tasks`, form);
    }
    setForm({ title: "", description: "" });
    fetchTasks();
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task._id);
    setForm({ title: task.title, description: task.description });
  };

  const handleDeleteTask = async (id) => {
    await axios.delete(`${VITE_API_URL}/api/tasks/${id}`);
    fetchTasks();
  };

  const handleAddComment = async (taskId) => {
    if (!commentText[taskId]) return;
    if (editingCommentId[taskId]) {
      await axios.put(
        `${VITE_API_URL}/api/comments/${editingCommentId[taskId]}`,
        { text: commentText[taskId] }
      );
      setEditingCommentId((prev) => ({ ...prev, [taskId]: null }));
    } else {
      await axios.post(`${VITE_API_URL}/api/comments`, { taskId, text: commentText[taskId] });
    }
    setCommentText((prev) => ({ ...prev, [taskId]: "" }));
    fetchComments(taskId);
  };

  const handleEditComment = (taskId, comment) => {
    setEditingCommentId((prev) => ({ ...prev, [taskId]: comment._id }));
    setCommentText((prev) => ({ ...prev, [taskId]: comment.text }));
  };

  const handleDeleteComment = async (taskId, commentId) => {
    await axios.delete(`${VITE_API_URL}/api/comments/${commentId}`);
    fetchComments(taskId);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>

      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2">
        <input
          type="text"
          placeholder="Title"
          className="border p-2 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="border p-2 rounded"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-1">
          {editingTaskId ? <CheckCircle size={16} /> : <PlusCircle size={16} />} 
          {editingTaskId ? "Update Task" : "Add Task"}
        </button>
      </form>

      <ul className="space-y-4">
        {tasks.map((t) => (
          <li key={t._id} className="border p-2 rounded">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold">{t.title}</h2>
                <p>{t.description}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditTask(t)} className="text-blue-500 hover:text-blue-700">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDeleteTask(t._id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-2 border-t pt-2">
              <button
                onClick={() => fetchComments(t._id)}
                className="text-sm text-blue-500 hover:underline mb-1"
              >
                Show Comments
              </button>

              {comments[t._id]?.map((c) => (
                <div key={c._id} className="flex justify-between items-center border p-1 rounded mt-1">
                  <p>{c.text}</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditComment(t._id, c)} className="text-blue-500 hover:text-blue-700">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteComment(t._id, c._id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add/Edit Comment */}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Add comment"
                  className="border p-1 flex-1 rounded"
                  value={commentText[t._id] || ""}
                  onChange={(e) =>
                    setCommentText((prev) => ({ ...prev, [t._id]: e.target.value }))
                  }
                />
                <button
                  onClick={() => handleAddComment(t._id)}
                  className="bg-green-500 text-white px-2 rounded flex items-center gap-1"
                >
                  <PlusCircle size={16} />
                  {editingCommentId[t._id] ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
