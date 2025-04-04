var express = require("express");
var router = express.Router();
var userSchema = require("../models/user_model");
const jwt = require('jsonwebtoken');
var bcrypt = require("bcrypt");


router.post("/", async function (req, res, next) {
  try {
    const { username, password } = req.body;
    const users = await userSchema.findOne({ username });
    if (!users) {
      return res.status(401).json({
        status: 401,
        message: "ไม่มีข้อมูลผู้ใช้ในระบบ",
        data: []
      });
    }
    if (bcrypt.compareSync(password, users.password)) {
      if(users.role == null){
        return res.status(401).json({
          status: 401,
          message: "กรุณารอการอนุมัติผู้ใช้",
          data: []
        });
      }
      const token = jwt.sign({ id: users._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({
        status: 200,
        message: "เข้าสู่ระบบสำเร็จ",
        data: {
          token: token,
          data: users,
        } ,
      });
    } else {
      res.status(401).json({
        status: 401,
        message: "รหัสผ่านไม่ถูกต้อง",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
      data: null,
      error: error.message,
    });
  }
});

module.exports = router;
