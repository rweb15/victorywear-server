
import express from "express";
import { embroideryCost, screenPrintCost } from "../utils/pricing.js";
const router = express.Router();

router.post("/", (req,res)=>{
  const { type, stitchCount=0, colors=1, size="4\" x 4\"", qty=1 } = req.body;
  let unit = 0;
  if(type==="embroidery") unit = embroideryCost(stitchCount, qty);
  else if(type==="screen") unit = screenPrintCost(colors, size, qty);
  res.json({ unitCost: unit });
});

export default router;
