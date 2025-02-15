import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import socket from "../socket";

const DeleteModal = ({ isOpen, onClose, taskId, fetchAllTask }) => {
  const base_url = import.meta.env.VITE_BACKEND_URI;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    socket.on("taskDeleted", () => {
      fetchAllTask(); 
    });

    return () => {
      socket.off("taskDeleted"); 
    };
  }, []);

  const handleDelete = async () => {
    if (!taskId) {
      toast.error("❌ Invalid task ID");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("🚫 Unauthorized: No token found");
        setIsLoading(false);
        return;
      }

      const response = await axios.delete(
        `${base_url}/api/v1/task/delete/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        toast.success("✅ Task deleted successfully");

        socket.emit("taskDeleted", taskId);

        fetchAllTask();

        onClose();
      } else {
        toast.error(response.data.message || "❌ Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error(error.response?.data?.message || "⚠️ Error deleting task. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Delete Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:bg-red-300"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
