const jwt = require("jsonwebtoken");
const Register = require("../models/register");


const auth = async (req,res,next) => {
    try {
       const token = req.cookies.jwt;
       const verifyUSer = jwt.verify(token, "mynameisvinodbahadurthapaiamayoutuber");
       console.log(verifyUSer);
     

       const user = await Register.findOne({_id:verifyUSer._id});
       console.log(user);
       next();
        
    } catch (error) {
        res.status(401).send(error);
    }
}

module.exports = auth;