import slugify from "slugify";
import saleprodModel from "../models/saleprodModel.js";
import fs from 'fs'


export const createSaleProductController = async( req, res)=>{
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
        saleprice,
        category} = req.fields
    const {photo} =req.files

//validations
switch (true) {
    case !name:
        return res.status(500).send({error:'Name is required'})
    case !price:
        return res.status(500).send({error:'Price is required'})
    case !saleprice:
        return res.status(500).send({error:'Sale Price is required'})
    case !category:
        return res.status(500).send({error:'Category is required'})
    case photo && photo.size > 1000000 :
        return res.status(500).send({error:'Photo is required and should be less than 1mb'})

}

    const saleproducts = new saleprodModel({...req.fields, slug:slugify(name)})
    if (photo){
        saleproducts.photo.data = fs.readFileSync(photo.path);
        saleproducts.photo.contentType = photo.type
    }
    await saleproducts.save();
    res.status(201).send({
        success:true,
        message: 'Product Created Successfully',
        saleproducts,
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


//get all  saleproducts

export const getSaleProductController = async(req, res)=>{
    try {
        const saleproducts = await saleprodModel
        .find({})
        .populate('category')
        .select('-photo')
        .sort({ createdAt: -1});
    
        res.status(200).send({
            success:true,
            counttotal: saleproducts.length,
            message: 'All Products',
            saleproducts,
            
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

    //photo controller

export const saleProductPhotoController =async(req, res)=>{
    try {
        const saleproduct = await saleprodModel.findById(req.params.pid).select("photo");
        if (saleproduct.photo.data) {
            res.set("Content-type", saleproduct.photo.contentType);
            return res.status(200).send(saleproduct.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message: 'error while getting sale product photo',        
            error,
        })
    }
    }

//get single product

export const getSingleSaleProductController =async (req, res)=>{
    try {
        const saleproduct =await saleprodModel
        .findOne({slug: req.params.slug})
        .select('-photo')
        .populate('category');
    
        res.status(200).send({
            success:true,
            message: 'Single Sale Product Fetched',
            saleproduct,        
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message: 'error while getting single saleproduct',        
            error,
        })
    }
    }


    //deletesaleproductController
export const deleteSaleProductController =async(req, res)=>{
    try {
        await saleprodModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success:true,
            message:'Sale Product Deleted Successfully'
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
    export const updateSaleProductController = async(req, res)=>{
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
                saleprice,
                category,} = req.fields
            const {photo} =req.files
        
        //validations
        switch (true) {
            case !name:
                return res.status(500).send({error:'Name is required'})            
            case !price:
                return res.status(500).send({error:'Price is required'})
            case !saleprice:
                return res.status(500).send({error:'sale Price is required'})
            case !category:
                return res.status(500).send({error:'Category is required'})
            case photo && photo.size > 1000000 :
                return res.status(500).send({error:'Photo is required and should be less than 1mb'})
        
        }
        
            const saleproducts = await saleprodModel.findByIdAndUpdate(req.params.pid,
                {...req.fields, slug:slugify(name)}, {new:true})
            if (photo){
                saleproducts.photo.data = fs.readFileSync(photo.path);
                saleproducts.photo.contentType = photo.type
            }
            await saleproducts.save();
            res.status(201).send({
                success:true,
                message: 'Sale Product Updated Successfully',
                saleproducts,
            });
        
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success:false,
                error,
                message: 'error in update sale product'
            })
        }
    }
    
    export const saleproductCategoryController=async(req, res)=>{
    try {
        const category=await categoryModel.findOne({slug: req.params.slug});
        const saleproducts=await saleprodModel.find({category}).populate("category");
        res.status(200).send({
            success:true,
            category,
            saleproducts,
        });
        
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            error,
            message: 'error while getting sale products'
        })
    }
    }