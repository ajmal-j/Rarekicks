const express=require("express")
const app=express()
require('dotenv').config();
const bodyparser=require('body-parser');
const connect=require("./config/dbConnect")
const PORT=process.env.PORT||5000
const userRoutes=require('./routes/userRoutes')
const adminRoutes=require('./routes/adminRoutes')
const nodemailer = require('nodemailer');
const cookieparser=require('cookie-parser')
const MongoStore = require('connect-mongo');
const session=require("express-session");
const  mongoose=require("mongoose")
const fs = require('fs');
const moment = require('moment');
const orderModel=require("./models/orderModel")
const pdf = require('html-pdf');
const ejs = require('ejs');
const path = require('path');
const cron = require('node-cron');
const adminController=require('./controller/adminController');
const salesModel = require("./models/salesModel");
const excel=require("excel4node")
connect()
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json());
app.use(cookieparser());
const secretKey=process.env.SESSION_SECRET;
const server=process.env.CONNECT;
app.use(session({
    secret:secretKey,
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({ 
        mongoUrl: server,
        mongooseConnection: mongoose.connection, 
    }),
    cookie: {
        maxAge: 10 * 24 * 60 * 60 * 1000
    },
}));


app.use(function(req, res,next) {
    res.set('Cache-Control', 'no-cache,  no-store ,private , must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next()
});
app.set('view engine','ejs');
app.use('/public',express.static("public"));


app.use("/user",userRoutes)
app.use("/admin",adminRoutes)


app.get("/",(req,res)=>{
    res.redirect("/user/home")
})
app.get("/user",(req,res)=>{
    res.redirect("/user/login")
})
app.get("/admin",(req,res)=>{
    res.redirect("/admin/dashBoard")
})

app.get('/downloadInvoice', async (req, res) => {
    try {
        const id = req.query.orderId;
        const order = await orderModel.findById(id).populate('products.items.product');
        const templatePath = path.resolve(__dirname, './public/template/invoice.ejs');
        const template = fs.readFileSync(templatePath).toString();
        const ejsData = ejs.render(template, {order,moment});

        const pdfOptions = {
            format: 'A3',
            border: '10mm',
        };
        const invoiceDirectory = path.resolve(__dirname, '/invoice/');
            if (!fs.existsSync(invoiceDirectory)) {
                fs.mkdirSync(invoiceDirectory);
            }
            const pdfFilePath = path.resolve(invoiceDirectory, `${order.payment.method}.pdf`);
            console.log(pdfFilePath);
            console.log(invoiceDirectory);
            pdf.create(ejsData, pdfOptions).toFile(pdfFilePath, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).send(`PDF generation failed: ${error.message}`);
            }
            console.log('PDF created successfully:', result);
            res.download(pdfFilePath, 'invoice.pdf', (downloadError) => {
                if (downloadError) {
                    console.error(downloadError);
                    return res.status(500).send(`Download failed: ${downloadError.message}`);
                }

                fs.unlinkSync(pdfFilePath);
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(`Server Error: ${error.message}`);
    }
});


app.get('/downloadPdf', async (req, res) => {
    try {
        const id = req.query.id;
        const doc = await salesModel.findById(id)
        const templatePath = path.resolve(__dirname, './public/template/salesReport.ejs');
        const template = fs.readFileSync(templatePath).toString();
        const ejsData = ejs.render(template, {doc,moment});

        const pdfOptions = {
            format: 'A3',
            border: '10mm',
        };
        const invoiceDirectory = path.resolve(__dirname, '/invoice/');
            if (!fs.existsSync(invoiceDirectory)) {
                fs.mkdirSync(invoiceDirectory);
            }
            const pdfFilePath = path.resolve(invoiceDirectory, `Sales-${doc.type}-report-${doc.date}.pdf`);
            console.log(pdfFilePath);
            console.log(invoiceDirectory);
            pdf.create(ejsData, pdfOptions).toFile(pdfFilePath, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).send(`PDF generation failed: ${error.message}`);
            }
            console.log('PDF created successfully:', result);
            res.download(pdfFilePath, `salesReport-${doc.date}.pdf`, (downloadError) => {
                if (downloadError) {
                    console.error(downloadError);
                    return res.status(500).send(`Download failed: ${downloadError.message}`);
                }

                fs.unlinkSync(pdfFilePath);
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(`Server Error: ${error.message}`);
    }
});





const createStocksExcel = async (id) => {
    const doc = await salesModel.findById(id);
    const workbook = new excel.Workbook();
  
    const worksheet = workbook.addWorksheet("Sales Overview");

    // Header row for overall sales summary
    worksheet.cell(1, 1).string('Date');
    worksheet.cell(1, 2).string('Type');
    worksheet.cell(1, 3).string('Total Orders');
    worksheet.cell(1, 4).string('Successful Orders');
    worksheet.cell(1, 5).string('Total Sales');
    worksheet.cell(1, 6).string('Total Revenue');

    // Data row for overall sales summary
    let rowIndex = 2;
    worksheet.cell(rowIndex, 1).string(doc.date);
    worksheet.cell(rowIndex, 2).string(doc.type);
    worksheet.cell(rowIndex, 3).number(doc.totalOrders);
    worksheet.cell(rowIndex, 4).number(doc.successfulOrders);
    worksheet.cell(rowIndex, 5).number(doc.totalSales);
    worksheet.cell(rowIndex, 6).number(doc.totalRevenue);

    // Spacer row
    rowIndex++;

    // Header row for product details
    worksheet.cell(rowIndex, 1).string('Product ID');
    worksheet.cell(rowIndex, 2).string('Product Sales');
    worksheet.cell(rowIndex, 3).string('Product Count');
    worksheet.cell(rowIndex, 4).string('Product Revenue');

    // Data rows for product details
    doc.products.forEach((product) => {
        rowIndex++;
        worksheet.cell(rowIndex, 1).string(product.id.toString());
        worksheet.cell(rowIndex, 2).number(product.sales);
        worksheet.cell(rowIndex, 3).number(product.count);
        worksheet.cell(rowIndex, 4).number(product.revenue);
    });

    // Spacer row
    rowIndex++;

    // Header row for category details
    worksheet.cell(rowIndex, 1).string('Category ID');
    worksheet.cell(rowIndex, 2).string('Category Name');
    worksheet.cell(rowIndex, 3).string('Category Sales');
    worksheet.cell(rowIndex, 4).string('Category Count');

    // Data rows for category details
    doc.categories.forEach((category) => {
        rowIndex++;
        worksheet.cell(rowIndex, 1).string(category.id.toString());
        worksheet.cell(rowIndex, 2).string(category.category);
        worksheet.cell(rowIndex, 3).number(category.sales);
        worksheet.cell(rowIndex, 4).number(category.count);
    });

    // Spacer row
    rowIndex++;

    // Header row for payment methods
    worksheet.cell(rowIndex, 1).string('Payment Method');
    worksheet.cell(rowIndex, 2).string('Count');

    // Data rows for payment methods
    doc.paymentMethods.forEach((method) => {
        rowIndex++;
        worksheet.cell(rowIndex, 1).string(method.method);
        worksheet.cell(rowIndex, 2).number(method.count);
    });

    // Create a sales directory if it doesn't exist
    const salesDirectory = path.join(__dirname, 'sales');
    if (!fs.existsSync(salesDirectory)) {
        fs.mkdirSync(salesDirectory);
    }
    
    // Define the file path based on date and report type
    const filePath = path.join(__dirname, 'sales', `${doc.type}-report-${doc.date}.xlsx`);

    try {
        // Write the workbook to the specified file path
        await workbook.write(filePath);
        return filePath;
    } catch (error) {
        console.log(error);
        throw error;
    }
};




  app.get('/downloadSalesExcel', async (req, res) => {
    try {
        const fileId = req.query.id;
        const filePath = await createStocksExcel(fileId);

        res.download(filePath, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                // Use asynchronous operation to delete the file after the download is complete
                fs.unlink(filePath, (deleteErr) => {
                    if (deleteErr) {
                        console.error(deleteErr);
                    }
                });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



cron.schedule('0 0 * * 0', adminController.weeklySales);
cron.schedule('0 0 1 * *', adminController.monthlySales);


app.get("*",(req,res)=>{
    res.status(404).render('user/404',{url:req.url})
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    try {
        console.log("back");
        res.status(500).redirect('back');        
    } catch (error) {
        console.log("home");
        res.status(500).redirect('/user/home/');
    }
});

app.listen(PORT,()=>{console.log(`Server running :http://localhost:${PORT}`)})