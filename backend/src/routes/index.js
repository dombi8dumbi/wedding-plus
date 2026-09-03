import { Router } from "express";
import Wedding from "../models/Wedding.js";
import Task from "../models/Task.js";
import Guest from "../models/Guest.js";
import Vendor from "../models/Vendor.js";
import BudgetItem from "../models/BudgetItem.js";
import TimelineItem from "../models/TimelineItem.js";
import Alert from "../models/Alert.js";
import authRouter from "./auth.js";
import { createCrudRouter } from "./crudFactory.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/weddings", createCrudRouter(Wedding, { filterField: "status" }));
router.use("/tasks", createCrudRouter(Task));
router.use("/guests", createCrudRouter(Guest));
router.use("/vendors", createCrudRouter(Vendor));
router.use("/budget", createCrudRouter(BudgetItem));
router.use("/timeline", createCrudRouter(TimelineItem));
router.use("/alerts", createCrudRouter(Alert));

router.get("/dashboard/:weddingId", async (req, res, next) => {
  try {
    const weddingId = req.params.weddingId;
    const [wedding, tasks, guests, vendors, budget, timeline, unreadAlerts] = await Promise.all([
      Wedding.findById(weddingId),
      Task.find({ wedding: weddingId }),
      Guest.find({ wedding: weddingId }),
      Vendor.find({ wedding: weddingId }),
      BudgetItem.find({ wedding: weddingId }),
      TimelineItem.find({ wedding: weddingId }).sort({ startTime: 1 }),
      Alert.countDocuments({ wedding: weddingId, read: false })
    ]);

    if (!wedding) return res.status(404).json({ success: false, message: "Mariage introuvable" });

    const completedTasks = tasks.filter((task) => task.status === "done").length;
    const confirmedGuests = guests.filter((guest) => guest.rsvp === "confirmed").length;
    const bookedVendors = vendors.filter((vendor) => ["booked", "paid"].includes(vendor.status)).length;
    const spent = budget.reduce((sum, item) => sum + (item.actual || 0), 0);
    const estimated = budget.reduce((sum, item) => sum + (item.estimated || 0), 0);

    res.json({
      success: true,
      data: {
        wedding,
        stats: {
          tasks: { completed: completedTasks, total: tasks.length },
          guests: { confirmed: confirmedGuests, total: guests.length },
          vendors: { booked: bookedVendors, total: vendors.length },
          budget: { spent, estimated, target: wedding.budgetTarget },
          unreadAlerts
        },
        nextTasks: tasks.filter((task) => task.status !== "done").slice(0, 5),
        timeline: timeline.slice(0, 8)
      }
    });
  } catch (error) { next(error); }
});

export default router;
