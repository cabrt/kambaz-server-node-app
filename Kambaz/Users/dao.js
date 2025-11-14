import db from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

let { users } = db;

export const createUser = (user) => {
  const newUser = { ...user, _id: uuidv4() };
  users = [...users, newUser];
  db.users = users; // Persist to database
  return newUser;
};

export const findAllUsers = () => users;

export const findUserById = (userId) => users.find((user) => user._id === userId);

export const findUserByUsername = (username) => users.find((user) => user.username === username);

export const findUserByCredentials = (username, password) =>
  users.find((user) => user.username === username && user.password === password);

export const updateUser = (userId, userUpdates) => {
  const user = users.find((u) => u._id === userId);
  if (user) {
    Object.assign(user, userUpdates);
    db.users = users; // Persist to database
    return user;
  }
  return null;
};

export const deleteUser = (userId) => {
  users = users.filter((u) => u._id !== userId);
  db.users = users; // Persist to database
  return { status: "User deleted successfully" };
};

// Find users enrolled in a specific course
export const findUsersForCourse = (courseId) => {
  const { enrollments } = db;
  const enrolledUserIds = enrollments
    .filter((enrollment) => enrollment.course === courseId)
    .map((enrollment) => enrollment.user);
  return users.filter((user) => enrolledUserIds.includes(user._id));
};

