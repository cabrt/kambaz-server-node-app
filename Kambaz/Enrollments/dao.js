import db from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

let { enrollments } = db;

export function findAllEnrollments() {
  return enrollments;
}

export function findEnrollmentsByUser(userId) {
  return enrollments.filter((enrollment) => enrollment.user === userId);
}

export function findEnrollmentsByCourse(courseId) {
  return enrollments.filter((enrollment) => enrollment.course === courseId);
}

export function findEnrollmentByUserAndCourse(userId, courseId) {
  return enrollments.find(
    (enrollment) => enrollment.user === userId && enrollment.course === courseId
  );
}

export function createEnrollment(userId, courseId) {
  const existingEnrollment = findEnrollmentByUserAndCourse(userId, courseId);
  if (existingEnrollment) {
    return existingEnrollment;
  }
  const newEnrollment = {
    _id: uuidv4(),
    user: userId,
    course: courseId,
  };
  enrollments = [...enrollments, newEnrollment];
  db.enrollments = enrollments;
  return newEnrollment;
}

export function enrollUserInCourse(userId, courseId) {
  const newEnrollment = {
    _id: uuidv4(),
    user: userId,
    course: courseId,
  };
  enrollments = [...enrollments, newEnrollment];
  db.enrollments = enrollments;
  return newEnrollment;
}

export function deleteEnrollment(userId, courseId) {
  enrollments = enrollments.filter(
    (enrollment) => !(enrollment.user === userId && enrollment.course === courseId)
  );
  db.enrollments = enrollments;
  return enrollments;
}

