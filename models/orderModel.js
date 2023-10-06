import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema(
  {
     user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    userName:{
      type:String,
      required:true
    },
    userEmail:{
      type:String,
      required:true
    },    
    cart:{
      type: [],
      required: true,      
    }, 
    shippingEmail:{
      type:String,
      required:true,
    },
     shippingStreet:{
      type:String,
      required:true,
    },
    shippingcity:{
      type:String,
      required:true,
    },
    shippingcountry:{
      type:String,
      required:true,
    },
    shippingphone:{
      type:String,
      required:true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    billingAddress: {
      type: String,
      required: true,
    },
    billingEmail: {
      type: String,
      required: function () {
        return this.billingAddress === 'different';
      },
    },
    billingStreet: {
      type: String,
      required: function () {
        return this.billingAddress === 'different';
      },
    },
    billingCity: {
      type: String,
      required: function () {
        return this.billingAddress === 'different';
      },
    },
    billingCountry: {
      type: String,
      required: function () {
        return this.billingAddress === 'different';
      },
    },
    billingPhone: {
      type: String,
      required: function () {
        return this.billingAddress === 'different';
      },
    },
    isDelivered: {
      type: Boolean,
      default: false, // Set the default value to false
    },
    orderDate: {
      type: Date,
      default: Date.now
  },
  deliveredDate: {
      type: Date,
      default: null
  },
   
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;