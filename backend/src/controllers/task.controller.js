import Task from "../models/task.model.js";
import mongoose from "mongoose";
import { io } from "../webSocket/socket.js";

// Helper function to emit events to specific users
const emitToUser = (userId, event, data) => {
  io.to(userId.toString()).emit(event, data);
};

export const createNewTask = async (req, res) => {
  try {
    const { title, description, status, position, priority, dueDate } = req.body;
    const userId = req.user.id || req.user._id;

    const newTask = await Task.create({
      title,
      description,
      status,
      position,
      priority,
      dueDate,
      user: userId,
    });

    // Emit event only to the specific user
    emitToUser(userId, "Task Created", newTask);

    return res.status(201).json({ message: "New task created", newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({ message: "Error creating task" });
  }
};

export const getAllTask = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const findAllTask = await Task.find({ user: userId })
      .select("-__v") // Exclude unnecessary fields
      .populate("user", "name email")
      .sort({ position: 1 });

    return res.status(200).json({ status: true, message: "Fetched all tasks", findAllTask });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ message: "Error fetching tasks" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, description, status, position } = req.body;
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if position is updated and adjust other tasks
    if (position !== undefined && position !== task.position) {
      await Task.updateMany(
        { user: userId, position: { $gte: position } },
        { $inc: { position: 1 } }
      );
    }

    // Update task
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, status, position },
      { new: true, runValidators: true }
    );

    emitToUser(userId, "Task Updated", updatedTask);
    return res.status(200).json({ message: "Task updated successfully", updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ message: "Error updating task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Adjust task positions after deletion
    await Task.updateMany(
      { user: userId, position: { $gt: task.position } },
      { $inc: { position: -1 } }
    );

    await Task.findByIdAndDelete(id);

    emitToUser(userId, "Task Deleted", { id });

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ message: "Error deleting task" });
  }
};
