import "dotenv/config";
import mongoose from "mongoose";
import coursesData from "./Kambaz/Database/courses.js";
import modulesData from "./Kambaz/Database/modules.js";
import assignmentsData from "./Kambaz/Database/assignments.js";
import CourseModel from "./Kambaz/Courses/model.js";
import ModuleModel from "./Kambaz/Modules/model.js";
import AssignmentModel from "./Kambaz/Assignments/model.js";

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";

async function importData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(CONNECTION_STRING);
    console.log("Connected to MongoDB");

    // Clear existing collections (optional - comment out if you want to keep existing data)
    await CourseModel.deleteMany({});
    await ModuleModel.deleteMany({});
    await AssignmentModel.deleteMany({});
    console.log("Cleared existing collections");

    // Import courses - convert date strings to Date objects
    const coursesToImport = coursesData.map(course => ({
      ...course,
      startDate: course.startDate ? new Date(course.startDate) : undefined,
      endDate: course.endDate ? new Date(course.endDate) : undefined,
    }));
    const courses = await CourseModel.insertMany(coursesToImport);
    console.log(`Imported ${courses.length} courses`);

    // Import modules
    const modules = await ModuleModel.insertMany(modulesData);
    console.log(`Imported ${modules.length} modules`);

    // Import assignments - convert date strings to Date objects
    const assignmentsToImport = assignmentsData.map(assignment => ({
      ...assignment,
      dueDate: assignment.dueDate ? new Date(assignment.dueDate) : undefined,
      availableDate: assignment.availableDate ? new Date(assignment.availableDate) : undefined,
    }));
    const assignments = await AssignmentModel.insertMany(assignmentsToImport);
    console.log(`Imported ${assignments.length} assignments`);

    console.log("Data import completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
}

importData();

