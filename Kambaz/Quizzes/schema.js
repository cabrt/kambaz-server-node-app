import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    _id: String,
    title: { type: String, required: true },
    course: { type: String, required: true, ref: "CourseModel" },
    description: String,
    points: Number,
    dueDate: Date,
    availableDate: Date,
    availableUntil: Date,
    published: { type: Boolean, default: false },
    questionCount: { type: Number, default: 0 },
    // Quiz settings
    quizType: { type: String, enum: ["Graded Quiz", "Practice Quiz", "Graded Survey", "Ungraded Survey"], default: "Graded Quiz" },
    assignmentGroup: { type: String, enum: ["QUIZZES", "EXAMS", "ASSIGNMENTS", "PROJECT"], default: "QUIZZES" },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 }, // in minutes
    multipleAttempts: { type: Boolean, default: false },
    attemptsAllowed: { type: Number, default: 1 },
    showCorrectAnswers: { type: String, default: "Immediately" }, // "Immediately", "After Due Date", "Never"
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
  },
  { collection: "quizzes" }
);

export default quizSchema;

