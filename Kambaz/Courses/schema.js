import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    _id: String,
    name: { type: String, required: true },
    number: String,
    startDate: Date,
    endDate: Date,
    department: String,
    credits: Number,
    description: String,
    image: String,
  },
  { collection: "courses" }
);

export default courseSchema;

