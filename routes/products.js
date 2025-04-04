var express = require("express");
var router = express.Router();
var productSchema = require("../models/product_model");
var orderSchema = require("../models/order_model");
var tokenMiddleware = require("../middleware/token.middleware");

router.get("/", tokenMiddleware, async function (req, res, next) {
  let products = await productSchema.find({});
  if (products.length == 0) {
    return res.status(400).send({
      status: 400,
      message: "ไม่พบข้อมูลสินค้า",
      data: products,
    });
  } else {
    res.status(200).send({
      satus: 200,
      message: "ข้อมูลสินค้า",
      data: products,
    });
  }
});

router.get("/:id", tokenMiddleware, async function (req, res, next) {
  try {
    let { id } = req.params;
    let products = await productSchema.findById(id);
    res.status(201).send({
      satus: 201,
      message: "ข้อมูลสินค้า",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า",
      data: null,
      error: error.message,
    });
  }
});

router.post("/", tokenMiddleware, async function (req, res, next) {
  try {
    let { name, price, quantity } = req.body;

    let product = new productSchema({
      name: name,
      price: price,
      quantity: quantity,
    });

    await product.save();

    res.status(201).send({
      satus: 201,
      message: "เพิ่มสินค้าสำเร็จ",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "เกิดข้อผิดพลาดในการเพิ่มสินค้า",
      data: null,
      error: error.message,
    });
  }
});

router.put("/:id", tokenMiddleware, async function (req, res, next) {
  try {
    let { id } = req.params;
    let { name, price, quantity } = req.body;
    let product = await productSchema.findById(id);

    if (!product) {
      return res.status(400).send({
        status: 400,
        message: "ไม่พบข้อมูลสินค้า",
        data: [],
      });
    }
    product = await productSchema.findByIdAndUpdate(
      id,
      {
        name: name,
        price: price,
        quantity: quantity,
      },
      { new: true }
    );
    res.status(201).send({
      status: 201,
      message: "แก้ไขสินค้าสำเร็จ",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "เกิดข้อผิดพลาดในการเพิ่มสินค้า",
      data: null,
      error: error.message,
    });
  }
});

router.delete("/:id", tokenMiddleware, async function (req, res, next) {
  try {
    let { id } = req.params;

    let product = await productSchema.findByIdAndDelete(id);

    res.status(201).send({
      status: 201,
      message: "ลบสินค้าสำเร็จ",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "เกิดข้อผิดพลาดในการลบสินค้า",
      data: null,
      error: error.message,
    });
  }
});

router.get("/:id/orders", tokenMiddleware, async function (req, res, next) {
  try {
    let { id } = req.params;
    console.log(id);
    let orders = await orderSchema
      .find({ productId: id })
      .populate("productId");
    console.log(orders);
    if (orders.length == 0) {
      return res.status(400).send({
        status: 400,
        message: "ไม่พบข้อมูลการสั่งซื้อของสินค้านี้",
        data: [],
      });
    } else {
      res.status(200).send({
        status: 200,
        message: "ข้อมูลการสั่งซื้อของสินค้านี้",
        data: orders,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลการสั่งซื้อ",
      data: null,
      error: error.message,
    });
  }
});

router.post("/:id/orders", tokenMiddleware, async function (req, res, next) {
  try {
    let { id } = req.params;
    let { quantity } = req.body;
    let product = await productSchema.findById(id).populate("orders");
    if (quantity > product.quantity) {
      return res.status(400).send({
        status: 400,
        message: "จำนวนสินค้าที่สั่งซื้อมากกว่าที่มีในสต๊อก",
        data: null,
      });
    } else {
      let orders = new orderSchema({
        productId: id,
        quantity: quantity,
        totalPrice: quantity * product.price,
      });

      res.status(201).send({
        status: 201,
        message: "เพิ่มการสั่งซื้อสำเร็จ",
        data: orders,
      });
      await orders.save();
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "เกิดข้อผิดพลาดในการสั่งซื้อ",
      data: null,
      error: error.message,
    });
  }
});

module.exports = router;
