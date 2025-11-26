import model from "./model.js";
import { v4 as uuidv4 } from "uuid";
import Database from "../Database/index.js";

export const findAllCourses = () => model.find().lean();

export const findCourseById = (courseId) => model.findById(courseId).lean();

export const findCoursesForEnrolledUser = async (userId) => {
  const { enrollments } = Database;
  const enrolledCourseIds = enrollments
    .filter((enrollment) => enrollment.user === userId)
    .map((enrollment) => enrollment.course);
  return model.find({ _id: { $in: enrolledCourseIds } }).lean();
};

export const createCourse = (course) => {
  const newCourse = { ...course, _id: uuidv4() };
  return model.create(newCourse);
};

export const deleteCourse = (courseId) => {
  return model.deleteOne({ _id: courseId });
};

export const updateCourse = (courseId, courseUpdates) => {
  return model.updateOne({ _id: courseId }, { $set: courseUpdates });
};

