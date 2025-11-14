import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";

const app = express();
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.CLIENT_URL,
        "http://localhost:3000",
      ];
      
      // Allow Vercel preview deployments
      if (origin && origin.includes("vercel.app")) {
        return callback(null, true);
      }
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};

if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}

app.use(session(sessionOptions));
app.use(express.json());

UserRoutes(app);
CourseRoutes(app);
EnrollmentRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
Lab5(app);
Hello(app);

const port = process.env.PORT || 4000;
app.listen(port);

