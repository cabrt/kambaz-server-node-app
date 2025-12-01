import * as questionsDao from "./dao.js";

export default function QuestionRoutes(app) {
  const findQuestionsForQuiz = async (req, res) => {
    const { quizId } = req.params;
    const questions = await questionsDao.findQuestionsForQuiz(quizId);
    res.json(questions);
  };

  const findQuestionById = async (req, res) => {
    const { questionId } = req.params;
    const question = await questionsDao.findQuestionById(questionId);
    if (question) {
      res.json(question);
    } else {
      res.status(404).json({ message: "Question not found" });
    }
  };

  const createQuestion = async (req, res) => {
    const { quizId } = req.params;
    const question = {
      ...req.body,
      quiz: quizId,
    };
    const newQuestion = await questionsDao.createQuestion(question);
    res.json(newQuestion);
  };

  const deleteQuestion = async (req, res) => {
    const { questionId } = req.params;
    await questionsDao.deleteQuestion(questionId);
    res.json({ status: "Question deleted successfully" });
  };

  const updateQuestion = async (req, res) => {
    const { questionId } = req.params;
    const { _id, ...questionUpdates } = req.body; // Remove _id from updates
    const updatedQuestion = await questionsDao.updateQuestion(questionId, questionUpdates);
    if (updatedQuestion) {
      res.json(updatedQuestion);
    } else {
      res.status(404).json({ message: "Question not found for update" });
    }
  };

  // Register routes
  app.get("/api/quizzes/:quizId/questions", findQuestionsForQuiz);
  app.get("/api/questions/:questionId", findQuestionById);
  app.post("/api/quizzes/:quizId/questions", createQuestion);
  app.delete("/api/questions/:questionId", deleteQuestion);
  app.put("/api/questions/:questionId", updateQuestion);
}

