import model from "./model.js";
import { v4 as uuidv4 } from "uuid";
import * as questionsDao from "../Questions/dao.js";

// Calculate score for an attempt
const calculateScore = async (quizId, answers) => {
  const questions = await questionsDao.findQuestionsForQuiz(quizId);
  let totalPoints = 0;
  let earnedPoints = 0;

  const gradedAnswers = answers.map((answer) => {
    const question = questions.find((q) => q._id === answer.question);
    if (!question) {
      return { ...answer, isCorrect: false };
    }

    totalPoints += question.points || 0;
    let isCorrect = false;

    if (question.questionType === "Multiple Choice") {
      isCorrect = question.correctChoice === answer.answer;
    } else if (question.questionType === "True/False") {
      isCorrect = question.correctAnswer === answer.answer;
    } else if (question.questionType === "Fill in the Blank") {
      const studentAnswer = String(answer.answer).trim();
      isCorrect = question.possibleAnswers?.some((correctAnswer) => {
        const normalizedStudent = question.caseSensitive
          ? studentAnswer
          : studentAnswer.toLowerCase();
        const normalizedCorrect = question.caseSensitive
          ? correctAnswer.trim()
          : correctAnswer.trim().toLowerCase();
        return normalizedStudent === normalizedCorrect;
      }) || false;
    }

    if (isCorrect) {
      earnedPoints += question.points || 0;
    }

    return { ...answer, isCorrect };
  });

  return {
    answers: gradedAnswers,
    score: earnedPoints,
    totalPoints,
  };
};

export const findAttemptsForUser = (quizId, userId) => {
  return model.find({ quiz: quizId, user: userId }).lean().sort({ attemptNumber: -1 });
};

export const findAttemptById = (attemptId) => {
  return model.findById(attemptId).lean();
};

export const findLatestAttempt = async (quizId, userId) => {
  const attempts = await model.find({ quiz: quizId, user: userId }).lean().sort({ attemptNumber: -1 });
  return attempts[0] || null;
};

export const getNextAttemptNumber = async (quizId, userId) => {
  const attempts = await model.find({ quiz: quizId, user: userId }).lean();
  if (attempts.length === 0) return 1;
  const maxAttempt = Math.max(...attempts.map((a) => a.attemptNumber || 0));
  return maxAttempt + 1;
};

export const createAttempt = async (attempt) => {
  const { _id, ...attemptWithoutId } = attempt;
  const attemptId = uuidv4();
  const attemptData = {
    _id: attemptId,
    ...attemptWithoutId,
    startedAt: new Date(),
  };
  const newAttempt = await model.create(attemptData);
  return newAttempt.toObject();
};

export const submitAttempt = async (attemptId, answers) => {
  const attempt = await model.findById(attemptId).lean();
  if (!attempt) {
    throw new Error("Attempt not found");
  }

  const { answers: gradedAnswers, score, totalPoints } = await calculateScore(attempt.quiz, answers);

  await model.updateOne(
    { _id: attemptId },
    {
      $set: {
        answers: gradedAnswers,
        score,
        totalPoints,
        submittedAt: new Date(),
      },
    }
  );

  return model.findById(attemptId).lean();
};

export const deleteAttempt = async (attemptId) => {
  return model.deleteOne({ _id: attemptId });
};

