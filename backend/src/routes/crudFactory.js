import { Router } from "express";

export function createCrudRouter(Model, options = {}) {
  const router = Router();
  const filterField = options.filterField || "wedding";

  router.get("/", async (req, res, next) => {
    try {
      const filter = req.query[filterField] ? { [filterField]: req.query[filterField] } : {};
      const docs = await Model.find(filter).sort({ createdAt: -1 });
      res.json({ success: true, data: docs });
    } catch (error) { next(error); }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const doc = await Model.findById(req.params.id);
      if (!doc) return res.status(404).json({ success: false, message: "Ressource introuvable" });
      res.json({ success: true, data: doc });
    } catch (error) { next(error); }
  });

  router.post("/", async (req, res, next) => {
    try {
      const doc = await Model.create(req.body);
      res.status(201).json({ success: true, data: doc });
    } catch (error) { next(error); }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!doc) return res.status(404).json({ success: false, message: "Ressource introuvable" });
      res.json({ success: true, data: doc });
    } catch (error) { next(error); }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ success: false, message: "Ressource introuvable" });
      res.json({ success: true, message: "Suppression effectuée" });
    } catch (error) { next(error); }
  });

  return router;
}
