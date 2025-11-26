import * as modulesDao from "./dao.js";

export default function ModuleRoutes(app) {
  const findModuleById = async (req, res) => {
    const { moduleId } = req.params;
    const module = await modulesDao.findModuleById(moduleId);
    if (module) {
      res.json(module);
    } else {
      res.status(404).json({ message: "Module not found" });
    }
  };

  const deleteModule = async (req, res) => {
    const { moduleId } = req.params;
    await modulesDao.deleteModule(moduleId);
    res.json({ status: "Module deleted successfully" });
  };

  const updateModule = async (req, res) => {
    const { moduleId } = req.params;
    const moduleUpdates = req.body;
    const updatedModule = await modulesDao.updateModule(moduleId, moduleUpdates);
    if (updatedModule) {
      res.json(updatedModule);
    } else {
      res.status(404).json({ message: "Module not found" });
    }
  };

  app.get("/api/modules/:moduleId", findModuleById);
  app.put("/api/modules/:moduleId", updateModule);
  app.delete("/api/modules/:moduleId", deleteModule);
}

