import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
  const findAssignmentsForCourse = async (req, res) => {
    const { courseId } = req.params;
    const assignments = await assignmentsDao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  };

  const findAssignmentById = async (req, res) => {
    const { assignmentId } = req.params;
    const assignment = await assignmentsDao.findAssignmentById(assignmentId);
    if (assignment) {
      res.json(assignment);
    } else {
      res.status(404).json({ message: "Assignment not found" });
    }
  };

  const createAssignment = async (req, res) => {
    const { courseId } = req.params;
    const assignment = {
      ...req.body,
      course: courseId,
    };
    const newAssignment = await assignmentsDao.createAssignment(assignment);
    res.json(newAssignment);
  };

  const deleteAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    await assignmentsDao.deleteAssignment(assignmentId);
    res.json({ status: "Assignment deleted successfully" });
  };

  const updateAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    const assignmentUpdates = req.body;
    const updatedAssignment = await assignmentsDao.updateAssignment(assignmentId, assignmentUpdates);
    if (updatedAssignment) {
    res.json(updatedAssignment);
    } else {
      res.status(404).json({ message: "Assignment not found" });
    }
  };

  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.get("/api/assignments/:assignmentId", findAssignmentById);
  app.post("/api/courses/:courseId/assignments", createAssignment);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
  app.put("/api/assignments/:assignmentId", updateAssignment);
}

