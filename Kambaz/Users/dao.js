import model from "./model.js";
import db from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export const createUser = async (user) => {
  // Remove _id if present to avoid conflicts with database insert
  const { _id, ...userWithoutId } = user;
  const userId = uuidv4();
  // Create document with _id set - Mongoose handles String _id when passed in constructor
  const userData = {
    _id: userId,
    ...userWithoutId,
  };
  return model.create(userData);
};

export const findAllUsers = () => model.find().lean();

export const findUsersByRole = (role) => model.find({ role: role }).lean();

export const findUsersByPartialName = (partialName) => {
  const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
  return model.find({
    $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
  }).lean();
};

export const findUsersByRoleAndName = (role, partialName) => {
  const regex = new RegExp(partialName, "i");
  return model.find({
    role: role,
    $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
  }).lean();
};

export const findUserById = (userId) => model.findById(userId);

export const findUserByUsername = (username) =>
  model.findOne({ username: username });

export const findUserByCredentials = (username, password) =>
  model.findOne({ username, password });

export const updateUser = (userId, user) =>
  model.updateOne({ _id: userId }, { $set: user });

export const deleteUser = (userId) => model.deleteOne({ _id: userId });

// Find users enrolled in a specific course
export const findUsersForCourse = async (courseId) => {
  const { enrollments } = db;
  const enrolledUserIds = enrollments
    .filter((enrollment) => enrollment.course === courseId)
    .map((enrollment) => enrollment.user);
  const users = await model.find({ _id: { $in: enrolledUserIds } }).lean();
  return users;
};

