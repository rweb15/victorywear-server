
import express from "express";
import jwt from "jsonwebtoken";
import Order from "../models/Order.js";
const router = express.Router();

function auth(req,res,next){
  const token=req.headers.authorization?.split(" ")[1];
  if(!token) return res.status(401).json({msg:"No token"});
  try{ req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch{ return res.status(401).json({msg:"Invalid token"}); }
}

router.post("/", auth, async (req,res)=>{
  const order = await Order.create({ userId:req.user.id, ...req.body });
  res.json(order);
});

router.get("/", auth, async (req,res)=>{
  const orders = await Order.find({ userId:req.user.id }).sort({createdAt:-1});
  res.json(orders);
});

export default router;
