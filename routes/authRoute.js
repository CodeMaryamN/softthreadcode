import express from 'express'
import { registerController, 
    loginController, 
    testController, 
    forgotPasswordController,
    updateProfileController,
    getOrdersController,
    getAllUsersController}
     from '../controllers/authController.js'
import { isAdmin, requiresSignIn } from '../middlewares/authMiddleware.js'

//router object
const router = express.Router()

//routing
//register method post
router.post('/register', registerController)

//login post
router.post('/login', loginController)

//forgot password post
router.post('/forgot-password', forgotPasswordController)

//test routes
router.get('/test',requiresSignIn,isAdmin, testController)

//protected route post
router.get('/user-auth', requiresSignIn, (req, res) =>{
    res.status(200).send({ok: true});
})

//protected admin route post
router.get('/admin-auth', requiresSignIn,isAdmin, (req, res) =>{
    res.status(200).send({ok: true});
})


//update profile
router.put('/profile', requiresSignIn, updateProfileController)

//orders
router.get('/orders', requiresSignIn, getOrdersController)

//get all users
router.get('/allusers', requiresSignIn, isAdmin, getAllUsersController)

export default router