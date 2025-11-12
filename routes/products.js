
import express from "express";
import axios from "axios";
import { garmentSalePrice } from "../utils/pricing.js";
const router = express.Router();

const catMap = {
  "Tees": "T-Shirts",
  "Sweaters": "Sweatshirts",
  "Headwear": "Headwear",
  "Pants": "Pants",
  "Jackets": "Jackets",
  "Safety": "Safety"
};

router.get("/", async (req,res)=>{
  try{
    const { category } = req.query;
    const mapped = catMap[category] || category;
    const r = await axios.get("https://api.ssactivewear.ca/v1/products", {
      headers: { Authorization: `Bearer ${process.env.SS_API_KEY}` },
      params: { category: mapped, country: "CA" }
    });
    const items = (r.data || []).map(p=> ({
      id: p.id,
      name: p.name,
      category: p.categoryName || mapped,
      image: (p.images && p.images[0] && p.images[0].url) || "",
      cost: p.price,
      salePrice: garmentSalePrice(p.price)
    }));
    res.json(items);
  }catch(e){
    res.status(500).json({ msg: e.message });
  }
});

router.get("/:id", async (req,res)=>{
  try{
    const { id } = req.params;
    const r = await axios.get(`https://api.ssactivewear.ca/v1/products/${id}`, {
      headers: { Authorization: `Bearer ${process.env.SS_API_KEY}` }
    });
    const p = r.data;
    res.json({
      id: p.id, name: p.name, description: p.description,
      images: p.images || [], colors: p.colors || [], sizes: p.sizes || [],
      cost: p.price, salePrice: garmentSalePrice(p.price)
    });
  }catch(e){ res.status(500).json({ msg:e.message }); }
});

export default router;
