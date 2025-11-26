import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const findModulesForCourse = (courseId) => model.find({ course: courseId });

export const findModuleById = (moduleId) => model.findById(moduleId);

export const createModule = (module) => {
  const newModule = { ...module, _id: uuidv4() };
  return model.create(newModule);
};

export const deleteModule = (moduleId) => {
  return model.deleteOne({ _id: moduleId });
};

export const updateModule = (moduleId, moduleUpdates) => {
  return model.updateOne({ _id: moduleId }, moduleUpdates);
};

