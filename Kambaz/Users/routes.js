import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
  // Create a new user (Faculty only in production, but open for testing)
  const createUser = async (req, res) => {
    const existingUser = await dao.findUserByUsername(req.body.username);
    if (existingUser) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const newUser = await dao.createUser(req.body);
    res.json(newUser);
  };

  // Delete a user by ID
  const deleteUser = async (req, res) => {
    const { userId } = req.params;
    const status = await dao.deleteUser(userId);
    res.json(status);
  };

  // Get all users with optional filters
  const findAllUsers = async (req, res) => {
    try {
      const { role, name } = req.query;
      
      console.log("Query params - role:", role, "name:", name);
      
      // Handle both role and name filters together
      if (role && name) {
        console.log("Filtering by both role and name");
        const users = await dao.findUsersByRoleAndName(role, name);
        console.log("Found users:", users?.length);
        res.json(users);
        return;
      }
      
      // Handle role filter only
      if (role) {
        console.log("Filtering by role only:", role);
        const users = await dao.findUsersByRole(role);
        console.log("Found users:", users?.length);
        res.json(users);
        return;
      }
      
      // Handle name filter only
      if (name) {
        console.log("Filtering by name only:", name);
        const users = await dao.findUsersByPartialName(name);
        console.log("Found users:", users?.length);
        res.json(users);
        return;
      }
      
      // No filters - return all users
      console.log("No filters - returning all users");
      const users = await dao.findAllUsers();
      console.log("Found users:", users?.length);
    res.json(users);
    } catch (error) {
      console.error("Error in findAllUsers:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // Get a user by ID
  const findUserById = async (req, res) => {
    const { userId } = req.params;
    const user = await dao.findUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  };

  // Update a user by ID
  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    const updatedUser = await dao.findUserById(userId);
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
      req.session["currentUser"] = updatedUser.toObject ? updatedUser.toObject() : updatedUser;
    }
    res.json(updatedUser.toObject ? updatedUser.toObject() : updatedUser);
  };

  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const user = await dao.findUserById(currentUser._id);
    res.json(user);
  };

  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = courseDao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const newCourse = courseDao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  // Get all users enrolled in a specific course
  const findUsersForCourse = async (req, res) => {
    const { courseId } = req.params;
    const users = await dao.findUsersForCourse(courseId);
    res.json(users);
  };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
  app.post("/api/users/current/courses", createCourse);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.get("/api/courses/:courseId/users", findUsersForCourse);
}

