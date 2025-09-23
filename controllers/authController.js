const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (req,res)=>{
    const {name,email,password} = req.body;

    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const user = new User({
            name,
            email,
            password : hashedPassword,
        })
        await user.save();
        res.status(201).json({
            message : "User created successfully",
            user : {
                id : user._id,
                name : user.name,
                email :user.email,
            }
        })
    }
    catch(error){
        res.status(500).json({
            error : error.message || "something went wrong"
        })
    }
}

const loginUser = async (req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email:email})
        if (user){
            const decodedPassword = await bcrypt.compare(password,user.password);
            if (decodedPassword){
                const jwttoken = jwt.sign({id : user._id , name : user.name,email : user.email},JWT_SECRET,{expiresIn:"1h"})
                res.status(200).json({
                    messege : "User login Successfully",
                    user : {
                        token : jwttoken,
                        name : user.name,
                        email : email,
                        projects : user.projects
                    }
                })
            }
            else{
                res.status(401).json({
                    error:"Incorrect password"
                })
            }
        }
        else{
            res.status(401).json({
                error : "Incorrect email"
            })
        }
    }
    catch(error){
        res.status(500).json({
            error : error.message || "Something went wrong"
        })
    }
}

module.exports =  {
    registerUser,
    loginUser
}