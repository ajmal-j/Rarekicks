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
      text: `Your OTP for email verification is: ${otp} and this is only valid for 10 minutes!`,
    };
  
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error)
  }
};

const sendEmail = async (email) => {
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
      to: email,
      subject: "Welcome to RareKick's! 😊",
      html: `
      <p>Hello there! 👋</p>
      
      <p>Welcome to RareKick's, your ultimate destination for the most exclusive and stylish kicks! 🎉</p>
      
      <p>We're thrilled to have you join our community of sneaker enthusiasts. Get ready to explore a world of rare and unique kicks that make a statement.</p>
      
      <p>Here's what you can expect from RareKick's:</p>
      
      <ul>
          <li>🛍️ Wide Selection: Discover a curated collection of rare and limited-edition sneakers.</li>
          <li>🚚 Fast Shipping: Enjoy quick and reliable delivery to your doorstep.</li>
          <li>💳 Secure Checkout: Shop with confidence knowing your transactions are secure.</li>
          <li>🌟 Exclusive Offers: Be the first to know about special promotions and discounts.</li>
      </ul>
      
      <p>Thank you for choosing RareKick's for your sneaker cravings! If you have any questions or need assistance, feel free to reach out to our customer support team.</p>
      
      <p>Happy shopping! 👟🛒</p>
      
      <p>Best regards, <br>The RareKick's Team</p>
     
      `,
  };
  
    
  
  
  
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error)
  }
};


const sendCoupon = async (email, couponCode) => {
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
      to: email,
      subject: "Welcome to RareKick's! 😊",
      html: `
        <p>Hello there! 👋</p>
        
        <p>Welcome to RareKick's, your ultimate destination for the most exclusive and stylish kicks! 🎉</p>
        
        <p>We're thrilled to have you join our community of sneaker enthusiasts. Get ready to explore a world of rare and unique kicks that make a statement.</p>
        
        <p>Here's what you can expect from RareKick's:</p>
        
        <ul>
            <li>🛍️ Wide Selection: Discover a curated collection of rare and limited-edition sneakers.</li>
            <li>🚚 Fast Shipping: Enjoy quick and reliable delivery to your doorstep.</li>
            <li>💳 Secure Checkout: Shop with confidence knowing your transactions are secure.</li>
            <li>🌟 Exclusive Offers: Be the first to know about special promotions and discounts.</li>
        </ul>
        
        <p>Thank you for choosing RareKick's for your sneaker cravings! If you have any questions or need assistance, feel free to reach out to our customer support team.</p>
        
        <p>Happy shopping! 👟🛒</p>
        
        <p>As a token of appreciation, here's your exclusive coupon code:</p>
        
        <div id="couponCode" style="background-color: black; padding: 10px; border-radius: 20px; font-size: 1.2em; display:inline-block;">
            <span id="codeValue" style="color:white;">${couponCode}</span>
        </div>
        
        <p>Best regards, <br>The RareKick's Team</p>
      `,
    };
  
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};


const verifyOTP = (userOTP, generatedOTP) => {
    return userOTP === generatedOTP;
  };
  

module.exports={
    generateOTP,
    sendOTPByEmail,
    verifyOTP,
    sendEmail,
    sendCoupon
}