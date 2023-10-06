import slugify from "slugify";
import productModel from "../models/productModel.js";
import categoryModel from "../models/CategoryModel.js"
import fs from 'fs'


export const createProductController = async( req, res)=>{
try {
    const {name, 
        slug,
        descpt1,
        descpt2,
        descpt3,
        descpt4,
        descpt5,
        descpt6,
        descpt7,
        descpt8,
        descpt9,
        descpt10,
        descpt11,
        descpt12,
        price,
        category} = req.fields
    const {photo} =req.files

//validations
switch (true) {
    case !name:
        return res.status(500).send({error:'Name is required'})
    case !price:
        return res.status(500).send({error:'Price is required'})
    case !category:
        return res.status(500).send({error:'Category is required'})
    case photo && photo.size > 1000000 :
        return res.status(500).send({error:'Photo is required and should be less than 1mb'})

}

    const products = new productModel({...req.fields, slug:slugify(name)})
    if (photo){
        products.photo.data = fs.readFileSync(photo.path);
        products.photo.contentType = photo.type
    }
    await products.save();
    res.status(201).send({
        success:true,
        message: 'Product Created Successfully',
        products,
    });

} catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        error,
        message: 'error in creating product'
    })
}
}

//get all products

export const getProductController = async(req, res)=>{
try {
    const products = await productModel
    .find({})
    .populate('category')
    .select('-photo')
    .sort({ createdAt: -1});

    res.status(200).send({
        success:true,
        counttotal: products.length,
        message: 'All Products',
        products,
        
    })
    
} catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message: 'error in getting all products',        
        error: error.message
    })
}
}

//get single product

export const getSingleProductController =async (req, res)=>{
try {
    const product =await productModel
    .findOne({slug: req.params.slug})
    .select('-photo')
    .populate('category');

    res.status(200).send({
        success:true,
        message: 'Single Product Fetched',
        product,        
    })
} catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message: 'error while getting single product',        
        error,
    })
}
}

//photo controller

export const productPhotoController =async(req, res)=>{
try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
        res.set("Content-type", product.photo.contentType);
        return res.status(200).send(product.photo.data);
    }
} catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message: 'error while getting product photo',        
        error,
    })
}
}

//deleteProductController
export const deleteProductController =async(req, res)=>{
try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo")
    res.status(200).send({
        success:true,
        message:'Product Deleted Successfully'
    })
} catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message: 'error while deleting product',        
        error,
    })
}
}

//updateProductController
export const updateProductController = async(req, res)=>{
    try {
        const {name, 
            slug,
            descpt1,
            descpt2,
            descpt3,
            descpt4,
            descpt5,
            descpt6,
            descpt7,
            descpt8,
            descpt9,
            descpt10,
            descpt11,
            descpt12,
            price,
            category} = req.fields
        const {photo} =req.files
    
    //validations
    switch (true) {
        case !name:
            return res.status(500).send({error:'Name is required'})
        case !price:
            return res.status(500).send({error:'Price is required'})
        case !category:
            return res.status(500).send({error:'Category is required'})
        case photo && photo.size > 1000000 :
            return res.status(500).send({error:'Photo is required and should be less than 1mb'})
    
    }
    
        const products = await productModel.findByIdAndUpdate(req.params.pid,
            {...req.fields, slug:slugify(name)}, {new:true})
        if (photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type
        }
        await products.save();
        res.status(201).send({
            success:true,
            message: 'Product Updated Successfully',
            products,
        });
    
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message: 'error in update product'
        })
    }
}

export const productCategoryController=async(req, res)=>{
try {
    const category=await categoryModel.findOne({slug: req.params.slug});
    const products=await productModel.find({category}).populate("category");
    res.status(200).send({
        success:true,
        category,
        products,
    });
    
} catch (error) {
    console.log(error);
    res.status(400).send({
        success:false,
        error,
        message: 'error while getting products'
    })
}
}

//search Controller
export const searchProductController=async(req,res)=>{
    try {
        const {keyword}=req.params
        const results= await productModel.find({
            $or:[
                {name:{$regex :keyword, $options:"i"}},
                {description:{$regex :keyword, $options:"i"}}
            ]
        }).select("-photo")
        res.json(results)
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:"error in searching product ",
            error
        })
    }
}




/* export const createOrder = async (req, res) => {
   try{
     let {
      cart,
      address,
      gtotal,
      paymentInfo,
    } = req.body;
  
    const userId = req.user._id;
  
    const paymentIntent= await stripe.paymentIntents.create({
      amount: gtotal * 100,
      currency: "PKR",
      confirm: true,
      payment_method: paymentInfo.id,
      description: `${req.user.name}(${req.user.email}) bought ${cart.length} item(s)`,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });
  
    let order = new Order({
        cart,
        address,
        gtotal,
        paymentInfo,
        user: userId,
        paymentIntent:paymentIntent.id
    });
  
    let createdOrder = await order.save();
  
    res.status(201).json({ id: createdOrder._id });
}
catch(error) {
  console.error('Error while creating order:', error);
  res.status(500).json({ error: 'Internal server error' });
}
};
 */



/* export const createPayment=async(req, res)=>{
    console.log(req.body)
    const { token,gtotal, name, cart } =req.body;
    const amount= Math.round(gtotal * 100);
    try {
        const status= await stripe.charges.create({
            name:name,
            amount:amount,
            currency:"usd",
            description: cart,
            source:token.id
        });
        res.status(200).json({ status });
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:"error in creating payment ",
            error
        })
}
} */