import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { nickname, password } = req.body;
    const user = await prisma.users.findFirst({ where: { nickname } });

    if (!user || !(await argon2.verify(user.password, password))) {
      throw new Error("loginError");
    }

    const token = jwt.sign(
      {
        userId: user.userId,
        usertype: user.usertype,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res
      .cookie("token", `Bearer ${token}`, { httpOnly: true })
      .status(200)
      .json({
        message: "로그인 성공",
      });
  } catch (err) {
    next(err);
  }
});


export default router;