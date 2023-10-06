import express from 'express'
import { adminOrderStatus, createOrderController, deleteOrderController, getAdminOrderController, getUserOrders } from '../controllers/orderController.js'
import { isAdmin, requiresSignIn } from '../middlewares/authMiddleware.js'

const router = express.Router()

//order method post
router.post('/shipping',requiresSignIn, createOrderController)

//all orders methoed get
router.get('/adminorders',requiresSignIn, isAdmin, getAdminOrderController)

// orders status methoed put
router.put('/:id/status',requiresSignIn, isAdmin, adminOrderStatus)

//order deletemethod delete
router.delete('/:id', requiresSignIn, isAdmin, deleteOrderController);

//get user order
router.get('/myorder', requiresSignIn, getUserOrders);

export default router