var express = require("express");
var router = express.Router();
var userSchema = require("../models/user_model");
var checkUsername = require("../middleware/checkUsername");
var tokenMiddleware = require("../middleware/token.middleware");
var bcrypt = require("bcrypt");

router.get("/",tokenMiddleware, async function (req, res, next) {
  let users = await userSchema.find({});
  res.status(201).send({
    status: 201,
    message: "ข้อมูลผู้ใช้ทั้งหมด",
    data: users,
  });
});

router.post("/register", checkUsername, async function (req, res, next) {
  try {
    let { username, password } = req.body;

    let user = new userSchema({
      username: username,
      password: await bcrypt.hash(password, 10),
      role: null,
    });

    await user.save();

    res.status(201).send({
      status: 201,
      message: "ลงทะเบียนสำเร็จ",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "เกิดข้อผิดพลาดในการตรวจสอบชื่อผู้ใช้",
      data: null,
      error: error.message,
    });
  }
});

router.put("/users/:id/approve", async function (req, res, next) {
  try {
    let { id } = req.params;
    let { role } = req.body;
    if (role == "admin") {
      let user = await userSchema.findByIdAndUpdate(
        id,
        {
          role: "user",
        },
        { new: true }
      );
      res.status(200).send({
        status: 200,
        message: "อนุมัติผู้ใช้สำเร็จ",
        data: user,
      });
    }else {
      res.status(401).send({
        status: 401,
        message: "คุณไม่มีสิทธิ์ในการอนุมัติผู้ใช้",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "เกิดข้อผิดพลาดในการอนุมัติผู้ใช้",
      data: null,
      error: error.message,
    });
  }
});

module.exports = router;
