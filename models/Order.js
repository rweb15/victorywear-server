
import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  items: [{
    productId: String,
    name: String,
    category: String,
    sizeQty: Object,
    color: String,
    decorationType: String,
    decorationDetails: Object,
    ssCost: Number,
    finalPrice: Number
  }],
  total: Number,
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("Order", orderSchema);
