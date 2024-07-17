const nodemailer = require('nodemailer');

const sendVerificationMail=(email,token)=>{
    // transpoter
    const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        secure:true,
        service:"gmail",
        auth:{
            user:"prakritijha29aug@gmail.com",
            pass:"mlhg hekk rekt dcoz"
        }
    });

    // mailOptions
    const mailOptions = {
        from:"prakritijha29aug@gmail.com",
        to:email,
        subject:'Todo Email Verification',
        html:`<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            padding: 20px;
        }
        .card {
            background-color: #ffffff;
            max-width: 600px;
            margin: 40px auto;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333333;
            text-align: center;
        }
        p {
            color: #666666;
            font-size: 16px;
            line-height: 1.5;
        }
        .btn {
            display: block;
            width: 200px;
            margin: 20px auto;
            padding: 10px;
            text-align: center;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
        }
        .btn:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>Verify Your Email</h1>
            <p>Thank you for registering! Please click the button below to verify your email address and complete your registration.</p>
            <a href="${process.env.HOST_NAME}/verifyEmail/${token}" class="btn">Verify Email</a>
            <p>If you did not create an account, no further action is required.</p>
        </div>
    </div>
</body>`
    }

    transporter.sendMail(mailOptions, function(err,info){
        if(err){
            console.log(err);
        }else{
            console.log(`Email has been sent on ${email}`,info.response);
        }
    })
}

module.exports = sendVerificationMail;