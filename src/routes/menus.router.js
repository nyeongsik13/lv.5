import express from 'express';
import { prisma } from '../utils/prisma/index.js';

import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import { createMenuSchema } from "../middlewares/validation/Validation.js";

const router = express.Router();

// 메뉴 등록 API
router.post('/categories/:categoryId/menus', authenticate, authorize, async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const { name, description, image, price ,quantity} = await createMenuSchema.validateAsync(req.body);

        const category = await prisma.categories.findUnique({
            where: { categoryId: +categoryId },
        });

        if (!category) {
            throw new Error('noncategoryError');
        }

        const order = await prisma.menus.count({
            where: { categoryId: +categoryId },
        });

        const menu = await prisma.menus.create({
            data: {
                name,
                description,
                image,
                price,
                quantity,
                order: order + 1,
                categoryId: +categoryId,
                status: 'FOR_SALE', 
            },
        });

        return res.status(201).json({ message: '메뉴를 등록하였습니다.', menu });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
});

// 카테고리별 메뉴 조회 API
router.get('/categories/:categoryId/menus', async (req, res, next) => {
    const { categoryId } = req.params;

    const category = await prisma.categories.findFirst({
        where: { categoryId: +categoryId,
                    deletedAt: null,},
    });
    if (!categoryId) {
        throw new Error('invalidDataFormatError');
    }

    if (!category) {
        throw new Error('noncategoryError');
    }
    const menus = await prisma.menus.findMany({
        where: { categoryId: +categoryId,
                deletedAt: null,},
        select: {
            menuId: true,
            name: true,
            image: true,
            price: true,
            quantity: true,
            order: true,
            status: true,
        },
        orderBy: {
            order: 'desc',
        },
    });
    return res.status(200).json({ data: menus });
});

//메뉴 상세조회
router.get('/categories/:categoryId/menus/:menuId', async (req, res) => {
    const { categoryId, menuId } = req.params;
    const category = await prisma.categories.findUnique({
        where: {
            categoryId: +categoryId,
            deletedAt: null,
        },
    });
    if (!category) {
        throw new Error('noncategoryError');
    }
    const menu = await prisma.menus.findUnique({
        where: {
            menuId: +menuId,
            deletedAt: null,
        },
    });
    if (!menu) {
        throw new Error('nonmenuError')
    }

    const categoryMenus = await prisma.menus.findUnique({
        where: {
            categoryId: +categoryId,
            menuId: +menuId,
            deletedAt: null,
        },
    });
    return res.status(200).json({ data: categoryMenus });
});

// 메뉴 수정 API
router.patch('/categories/:categoryId/menus/:menuId', authenticate, authorize, async (req, res, next) => {
    try {
        const { categoryId, menuId } = req.params;
        const { name, description, image, price, order, status } = req.body;

        if (price <= 0) {
            return res.status(400).json({ message: "메뉴 가격은 0보다 작을 수 없습니다." });
        }

        const menuExists = await prisma.menus.findUnique({
            where: {
                id: +menuId,
                deletedAt: null,
            },
        });

        if (!menuExists) {
            throw new Error('nonmenuError')
        }

        const updatedMenu = await prisma.menus.update({
            where: {
                id: +menuId,
                deletedAt: null,
            },
            data: {
                name,
                description,
                image,
                price,
                order,
                quantity,
                status,
            },
        });

        return res.status(200).json({ message: '메뉴를 수정하였습니다.', menu: updatedMenu });
    } catch (error) {
        next(error);
    }
});

// 메뉴 삭제 API
router.delete('/categories/:categoryId/menus/:menuId', authenticate, authorize, async (req, res, next) => {
    try {
        const { categoryId, menuId } = req.params;

        const menuExists = await prisma.menus.findUnique({
            where: {
                id: +menuId,
            },
        });

        if (!menuExists) {
            throw new Error('nonmenuError')
        }

        await prisma.menus.update({
            where: {
                id: +menuId,
            },data:{
                deletedAt: new Date(),
            }

        });

        return res.status(200).json({ message: '메뉴 삭제 완료' });
    } catch (error) {
        next(error);
    }
});

export default router;
