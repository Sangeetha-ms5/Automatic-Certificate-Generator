import express from "express";
import Event from "../models/Event.js";

const router = express.Router();

/* =========================
   CREATE EVENT
========================= */
router.post("/", async (req, res) => {
  try {
    const { name, type, date, participants } = req.body;

    const event = await Event.create({
      name,
      type, // ✅ IMPORTANT (must match schema)
      date,
      participants,
      status: "active",
    });

    res.status(201).json(event);
  } catch (error) {
    console.log("CREATE EVENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   GET ALL EVENTS
========================= */
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    console.log("FETCH EVENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   UPDATE EVENT
========================= */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   DELETE EVENT
========================= */
router.delete("/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Event deleted" });
  } catch (error) {
    console.log("DELETE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   TOGGLE STATUS
========================= */
router.patch("/:id/status", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.status = event.status === "active" ? "inactive" : "active";

    await event.save();

    res.json(event);
  } catch (error) {
    console.log("TOGGLE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;