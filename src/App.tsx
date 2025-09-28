import React, { useEffect, useState } from "react";
import type { Task } from "./config/Task";
import {
  getTasks,
  deleteTask,
  searchTasks,
  executeTask,
  createOrUpdateTask,
} from "./config/api";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTask, setNewTask] = useState<Task>({
    id: "",
    name: "",
    owner: "",
    command: "",
    taskExecutions: [],
  });
  const [loading, setLoading] = useState(false);
  const [messageText, setMessageText] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err: any) {
      showMessage(err.response?.data || "Error fetching tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  // Show message
  const showMessage = (msg: string, type: "success" | "error") => {
    setMessageText(msg);
    setMessageType(type);
    setTimeout(() => setMessageText(null), 4000);
  };

  // Create task
  const handleCreate = async () => {
    if (!newTask.id || !newTask.name || !newTask.owner || !newTask.command) {
      showMessage("Please fill all fields", "error");
      return;
    }
    try {
      const res = await createOrUpdateTask(newTask);
      showMessage(`Task "${res.data.name}" created successfully`, "success");
      setNewTask({ id: "", name: "", owner: "", command: "", taskExecutions: [] });
      fetchTasks();
    } catch (err: any) {
      showMessage(err.response?.data || "Error creating task", "error");
    }
  };

  // Execute task
  const handleExecute = async (id: string) => {
    try {
      const res = await executeTask(id);
      showMessage(`Task executed: ${res.data.id}`, "success");
      fetchTasks();
    } catch (err: any) {
      showMessage(err.response?.data || "Error executing task", "error");
    }
  };

  // Delete task
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(id);
      showMessage("Task deleted successfully", "success");
      fetchTasks();
    } catch (err: any) {
      showMessage(err.response?.data || "Error deleting task", "error");
    }
  };

  // Search tasks
  
  const handleSearch = async () => {
    if (!searchTerm) return fetchTasks();
    try {
      const res = await searchTasks(searchTerm);
      setTasks(res.data);
    } catch (err: any) {
      showMessage(err.response?.data || "Error searching tasks", "error");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Task Manager</h1>

      {/* Message */}
      {messageText && (
        <div
          className={`mb-4 p-3 rounded border ${
            messageType === "success"
              ? "bg-green-100 text-green-800 border-green-300"
              : "bg-red-100 text-red-800 border-red-300"
          }`}
        >
          {messageText}
        </div>
      )}

      {/* Add Task Form */}
      <div className="mb-6 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Add New Task</h2>
        <div className="flex flex-wrap gap-3 mb-3">
          <input
            placeholder="ID"
            value={newTask.id}
            onChange={(e) => setNewTask({ ...newTask, id: e.target.value })}
            className="border rounded px-3 py-2 flex-1"
          />
          <input
            placeholder="Name"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            className="border rounded px-3 py-2 flex-1"
          />
          <input
            placeholder="Owner"
            value={newTask.owner}
            onChange={(e) => setNewTask({ ...newTask, owner: e.target.value })}
            className="border rounded px-3 py-2 flex-1"
          />
          <input
            placeholder="Command"
            value={newTask.command}
            onChange={(e) => setNewTask({ ...newTask, command: e.target.value })}
            className="border rounded px-3 py-2 flex-2"
          />
        </div>
        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Add Task
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 flex gap-3">
        <input
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Search
        </button>
        <button
          onClick={fetchTasks}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Reset
        </button>
      </div>

      {/* Task List */}
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="p-4 border rounded bg-white shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <strong className="text-lg text-gray-800">{task.name}</strong> -{" "}
                <em className="text-gray-600">{task.owner}</em>
                <div className="text-sm text-gray-700 mt-1">
                  Command: <code>{task.command}</code>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Executions: {task.taskExecutions?.length || 0}
                </div>

                {task.taskExecutions && task.taskExecutions.length > 0 && (
                  <div className="mt-2 p-2 bg-gray-100 rounded text-sm font-mono max-h-32 overflow-y-auto">
                    <strong>Last Execution Output:</strong>
                    <pre className="whitespace-pre-wrap">
                      {task.taskExecutions[task.taskExecutions.length - 1]?.output || "No output"}
                    </pre>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <button
                  onClick={() => handleExecute(task.id)}
                  className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                >
                  Execute
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
