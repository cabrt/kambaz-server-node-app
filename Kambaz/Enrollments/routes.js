import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
  // Enroll a user in a course
  const enrollUserInCourse = (req, res) => {
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
    
    const enrollment = dao.createEnrollment(userId, courseId);
    res.json(enrollment);
  };

  // Unenroll a user from a course
  const unenrollUserFromCourse = (req, res) => {
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
    
    dao.deleteEnrollment(userId, courseId);
    res.sendStatus(200);
  };

  // Get all enrollments for a specific user
  const findEnrollmentsForUser = (req, res) => {
    const { userId } = req.params;
    const enrollments = dao.findEnrollmentsByUser(userId);
    res.json(enrollments);
  };

  // Get all enrollments for the current user
  const findEnrollmentsForCurrentUser = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const enrollments = dao.findEnrollmentsByUser(currentUser._id);
    res.json(enrollments);
  };

  // Get all enrollments for a specific course
  const findEnrollmentsForCourse = (req, res) => {
    const { courseId } = req.params;
    const enrollments = dao.findEnrollmentsByCourse(courseId);
    res.json(enrollments);
  };

  // Get all enrollments (useful for admin/faculty)
  const findAllEnrollments = (req, res) => {
    const enrollments = dao.findAllEnrollments();
    res.json(enrollments);
  };

  app.post("/api/enrollments", enrollUserInCourse);
  app.delete("/api/enrollments", unenrollUserFromCourse);
  app.get("/api/enrollments", findAllEnrollments);
  app.get("/api/courses/:courseId/enrollments", findEnrollmentsForCourse);
  app.get("/api/users/current/enrollments", findEnrollmentsForCurrentUser);
  app.get("/api/users/:userId/enrollments", findEnrollmentsForUser);
}

