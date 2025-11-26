import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
  // Enroll a user in a course
  const enrollUserInCourse = async (req, res) => {
    let { userId, courseId } = req.body;
    
    // If userId is "current", use the current user from session
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    
    const enrollment = await dao.enrollUserInCourse(userId, courseId);
    res.json(enrollment);
  };

  // Unenroll a user from a course
  const unenrollUserFromCourse = async (req, res) => {
    let { userId, courseId } = req.body;
    
    // If userId is "current", use the current user from session
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    
    await dao.unenrollUserFromCourse(userId, courseId);
    res.sendStatus(200);
  };

  // Get all enrollments for a specific user
  const findEnrollmentsForUser = async (req, res) => {
    const { userId } = req.params;
    const enrollments = await dao.findEnrollmentsByUser(userId);
    res.json(enrollments);
  };

  // Get all enrollments for the current user
  const findEnrollmentsForCurrentUser = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const enrollments = await dao.findEnrollmentsByUser(currentUser._id);
    res.json(enrollments);
  };

  // Get all enrollments for a specific course
  const findEnrollmentsForCourse = async (req, res) => {
    const { courseId } = req.params;
    const enrollments = await dao.findEnrollmentsByCourse(courseId);
    res.json(enrollments);
  };

  // Get all enrollments (useful for admin/faculty)
  const findAllEnrollments = async (req, res) => {
    const enrollments = await dao.findAllEnrollments();
    res.json(enrollments);
  };

  app.post("/api/enrollments", enrollUserInCourse);
  app.delete("/api/enrollments", unenrollUserFromCourse);
  app.get("/api/enrollments", findAllEnrollments);
  app.get("/api/courses/:courseId/enrollments", findEnrollmentsForCourse);
  app.get("/api/users/current/enrollments", findEnrollmentsForCurrentUser);
  app.get("/api/users/:userId/enrollments", findEnrollmentsForUser);
}

