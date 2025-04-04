var express = require("express");
var router = express.Router();
var orderSchema = require("../models/order_model");

router.get("/", async function (req, res, next) {
  let orders = await orderSchema.find({});
  if (orders.length == 0) {
    return res.status(400).send({
      status: 400,
      message: "ไม่พบข้อมูลการสั่งซื้อ",
      data: orders,
    });
  } else {
    res.status(201).send({
      satus: 201,
      message: "ข้อมูลการสั่งซื้อ",
      data: orders,
    });
  }
});

module.exports = router;
