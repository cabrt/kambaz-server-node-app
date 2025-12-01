import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const findQuestionsForQuiz = (quizId) => model.find({ quiz: quizId }).lean().sort({ _id: 1 });

export const findQuestionById = (questionId) => model.findById(questionId).lean();

export const createQuestion = async (question) => {
  const { _id, ...questionWithoutId } = question;
  const questionId = uuidv4();
  const questionData = {
    _id: questionId,
    ...questionWithoutId,
  };
  const newQuestion = await model.create(questionData);
  return newQuestion.toObject();
};

export const deleteQuestion = async (questionId) => {
  return model.deleteOne({ _id: questionId });
};

export const updateQuestion = async (questionId, questionUpdates) => {
  await model.updateOne({ _id: questionId }, { $set: questionUpdates });
  return model.findById(questionId).lean();
};

