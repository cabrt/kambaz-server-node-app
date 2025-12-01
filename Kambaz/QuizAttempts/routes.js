import * as attemptsDao from "./dao.js";
import * as quizzesDao from "../Quizzes/dao.js";

export default function QuizAttemptRoutes(app) {
  const findAttemptsForUser = async (req, res) => {
    const { quizId } = req.params;
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const attempts = await attemptsDao.findAttemptsForUser(quizId, currentUser._id);
    res.json(attempts);
  };

  const findLatestAttempt = async (req, res) => {
    const { quizId } = req.params;
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const attempt = await attemptsDao.findLatestAttempt(quizId, currentUser._id);
    if (attempt) {
      res.json(attempt);
    } else {
      res.status(404).json({ message: "No attempt found" });
    }
  };

  const createAttempt = async (req, res) => {
    const { quizId } = req.params;
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    const quiz = await quizzesDao.findQuizById(quizId);
    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    // Check if user has attempts remaining
    const existingAttempts = await attemptsDao.findAttemptsForUser(quizId, currentUser._id);
    const submittedAttempts = existingAttempts.filter((a) => a.submittedAt);
    const maxAttempts = quiz.multipleAttempts ? (quiz.attemptsAllowed || 1) : 1;

    if (submittedAttempts.length >= maxAttempts) {
      res.status(403).json({ message: "Maximum attempts reached" });
      return;
    }

    const attemptNumber = await attemptsDao.getNextAttemptNumber(quizId, currentUser._id);
    const attempt = {
      quiz: quizId,
      user: currentUser._id,
      attemptNumber,
      answers: [],
    };

    const newAttempt = await attemptsDao.createAttempt(attempt);
    res.json(newAttempt);
  };

  const submitAttempt = async (req, res) => {
    const { attemptId } = req.params;
    const { answers } = req.body;
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    const attempt = await attemptsDao.findAttemptById(attemptId);
    if (!attempt) {
      res.status(404).json({ message: "Attempt not found" });
      return;
    }

    if (attempt.user !== currentUser._id) {
      res.sendStatus(403);
      return;
    }

    if (attempt.submittedAt) {
      res.status(400).json({ message: "Attempt already submitted" });
      return;
    }

    const submittedAttempt = await attemptsDao.submitAttempt(attemptId, answers);
    res.json(submittedAttempt);
  };

  const findAttemptById = async (req, res) => {
    const { attemptId } = req.params;
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    const attempt = await attemptsDao.findAttemptById(attemptId);
    if (!attempt) {
      res.status(404).json({ message: "Attempt not found" });
      return;
    }

    if (attempt.user !== currentUser._id) {
      res.sendStatus(403);
      return;
    }

    res.json(attempt);
  };

  // Register routes
  app.get("/api/quizzes/:quizId/attempts", findAttemptsForUser);
  app.get("/api/quizzes/:quizId/attempts/latest", findLatestAttempt);
  app.post("/api/quizzes/:quizId/attempts", createAttempt);
  app.post("/api/attempts/:attemptId/submit", submitAttempt);
  app.get("/api/attempts/:attemptId", findAttemptById);
}

