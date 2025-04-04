const userSchema = require("../models/user_model"); 

const checkUsername = async (req, res, next) => {
  try {
    const { username } = req.body;

    const User = await userSchema.findOne({ username });

    if (User) {
      return res.status(400).json({
        status: 400,
        message: "ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว",
        data: null,
      });
    }

    next(); 
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "เกิดข้อผิดพลาดในการตรวจสอบชื่อผู้ใช้",
      data: null,
      error: error.message,
    });
  }
};

module.exports = checkUsername;
