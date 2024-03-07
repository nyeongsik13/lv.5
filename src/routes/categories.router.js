import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { createCategorySchema } from "../middlewares/validation/Validation.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

// 카테고리 등록
router.post('/categories',authenticate, authorize, async (req, res, next) => {
    try {
        const { name } = await createCategorySchema.validateAsync(req.body);
        // 카테고리 생성
        const category = await prisma.categories.create({
            data: {
                name,
                order: (await prisma.categories.count()) + 1, // 현재 카테고리의 개수 + 1을 order 값으로 사용
            }, //  현재까지 데이터베이스에 저장된 카테고리의 개수를 반환
        });

        return res.status(201).json({ message: '카테고리를 등록하였습니다' });
    } catch (error) {
        next(error);
    }
});

/** 카테고리 전체 목록 조회 API **/
router.get("/categories", async (req, res, next) => {
  try {
    const categories = await prisma.categories.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: { order: "asc" },
    });
    return res.status(200).json({ data: categories });
  } catch (error) {
    next(error);
  }
});

/** 카테고리 정보 변경 API **/
router.patch("/categories/:categoryId", async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { name, order } = req.body;

    if (!categoryId || !name || !order) {
      throw new Error("invalidDataFormatError");
    }

    const category = await prisma.categories.findFirst({
      where: { categoryId: +categoryId,
               deletedAt: null  
            },
    });

    if (!category) {
      throw new Error("noncategoryError");
    }

    await prisma.categories.update({
      where: { categoryId: +categoryId,
                deletdAt : null
            },
      data: { name, order },
    });

    return res.status(200).json({ message: "카테고리 정보를 수정하였습니다." });
  } catch (error) {
    next(error);
  }
});

// 카테고리 삭제 API
router.delete("/categories/:categoryId", async (req, res, next) => {
  const { categoryId } = req.params;
  if (!categoryId) {
    throw new Error("invalidDataFormatError");
  }

  const category = await prisma.categories.findFirst({
    where: { categoryId: +categoryId },
  });
  if (!category) {
    throw new Error("noncategoryError");
  }

  await prisma.categories.update({
    where: { categoryId: +categoryId },
    data: { deletedAt: new Date() },
  });
  return res.status(200).json({ data: "카테고리 정보를 삭제하였습니다." });
});

export default router;
