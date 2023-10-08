const nodemailer = require('nodemailer');


const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };


const sendOTPByEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    
    const mailOptions = {
      from: "RareKick's.com",
      to:email,
      subject: 'Email Verification OTP',
      text: `Your OTP for email verification is: ${otp}`,
    };
  
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error)
  }
};


const verifyOTP = (userOTP, generatedOTP) => {
    return userOTP === generatedOTP;
  };
  

module.exports={
    generateOTP,
    sendOTPByEmail,
    verifyOTP
}