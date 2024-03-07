import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import userinfo from "../middlewares/userinfo.js";

const router = express.Router();

// 메뉴 주문
router.post("/orders", authenticate, userinfo, async (req, res, next) => {
  try {
    const { menuId, quantity } = req.body;

    // 메뉴 접근 객체 생성
    const menu = await prisma.menus.findUnique({
      where: {
        menuId: menuId,
      },
    });

    if (!menu || menu.quantity < quantity) {
      return res
        .status(400)
        .json({ message: "주문 불가능한 메뉴거나 재고가 부족합니다." });
    }

    // 메뉴 수량 업데이트
    await prisma.menus.update({
      where: { menuId: menuId },
      data: { quantity: menu.quantity - quantity },
    });

    if(menu.quantity == 0){
      await prisma.menus.update({
        where:{
          menuId : menu.menuId,
        },
        data:{
          status: "SOLD_OUT",
        }
      })
    }

    // 주문 생성
    const order = await prisma.orders.create({
      data: {
        menuId,
        quantity,
        nickname: req.user.nickname,
        userId: req.user.userId,
        totalPrice: menu.price * quantity,
      },
    });

    return res.status(201).json({ message: "메뉴 주문에 성공하였습니다." });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 주문 내역 조회 (소비자)
router.get(
  "/orders/customer",
  authenticate,
  userinfo,
  async (req, res, next) => {
    const orders = await prisma.orders.findMany({
      select: {
        menuId: true,
        quantity: true,
        status: true,
        createdAt: true,
      },
      where: {
        userId: req.user.userId,
      },
    });
    return res.status(200).json({ data: orders });
  }
);

// 주문 내역 조회 (사장님)
router.get("/orders/owner", authenticate, authorize, async (req, res, next) => {
  const orders = await prisma.orders.findMany({
    include: {
      user: true,
      menu: true,
    },
  });

  const responseData = orders.map((order) => ({
    id: order.OrderId,
    user: {
      id: order.user.userId,
      nickname: order.user.nickname,
    },
    menu: {
      name: order.menu.name,
      price: order.menu.price,
    },
    quantity: order.quantity,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    totalPrice: order.totalPrice,
  }));
});

// 주문 내역 상태 변경 (PATCH)
router.patch(
  "/orders/:orderId/status",
  authenticate,
  authorize,
  async (req, res, next) => {
    const { orderId } = req.params;
    const { status } = req.body;

    await prisma.orders.update({
      where: { OrderId: +orderId },
      data: { status },
    });
    return res.status(200).json({ message: "주문 내역을 수정하였습니다." });
  }
);

export default router;
