import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const findModulesForCourse = (courseId) => model.find({ course: courseId }).lean();

export const findModuleById = (moduleId) => model.findById(moduleId);

export const createModule = async (module) => {
  // Remove _id if present to avoid conflicts
  const { _id, ...moduleWithoutId } = module;
  const moduleId = uuidv4();
  const moduleData = {
    _id: moduleId,
    ...moduleWithoutId,
  };
  return model.create(moduleData);
};

export const deleteModule = async (moduleId) => {
  return model.deleteOne({ _id: moduleId });
};

export const updateModule = async (moduleId, moduleUpdates) => {
  await model.updateOne({ _id: moduleId }, { $set: moduleUpdates });
  return model.findById(moduleId);
};

