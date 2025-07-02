// client/src/components/MemoryAgent.jsx
import { useState, useEffect } from "react";

const userId = "user123"; // temp hardcoded user

const MemoryAgent = () => {
  const [message, setMessage] = useState("");
  const [memory, setMemory] = useState([]);

  const fetchMemory = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/memory/${userId}`);
      const data = await res.json();
      setMemory(data.memory.reverse());
    } catch (err) {
      console.error("❌ Error fetching memory", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message, role: "user" }),
      });

      const data = await res.json();
      setMessage("");
      fetchMemory();
    } catch (err) {
      console.error("❌ Error saving message", err);
    }
  };

  useEffect(() => {
    fetchMemory();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">🧠 Memory Agent</h2>

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter a memory..."
          className="flex-1 border p-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </form>

      <ul className="space-y-2">
        {memory.map((m) => (
          <li key={m._id} className="bg-gray-100 p-2 rounded">
            <strong>{m.role}:</strong> {m.message}
            <div className="text-sm text-gray-500">
              {new Date(m.timestamp).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemoryAgent;
