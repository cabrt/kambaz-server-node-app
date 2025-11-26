import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
  // Health check for debugging
  app.get("/api/courses/health", (req, res) => {
    res.json({ status: "ok", message: "Courses routes are working" });
  });

  const findAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    res.json(courses);
  };

  const findCourseById = async (req, res) => {
    const { courseId } = req.params;
    const course = await dao.findCourseById(courseId);
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  };

  const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    const status = await dao.deleteCourse(courseId);
    res.send(status);
  };

  const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  };

  const createCourse = async (req, res) => {
    try {
      console.log("Create course request received:", {
        body: req.body,
        method: req.method,
        path: req.path,
        url: req.url,
      });
      const course = await dao.createCourse(req.body);
      const currentUser = req.session["currentUser"];
      if (currentUser) {
        await enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);
      }
      res.json(course);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ error: "Failed to create course", message: error.message });
    }
  };

  const findModulesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const modules = await modulesDao.findModulesForCourse(courseId);
    res.json(modules);
  };

  const createModuleForCourse = async (req, res) => {
    const { courseId } = req.params;
    const module = {
      ...req.body,
      course: courseId,
    };
    const newModule = await modulesDao.createModule(module);
    res.send(newModule);
  };

  const findUsersForCourse = async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(cid);
    res.json(users);
  };

  // Register routes in order: specific routes first, then general routes
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.get("/api/courses/:cid/users", findUsersForCourse);
  app.get("/api/courses/:courseId", findCourseById);
  app.put("/api/courses/:courseId", updateCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
  // General routes last to avoid matching specific routes
  app.post("/api/courses", createCourse);
  app.get("/api/courses", findAllCourses);
}

