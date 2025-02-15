import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaTrashAlt,
  FaEdit,
  FaCalendarAlt,
  FaBell,
  FaGripVertical,
  FaUser,
  FaListUl,
  FaSpinner,
  FaCheckCircle,
  FaUserCircle,
  FaSearch,
  FaTimes,
  FaPlus,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import CreateTodo from "../modal/createTodo";
import DeleteModal from "../modal/DeleteModal";

import socket from "../socket";

const Board = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const base_url = import.meta.env.VITE_BACKEND_URI;
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    completed: [],
  });
  const [allTasks, setAllTasks] = useState({
    todo: [],
    inProgress: [],
    completed: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const deletecloseModal = () => {
    setIsDeleteModal(false);
  };
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const handleDragStart = (e, taskId, sourceColumn) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceColumn", sourceColumn);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumn = e.dataTransfer.getData("sourceColumn");

    if (sourceColumn === targetColumn) return;

    const updatedTasks = { ...tasks };
    const movedTaskIndex = updatedTasks[sourceColumn].findIndex(
      (task) => task._id === taskId
    );

    if (movedTaskIndex === -1) return;

    const movedTask = updatedTasks[sourceColumn][movedTaskIndex];

    // Ensure targetColumn is mapped correctly
    const statusMapping = {
        todo: "To Do",
        inProgress: "In Progress",
        completed: "Done",  // Change completed to Done
    };

    movedTask.status = statusMapping[targetColumn] || targetColumn; // Update task status

    updatedTasks[sourceColumn] = updatedTasks[sourceColumn].filter(
      (task) => task._id !== taskId
    );
    updatedTasks[targetColumn].push(movedTask);

    setTasks(updatedTasks);

    updateTaskStatus(taskId, movedTask.status);
};

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found!");
        return;
      }
  
      await axios.put(
        `${base_url}/api/v1/task/update/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("✅ Task updated successfully!");
    } catch (error) {
      console.error("❌ Error updating task status:", error);
    }
  };
  
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

      if (response.status === 200 && response.data.success) {
        toast.success("✅ Task deleted successfully");


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


  const fetchAllTask = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found!");
        return;
      }

      const response = await axios.get(`${base_url}/api/v1/task/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status && response.data.findAllTask) {
        const categorizedTasks = {
          todo: response.data.findAllTask.filter(
            (task) => task.status === "To Do"
          ),
          inProgress: response.data.findAllTask.filter(
            (task) => task.status === "In Progress"
          ),
          completed: response.data.findAllTask.filter(
            (task) => task.status === "Done"
          ),
        };

        setAllTasks(categorizedTasks);
        setTasks(categorizedTasks);
      } else {
        console.error("No tasks found or invalid response format.");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

 

  const searchTask = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setTasks(allTasks); // Reset tasks if search is empty
    } else {
      const filteredTasks = {
        todo: allTasks.todo.filter(
          (task) =>
            task.title.toLowerCase().includes(query.toLowerCase()) || // Check title
            task.description.toLowerCase().includes(query.toLowerCase()) // Check description
        ),
        inProgress: allTasks.inProgress.filter(
          (task) =>
            task.title.toLowerCase().includes(query.toLowerCase()) ||
            task.description.toLowerCase().includes(query.toLowerCase())
        ),
        completed: allTasks.completed.filter(
          (task) =>
            task.title.toLowerCase().includes(query.toLowerCase()) ||
            task.description.toLowerCase().includes(query.toLowerCase())
        ),
      };
      setTasks(filteredTasks);
    }
  };

  const renderColumn = (title, columnKey, bgColor, Icon) => (
    <div
      className={`flex-1 min-w-0 ${bgColor} rounded-lg p-4`}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, columnKey)}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Icon className="mr-2 text-gray-700" size={20} /> {title}
      </h2>
      <div className="space-y-4">
        {tasks[columnKey].map((task) => (
          <div
            key={task._id}
            className="bg-white rounded-lg shadow p-4 cursor-move"
            draggable="true"
            onDragStart={(e) => handleDragStart(e, task._id, columnKey)}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`px-2 py-1 text-xs font-medium ${task.priorityClass} rounded-full`}
              >
                {task.priority}
              </span>
              <div className="flex items-center space-x-2">
                {/* <button  className="text-blue-500 hover:text-blue-700">
                  <FaEdit size={16} />
                </button> */}
                <button
                  onClick={() => {
                    setSelectedTaskId(task._id); 
                    setIsDeleteModal(true); 
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrashAlt size={16} />
                </button>
                <FaGripVertical size={16} className="text-gray-400" />
              </div>
            </div>
            <h3 className="font-medium text-gray-900">{task?.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{task?.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <FaCalendarAlt size={14} className="mr-1" />
                <div className="flex gap-2">
                  {new Date(task?.dueDate).toLocaleDateString("en-GB")}
                  <span className="text-gray-700 font-semibold">Due Date</span>
                </div>
              </div>

              <span className="flex justify-center items-center gap-2">
                {" "}
                <FaUserCircle size={20} color="teal" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    fetchAllTask();

    const handleTaskUpdate = () => {
      fetchAllTask();
    };

    socket.on("taskUpdated", handleTaskUpdate);

    return () => {
      socket.off("taskUpdated", handleTaskUpdate);
    };
  }, []);




  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gray-50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => searchTask(e.target.value)}
                placeholder="Search tasks..."
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-button focus:outline-none focus:ring-1 focus:ring-custom focus:border-custom bg-white text-gray-900 placeholder-gray-500"
              />

              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                style={{ display: "none" }}
              >
                <FaTimes />
              </button>
            </div>

            <button
              onClick={openModal}
              type="button"
              className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-button shadow-sm text-white bg-black hover:bg-custom/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom"
            >
              <FaPlus className="mr-2" />
              Add Task
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {renderColumn("To Do", "todo", "bg-blue-50", FaListUl)}
          {renderColumn("In Progress", "inProgress", "bg-orange-50", FaSpinner)}
          {renderColumn("Completed", "completed", "bg-green-50", FaCheckCircle)}
        </div>
      </main>

      <CreateTodo
        isOpen={isOpen}
        onClose={closeModal}
        fetchAllTask={fetchAllTask}
      />
     <DeleteModal
        isOpen={isDeleteModal}
        onClose={() => setIsDeleteModal(false)}
        taskId={selectedTaskId}
        fetchAllTask={fetchAllTask}
      />
    </div>
  );
};

export default Board;
