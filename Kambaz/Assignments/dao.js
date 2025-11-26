import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const findAssignmentsForCourse = (courseId) => model.find({ course: courseId }).lean();

export const findAssignmentById = (assignmentId) => model.findById(assignmentId).lean();

export const createAssignment = async (assignment) => {
  // Remove _id if present to avoid conflicts
  const { _id, ...assignmentWithoutId } = assignment;
  const assignmentId = uuidv4();
  const assignmentData = {
    _id: assignmentId,
    ...assignmentWithoutId,
  };
  const created = await model.create(assignmentData);
  return created.toObject();
};

export const deleteAssignment = async (assignmentId) => {
  return model.deleteOne({ _id: assignmentId });
};

export const updateAssignment = async (assignmentId, assignmentUpdates) => {
  await model.updateOne({ _id: assignmentId }, { $set: assignmentUpdates });
  return model.findById(assignmentId).lean();
};

