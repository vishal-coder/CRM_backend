import express from "express";
import {
  createLead,
  deleteLead,
  getLeads,
  MarkLeadAsContact,
} from "../controllers/LeadController.js";

import { leadValidation } from "../validations/LeadValidation.js";

const router = express.Router();
router.get("/", (req, res) => {
  res.send("lead route working");
});

router.post("/create", leadValidation(), createLead);
router.post("/getAll", getLeads);
router.delete("/delete", deleteLead);
router.post("/markAsContact", MarkLeadAsContact);

export const leadRouter = router;
