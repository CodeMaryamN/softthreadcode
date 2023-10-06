import express from 'express'
import { isAdmin, requiresSignIn } from '../middlewares/authMiddleware.js'
import { createProductController, 
    deleteProductController, 
    getProductController, 
    getSingleProductController,
    productCategoryController,
    productPhotoController,
    searchProductController,
    updateProductController} from '../controllers/productController.js'
import formidable from 'express-formidable'


const router = express.Router()

//routes
//create product
router.post('/create-product', requiresSignIn, isAdmin, formidable(), createProductController)

//update product
router.put('/update-product/:pid', requiresSignIn, isAdmin, formidable(), updateProductController)

//get all products
router.get('/get-product', getProductController)

//get single product
router.get('/get-product/:slug', getSingleProductController)

//get photo
router.get('/product-photo/:pid', productPhotoController)

//delete product
router.delete('/delete-product/:pid', deleteProductController)

//categorywise product
router.get("/product-category/:slug", productCategoryController)

//search product
router.get('/search/:keyword', searchProductController)

//payment
//router.post('/stripe/payment', createPayment)





export default router