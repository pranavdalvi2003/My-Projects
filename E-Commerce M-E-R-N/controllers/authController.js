import { hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from 'jsonwebtoken';
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
            return res.status(400).send({error: 'Incorrect E-Mail or Password!'});
        }
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