import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email already taken"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "password length should be greadter then 6 character"],
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
    city: {
      type: String,
      required: [true, "city name is required"],
    },
    country: {
      type: String,
      required: [true, "country name is required"],
    },
    phone: {
      type: String,
      required: [true, "phone no is required"],
    },
    profilePic: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    answer: {
      type: String,
      required: [true, "answer is required"],
    },
    role: {
      type: String,
      default: "user",
    },
    token:{
      type:String,
      default: null
    }
  },
  { timestamps: true }
);

//hash password function
userSchema.pre("save", async function (next) {
  if (!this.isModified('password')) return next(); //this runs at the time of update. if password is not changing then run this line, no need to further hash password
  this.password = await bcrypt.hash(this.password, 10);
});

//compare password function while login // I am not using currently I am using my own logic
userSchema.method.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

//jwt token function in model class // I am not using this function
userSchema.methods.generateToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userId: this.id,
      role: this.role,
      name: this.name,
    },
    process.env.SECRET_KEY,
    { expiresIn: "7d" }
  );
};

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});
//module.exports = mongoose.model("User", userSchema);
export const User = mongoose.model("User", userSchema);
