import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, required: true, ref: "QuizModel" },
    user: { type: String, required: true, ref: "UserModel" },
    attemptNumber: { type: Number, required: true },
    startedAt: { type: Date, default: Date.now },
    submittedAt: Date,
    answers: [{
      question: { type: String, required: true },
      answer: mongoose.Schema.Types.Mixed, // Can be string, number, boolean, or array
      isCorrect: { type: Boolean, default: false },
    }],
    score: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
  },
  { collection: "quizAttempts" }
);

export default quizAttemptSchema;

