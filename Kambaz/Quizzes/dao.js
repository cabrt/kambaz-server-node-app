import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const findQuizzesForCourse = (courseId) => model.find({ course: courseId }).lean();

export const findQuizById = (quizId) => model.findById(quizId).lean();

export const createQuiz = async (quiz) => {
  const { _id, ...quizWithoutId } = quiz;
  const quizId = uuidv4();
  const quizData = {
    _id: quizId,
    ...quizWithoutId,
  };
  const created = await model.create(quizData);
  return created.toObject();
};

export const deleteQuiz = async (quizId) => {
  return model.deleteOne({ _id: quizId });
};

export const updateQuiz = async (quizId, quizUpdates) => {
  // Remove _id from updates as MongoDB doesn't allow updating _id
  const { _id, ...updatesWithoutId } = quizUpdates;
  await model.updateOne({ _id: quizId }, { $set: updatesWithoutId });
  return model.findById(quizId).lean();
};

