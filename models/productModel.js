import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    slug:{
        type: String,
        required: true,
    },
    descpt1:{
        type:{},
    },
    descpt2:{
        type:{},
    },
    descpt3:{
        type:{},
    },
    descpt4:{
        type:{},
    },
    descpt5:{
        type:{},
    },
    descpt6:{
        type:{},
    },
    descpt7:{
        type:{},
    },
    descpt8:{
        type:{},
    },
    descpt9:{
        type:{},
    },
    descpt10:{
        type:{},
    },
    descpt11:{
        type:{},
    },
    descpt12:{
        type:{},
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:mongoose.ObjectId,
        ref:'Category',
        required:true
    },
    photo:{
        data:Buffer,
        contentType: String,
    },
},
{timestamps: true})

export default mongoose.model("Products", productSchema)