//package imports
const express = require('express');
const clc = require('cli-color');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const mongodbSession = require('connect-mongodb-session')(session);
const path = require('path');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');


// file imports
const userModel = require('./models/userModel');
const validation = require('./utili/authValidation');
const validateEmail = require('./utili/authValidation');
const isSessionID = require('./middlewares/isSessionID.js');
const todoModel = require('./models/todoModel');
const generateToken = require('./utili/JWT.js');
const sendVerificationMail = require('./utili/verificationMail.js');

// some variables
const PORT = process.env.PORT || 8000;

MONGO_URI=process.env.MONGO_URI
// DB connection
mongoose.connect(MONGO_URI).then(()=>{
    console.log(clc.yellowBright("MongoDB is connected"));

}).catch((err)=>{
    console.log(clc.redBright(err));
});

const store = new mongodbSession({
    uri :  MONGO_URI,
    collection : "Sessions",
})

const app = express();


// middlewares
app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'));

app.use(session({
    secret : process.env.SECRET_KEY,
    store : store,
    resave: false,
    saveUninitialized: false,
}))

// API's

app.get('/',(req,res)=>{
    return res.render('home');
});

app.get('/verifyEmail',(req,res)=>{
    return res.render('verifyEmail');
})

app.get('/register',(req,res)=>{
    return res.render('register');
});

app.get('/login',(req,res)=>{
    return res.render('login')
});

app.get('/dashboard',isSessionID,(req,res)=>{
    return res.render('dashboard');
});

app.post('/logout',isSessionID,(req,res)=>{
    req.session.destroy(err=>{
        if(err) return res.status(500).send("Can't logout, please try again");
        // alert('Successfully Logout from all devices');
        return res.redirect('/login');
    });
});


app.post('/deleteAccnt',isSessionID, async (req,res)=>{
    // userModel
    try{
        
        const email = req.session.user.email
        const userID = req.session.user.userID;
        const userDB = await userModel.findOneAndDelete({email : email});
        // userDB.findOneAndDelete();
        if(!userDB){
            return res.send("<h1>User not found</h1>");
        }
        userTasks = await todoModel.deleteMany({email:email});
        req.session.destroy(err=>{
            if(err) return res.status(500).send("Can't logout");
            console.log("Successfully destroyed session")
        })

        return res.redirect('/register');
    }catch(err){
        console.log(clc.redBright.bold(err));
        return res.status(500).json({
            message:"Internal error",
            Error:err,
        });
    }
});


app.post('/create-todo',isSessionID, async (req,res)=>{
    try{
        // console.log(req.body);
        const{todo} = req.body;
        // console.log(todo);
        const username = req.session.user.username;
        const email = req.session.user.email;
        const userID = req.session.user.userID;

        if (!todo) {
            return res.status(400).send("Task content is required");
        }

        const existingTask = await todoModel.findOne({ task: todo, userID: userID });
        if (existingTask) {
            return res.status(400).send("Task already exists for this user");
        }

        const userTask = new todoModel({
            task : todo,
            username,
            email,
            userID,
        });
        userTask.save();
        return res.redirect('/dashboard');

    }catch(err){
        console.log(clc.redBright.bold(err));
        return res.status(500).json({
            message: "Internal Error",
            request : "Please try again",
            Error : err,
        })
    }
})



app.get('/read-todo', async (req,res)=>{
    try{
        const userID = req.session.user.userID;
        const SKIP = Number(req.query.skip) || 0;
        const LIMIT = 5;
        // const allTodo = await todoModel.find({userID:userID});

        const allTodo = await todoModel.aggregate([
            {
                $match : {userID: userID.toString()} //'6697da00090ed570a3e98bb7'
            },
            {
                $skip : SKIP
            },
            {
                $limit : LIMIT
            },
        ]);
        console.log("userID",userID,"todo",allTodo);
        return res.send({
            status: 200,
            todo: allTodo,
        })
    }catch(err){
        console.log(clc.redBright.bold(err));
        return res.status(500).json({message:"Internal error"});
    }

});


// app.get('/read-todo', async (req, res) => {
//     try {
//         if (!req.session || !req.session.user || !req.session.user.userID) {
//             return res.status(401).json({ message: "Unauthorized" });
//         }

//         const userID = req.session.user.userID;
//         const SKIP = parseInt(req.query.skip, 10) || 0; // Ensure skip is an integer

//         console.log("UserID:", userID);
//         console.log("Skip:", SKIP);

//         const allTodo = await todoModel.aggregate([
//             { $match: { userID: userID } },
//             { $skip: SKIP },
//             { $limit: 5 }
//         ]);

//         console.log("All Todos:", allTodo);

//         return res.send({
//             status: 200,
//             todo: allTodo,
//         });
//     } catch (err) {
//         console.log(clc.redBright.bold(err));
//         return res.status(500).json({ message: "Internal error" });
//     }
// });



