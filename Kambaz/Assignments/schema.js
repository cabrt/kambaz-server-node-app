import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    _id: String,
    title: { type: String, required: true },
    course: { type: String, required: true, ref: "CourseModel" },
    description: String,
    points: Number,
    dueDate: Date,
    availableDate: Date,
    availableUntil: Date,
  },
  { collection: "assignments" }
);

export default assignmentSchema;

