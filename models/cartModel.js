const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
        {
           productId:{
            type: String,
           },
           quantity:{
            type: Number,
            default: 1
           }

        }
    ],
    
  },
  {
    timestamps: true,
  }
);
cartSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  
  orderSchema.set("toJSON", {
    virtuals: true,
  });
  export const Cart = mongoose.model("Cart", cartSchema);