app.post('/update-todo', async (req,res)=>{
    try{

        const newData = req.body.newData;
        const todoID = req.body.todoID;
        const username = req.session.user.username;

        if(!todoID)return res.send({
            status: 400,
            message: "No TodoID is found",
        })

        if(!newData){
            return res.send({
                status: 400,
                message: "Please send a new data to replace previous one",
            })
        }
        // console.log(`TodoID ${todoID} and newData ${newData}`);

        const todoDB = await todoModel.findOne({_id:todoID});
        // console.log("humare todo ka poora db : ",todoDB);

        // console.log("Todo ka username : ",todoDB.username," Humara username: ",username);

        if(todoDB.username!=username){
            return res.send({
                status:403,
                message:"You are not allowed to modify other's data"
            })
        }

        const newTodo = await todoModel.findByIdAndUpdate({_id:todoID},{task:newData},{new:true});
        // console.log("Prev todo : ",newTodo);
        // console.log("New Todo",todoDB)

        return res.send({
            status:200,
            prevTodo:todoDB,
            newTodo,
        })



    }catch(err){
        console.log(clc.redBright.bold(err));
        return res.send({
            status:500,
            message:"Internal server error",
            Error: err,
        })
    }
});

app.post('/delete-todo', async (req,res)=>{
    try{
        const todoID = req.body.todoID;
        const username = req.session.user.username;

        if(!todoID)return res.send({
            status: 400,
            message: "TodoID is not available",
        })

        const todoDB = await todoModel.findOne({_id:todoID});

        if(!todoDB)return res.send({
            status: 400,
            message:"User not found",
        })

        // console.log("DB username : ",todoDB.username, " My username: ",username);
        
        if(todoDB.username != username)return res.send({
            status:404,
            message:"You can't delete someone else's todo",
        })

        const deletedTodo = await todoModel.findOneAndDelete({_id:todoID});
        console.log("deleted todo : ",deletedTodo);
        
        
        return res.send("All ok");

        // todoModel.findOneAndDelete({_id:todoID});

    }catch(err){
        return res.send({
            status: 500,
            message: "Internal Server Error",
            Error: JSON.stringify(err),
        })
    }
})

app.post('/register',async (req,res)=>{
    // console.log(req.body);
    const {username,email,password,country} = req.body;

    // data validation 
    try {
        const isValidated = await validation({username,email,password,country});
        console.log(clc.yellowBright.bold(isValidated));
    } catch (error) {
        return res.status(400).json({
            error: error,
            message: "Or refresh the page",
        })
    }

    // db connection
    try {

        // unique email
        const existingEmail = await userModel.findOne({email: email});
        const existingName = await userModel.findOne({username: username});
        if(existingEmail!=null){
            return res.status(400).json({
                message: "Email already exists",
            });
        };
        if(existingName!=null){
            return res.status(400).json({
                message: "Username already exists",
            });
        };

        // encrypting password
        const hashedPassword = await bcrypt.hash(password,parseInt(process.env.SALT));

        const userObj = userModel({
            username,
            email,
            password:hashedPassword,
            country,
        });
        await userObj.save();


        // generate jwt token

        const token = generateToken(email);


        // send mail

        sendVerificationMail(email,token);

        // console.log(user);
    // console.log(username,email,password,country);
        return res.redirect('/verifyEmail');
    } catch (error) {
        console.log(clc.redBright(error));
        return res.status(500).json({
            message:"Internal Error",
            error: error,
        });
    }
});

app.get('/verifyEmail/:token',async (req,res)=>{
    try{
        const token = req.params.token;
        const email = jwt.verify(token,process.env.SECRET_KEY);
        // console.log("Email",email);   
        await userModel.findOneAndUpdate({email:email},{isEmailVerified:true});
        // return res.send("Email is verified");
        return res.redirect('/login')
    }catch(err){
        if(err)throw err;
    }
})

app.post('/login',async (req,res)=>{
    // console.log(req.body);
    const {loginID,Password} = req.body;
    // console.log("LoginID:",loginID,"Pass:",Password);


    // getting user info from mongodb
    let userDB = {};
    if(validateEmail({key : loginID})){
        userDB = await userModel.findOne({email:loginID});
    }else{
        userDB = await userModel.findOne({username:loginID});
    }
    if(userDB==null){
        return res.status(400).json('User not found, Please register first');
    }
    
    // comparing passwords;
    // console.log(Password,userDB.password);
    const iseCorrectPassword = await bcrypt.compare(Password,userDB.password);
    // console.log(iseCorrectPassword);
    // console.log(userDB);
    if(!userDB.isEmailVerified){
        return res.send("Please verify your email");
    }
    if(iseCorrectPassword){


        // session based authentication and session ID
        // console.log(req.session);
        console.log(userDB);
        req.session.isAuth = true;
        req.session.user = {
            userID : userDB._id,
            username : userDB.username,
            email : userDB.email,
        }
        // console.log(req.session);

        return res.redirect('/dashboard');
    }else{
        return res.status(400).json({
            message: "Incorrect Password",
            error: "Please type correct password"
        });
    }
});

app.post('/home',(req,res)=>{
    return res.redirect('/');
})

app.listen(PORT,(err)=>{
    if(err)throw err;
    console.log(clc.yellowBright.bold(`Server is running on : `));
    console.log(clc.yellowBright.underline(`http://localhost:${PORT}`));
})
