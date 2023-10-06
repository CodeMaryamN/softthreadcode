import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from 'jsonwebtoken';



export const registerController = async(req,res) =>{
    try {
        const {name,email, password, phone, address, answer} =req.body;

        //validations
        if(!name){
            return res.send({message:'Name is requires'})
        }
        if(!email){
            return res.send({message:'Email is requires'})
        }
        if(!password){
            return res.send({message:'Password is requires'})
        }
        if(!phone){
            return res.send({message:'Phone is requires'})
        }
        if(!address){
            return res.send({message:'Address is requires'})
        }
        if(!answer){
            return res.send({message:'Answer is requires'})
        }

        //check user
        const existingUser = await userModel.findOne({email})

        //existing User
         if (existingUser) {
            return res.status(200).send({
                success:false,
                message:' Already Registered, please login',
                
            })
         }

         //register user
         const hashedPassword=await hashPassword(password)
         //save
          const user = await new userModel({name,
            email,
            phone,
            address,
            password:hashedPassword,
            answer
        }).save();
res.status(201).send({
    success:true,
    message:'User registered successfully',
    user
})


    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error in Registration',
            error
        })
    }
};


//post login
export const loginController=async (req, res)=>{
    try {
        const {email, password} =req.body
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:'invalid email or password'
            })
        }
            //check user

            const user = await userModel.findOne({email})
            if (!user){
                return res.status(404).send({
                    success:false,
                    message:'Email is not registered'
                })
            }
        const match = await comparePassword(password, user.password)
if(!match){
    return res.status(200).send({
        success:false,
        message:'Invalid Password'
    });
}
    
//token
const token = await JWT.sign({ _id:user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
});
res.status(200).send({
    success:true,
    message:'login successfuly',
    user:{
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
    }, token,
});
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error in login',
            error
        })
    }
}
    
//forgotPasswordController

export const forgotPasswordController=async(req,res) =>{
try {
    const {email, answer, newPassword} =req.body
    if (!email) {
        res.status(400).send({message:'Email is required'})
    }
    if (!answer) {
        res.status(400).send({message:'Answer is required'})
    }
    if (!newPassword) {
        res.status(400).send({message:'New Password is required'})
    }
    //check
const user =await userModel.findOne({email,answer})
//validation
if (!user) {
    return res.status(404).send({
        success:false,
        message:'Wrong Email or Answer'
    })
}
const hashed = await hashPassword(newPassword)
await userModel.findByIdAndUpdate(user._id, { password: hashed});
res.status(200).send({
    success:true,
    message:'Password Reset Successfully'
});

} catch (error) {
    console.log(error);
        res.status(500).send({
            success:false,
            message:'something went wrong',
            error})
}
}

//test controller
export const testController = (req, res)=>{
    try {
        res.send('protected route');
    } catch (error) {
        console.log(error);
        res.send({error})
    }
}


//update profile controller
export const updateProfileController= async(req,res)=>{
    try {
        const {name, password, address, phone}=req.body
        const user = await userModel.findById(req.user._id)
        //password
        if(!password && password.length < 6){
            return res.json({error:'password is required and 6 chracter long'})
        }
        const hashedPassword= password ? await hashPassword(password) : undefined
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address
        }, {new: true})
        res.status(200).send({
            success:true,
            message: 'profile updated successfully',
            updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:'error in update profile',
            error
        })
    }
}



//orders
export const getOrdersController=async(req,res)=>{
    try {
        const orders= await orderModel.find({user:req.user._id})
        .populate("products", "-photo")
        .populate("user", "name");
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error in getting order',
            error
        })
    }
}



//get all users
export const getAllUsersController = async(req, res)=>{
    try {
        const users = await userModel
        .find({})
    
        res.status(200).send({
            success:true,
            counttotal: users.length,
            message: 'All Users',
            users,
            
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message: 'error in getting all users',        
            error: error.message
        })
    }
    }
    



    