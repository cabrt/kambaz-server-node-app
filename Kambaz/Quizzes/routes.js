import * as dao from "./dao.js";

export default function QuizRoutes(app) {
  const findQuizzesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const quizzes = await dao.findQuizzesForCourse(courseId);
    res.json(quizzes);
  };

  const findQuizById = async (req, res) => {
    const { quizId } = req.params;
    const quiz = await dao.findQuizById(quizId);
    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ message: "Quiz not found" });
    }
  };

  const createQuiz = async (req, res) => {
    try {
      const { courseId } = req.params;
      const quiz = {
        ...req.body,
        course: courseId,
      };
      const newQuiz = await dao.createQuiz(quiz);
      res.json(newQuiz);
    } catch (error) {
      console.error("Error creating quiz:", error);
      res.status(500).json({ error: "Failed to create quiz", message: error.message });
    }
  };

  const deleteQuiz = async (req, res) => {
    const { quizId } = req.params;
    await dao.deleteQuiz(quizId);
    res.json({ status: "Quiz deleted successfully" });
  };

  const updateQuiz = async (req, res) => {
    try {
      const { quizId } = req.params;
      const quizUpdates = req.body;
      // Remove _id from updates as MongoDB doesn't allow updating _id
      const { _id, ...updatesWithoutId } = quizUpdates;
      console.log("Updating quiz:", { quizId, updates: updatesWithoutId });
      const updatedQuiz = await dao.updateQuiz(quizId, updatesWithoutId);
      if (updatedQuiz) {
        res.json(updatedQuiz);
      } else {
        res.status(404).json({ message: "Quiz not found" });
      }
    } catch (error) {
      console.error("Error updating quiz:", error);
      res.status(500).json({ error: "Failed to update quiz", message: error.message });
    }
  };

  // Register routes
  app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
  app.get("/api/quizzes/:quizId", findQuizById);
  app.post("/api/courses/:courseId/quizzes", createQuiz);
  app.delete("/api/quizzes/:quizId", deleteQuiz);
  app.put("/api/quizzes/:quizId", updateQuiz);
}

