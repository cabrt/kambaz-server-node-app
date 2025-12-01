import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, required: true, ref: "QuizModel" },
    title: { type: String, required: true },
    questionType: {
      type: String,
      enum: ["Multiple Choice", "True/False", "Fill in the Blank"],
      required: true,
    },
    points: { type: Number, default: 0 },
    question: { type: String, default: "" }, // WYSIWYG content stored as HTML string
    // For Multiple Choice
    choices: [{ type: String }], // Array of choice texts
    correctChoice: { type: Number, default: 0 }, // Index of correct choice
    // For True/False
    correctAnswer: { type: Boolean, default: true }, // true or false
    // For Fill in the Blank
    possibleAnswers: [{ type: String }], // Array of possible correct answers
    caseSensitive: { type: Boolean, default: false },
  },
  { collection: "questions" }
);

export default questionSchema;

