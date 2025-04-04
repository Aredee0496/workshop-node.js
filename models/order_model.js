const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
      },
    quantity: { type: Number },
    totalPrice: { type: Number }
  }
)

module.exports = mongoose.model("orders", orderSchema);
