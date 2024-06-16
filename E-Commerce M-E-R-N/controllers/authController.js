import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const registerController=async(req,res)=>{
    try{
        const {name,email,password,phone,address,role}=req.body
        if(!name){
            return res.status(400).send({error: 'Name is required!'});
        }
        if(!email){
            return res.status(400).send({error: 'E-Mail is required!'});
        }
        if(!password){
            return res.status(400).send({error: 'Password is required!'});
        }
        if(!phone){
            return res.status(400).send({error: 'Phone is required!'});
        }
        if(!address){
            return res.status(400).send({error: 'Address is required!'});
        }
        if(!role){
            return res.status(400).send({error: 'Role is required!'});
        }
        const existingUser=await userModel.findOne({email})
        if(existingUser){
            return res.status(200).send({
                success: true,
                message: `The email address ${email} already exists in the database. Please login.`
            });
        }
        const hashedPassword=await hashPassword(password);
        const user=await new userModel({name,email,phone,address,password:hashedPassword,role}).save();
        res.status(201).send({
            success: true,
            message: 'User Registered Successfully!',
            user
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Registration',
            error
        });
    }
};
export const loginController=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email||!password){
            return res.status(400).send({
                success: false,
                message: 'Incorrect E-Mail or Password!'
            });
        }
        const user=await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success:false,
                message: 'E-Mail is not registered!'
            })
        }
        const match=await comparePassword(password,user.password);
        if(!match){
            return res.status(200).send({
                success: false,
                message: 'Invalid Password'
            })
        }
        const token=await JWT.sign({_id: user._id}, process.env.JWT_SECRET,{expiresIn: "7d",});
        res.status(200).send({
            success: true,
            message: 'Login Successful!',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            },
            token,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Login',
            error
        });
    }
};
export const testController=(req,res)=>{
    try{
        res.send('Protected Route');
    }
    catch(error){
        console.log(error);
        res.send({error});
    }
};