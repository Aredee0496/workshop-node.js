const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    orders: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'orders'
    }
  }
)

module.exports = mongoose.model("products", productSchema);
