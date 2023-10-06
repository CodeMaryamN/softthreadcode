import express from 'express'
import { isAdmin, requiresSignIn } from '../middlewares/authMiddleware.js'
import formidable from 'express-formidable'
import { createSaleProductController,
     deleteSaleProductController, 
     getSaleProductController, 
     getSingleSaleProductController, 
     saleProductPhotoController, 
     saleproductCategoryController, 
     updateSaleProductController } from '../controllers/saleprodController.js'


const router = express.Router()

//routes
//create saleproduct
router.post('/create-saleproduct', requiresSignIn, isAdmin, formidable(), createSaleProductController)


//get all products
router.get('/get-saleproducts', getSaleProductController)

//get sale photo
router.get('/product-photo/:pid', saleProductPhotoController)

//update product
 router.put('/update-saleproduct/:pid', requiresSignIn, isAdmin, formidable(), updateSaleProductController)


//get single product
router.get('/get-saleproduct/:slug', getSingleSaleProductController)

//delete product
router.delete('/delete-saleproduct/:pid', deleteSaleProductController)

//categorywise product
router.get("/saleproduct-category/:slug", saleproductCategoryController)

//search product
//router.get('/search/:keyword', searchProductController) 





export default router