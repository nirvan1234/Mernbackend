const express = require('express');
require("./db/conn");
const path = require('path');
const app = express();
const hbs = require('hbs');
const port =  9000;
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

const register = require("./models/register");

//const staticPath = path.join(__dirname , "../public");
const templatePath = path.join(__dirname , "../templates/views");

app.set("view engine", "hbs");
app.set("views", templatePath);

//app.use(express.static(staticPath));

app.get( "/", (req,res) =>{
   res.render("index");
})

app.get( "/register", (req,res) =>{
    res.render("register");
 })

 app.get( "/secret", auth, (req,res) =>{
    //console.log(req.cookies.jwt);
    res.render("secret");
    
 })

 app.get( "/login", (req,res) =>{
    res.render("login");
 })

app.post( "/register", async(req,res) =>{
    try {
        //console.log(req.body.firstname);
        //res.send(req.body.firstname);

    const password = req.body.password;
    const cpassword = req.body.confirmpassword;


    if (password === cpassword){ 

        const registerEmployee = new register({

            firstname : req.body.firstname,
            lastname : req.body.lastname,
            email : req.body.email,
            password: req.body.password,
            confirmpassword : req.body.confirmpassword
        })

        console.log("the Success Part " + registerEmployee );

        
        const token = await registerEmployee.generateAuthToken();

        res.cookie("jwt",token ,{
            expires: new Date(Date.now() + 60000),
            httpOnly:true
        });
           
        const registered = await registerEmployee.save();



        res.status(201).render("index");


        }else{
            res.send(" Password are not matching")
        }

      }catch(error){
          res.status(400).send(error);
      }
 })

//app.get( "/about", (req,res)=> {
  // res.write("<h1>Hello world Aur kase ho bhai </h1>");
   //res.write("<h1>Hello world Aur kase ho bhai </h1>");
//res.send();});

app.post( "/login", async(req,res) =>{
    try {
        
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await register.findOne({email :email});

        const isMatch = await bcrypt.compare(password, useremail.password);

        const token = await useremail.generateAuthToken();
        console.log("the token part" + token);

        res.cookie("jwt",token ,{
            expires: new Date(Date.now() + 50000),
            httpOnly:true
        });


        if(isMatch){
            res.status(201).render("secret")
        }else{
            res.send('invalid password details');
        }


        //res.send(useremail);
        //console.log(useremail);


        //if (useremail.password === password){
         //   res.render("invalid login details");
        //}else{
         //   res.send("invalid login details");
        //}



    

    } catch (error) {
        res.status(400).send("invalid login Details")
        
    }
 })

 //const jwt = require("jsonwebtoken");


 //const createToken = async() => {
     //const token = await jwt.sign({_id:"60ec3e02e735c93a082952b8"},"mynameisvinodbahadurthapaiamayoutuber");
    //console.log(token);

     //const userver = await jwt.verify(token ,"mynameisvinodbahadurthapaiamayoutuber");
     //console.log(userver);
 //}

 //createToken();

app.listen(port, ()=> {
    console.log(`listenig the port at ${port}`);
 });