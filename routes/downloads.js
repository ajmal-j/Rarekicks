const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const pdf = require('html-pdf');
const moment = require('moment');
const excel = require('excel4node');
const orderModel = require('../models/orderModel'); // Replace with the actual path
const salesModel = require('../models/salesModel'); // Replace with the actual path
// const JWT = require('./middleware/JWT'); // Replace with the actual path
// const userController = require('./controllers/userController'); // Replace with the actual path
// const productController = require('./controllers/productController'); // Replace with the actual path
const express=require("express");
const downloads=express();




function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer.from(bitmap).toString('base64');
}



downloads.get('/downloadInvoice', async (req, res) => {
    try {
        const id = req.query.orderId;
        const order = await orderModel.findById(id).populate('products.items.product');
        const templatePath = path.resolve(__dirname, '../public/template/invoice.ejs');
        const template = fs.readFileSync(templatePath).toString();
        var base64str = base64_encode(path.resolve(__dirname, '../public/images/kn (1).png'));
        const ejsData = ejs.render(template, {order,moment,base64str});

        const pdfOptions = {
            format: 'A3',
            border: '10mm',
        };
        const invoiceDirectory = path.resolve(__dirname, '/invoice/');
            if (!fs.existsSync(invoiceDirectory)) {
                fs.mkdirSync(invoiceDirectory);
            }
            const pdfFilePath = path.resolve(invoiceDirectory, `${order.payment.method}.pdf`);
            // console.log(pdfFilePath);
            // console.log(invoiceDirectory);
            pdf.create(ejsData, pdfOptions).toFile(pdfFilePath, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).send(`PDF generation failed: ${error.message}`);
            }
            // console.log('PDF created successfully:', result);
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


downloads.get('/downloadPdf', async (req, res) => {
    try {
        const id = req.query.id;
        const doc = await salesModel.findById(id)
        const templatePath = path.resolve(__dirname, '../public/template/salesReport.ejs');
        var base64str = base64_encode(path.resolve(__dirname, '../public/images/kn (1).png'));
        const template = fs.readFileSync(templatePath).toString();
        const ejsData = ejs.render(template, {doc,moment,base64str});

        const pdfOptions = {
            format: 'A3',
            border: '10mm',
        };
        const invoiceDirectory = path.resolve(__dirname, '/invoice/');
            if (!fs.existsSync(invoiceDirectory)) {
                fs.mkdirSync(invoiceDirectory);
            }
            const pdfFilePath = path.resolve(invoiceDirectory, `Sales-${doc.type}-report-${doc.date}.pdf`);
            // console.log(pdfFilePath);
            // console.log(invoiceDirectory);
            pdf.create(ejsData, pdfOptions).toFile(pdfFilePath, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).send(`PDF generation failed: ${error.message}`);
            }
            // console.log('PDF created successfully:', result);
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

    try {
        const buffer = await workbook.writeToBuffer();
        return { buffer, date: doc.date };
    } catch (error) {
        console.log(error);
        throw error;
    }
};



downloads.get('/downloadSalesExcel', async (req, res) => {
    try {
        const fileId = req.query.id;

        // Generate the Excel buffer
        const { buffer, date } = await createStocksExcel(fileId);
        const excelBuffer= buffer;
        // Set response headers for the download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=sales-report-${date}.xlsx`);

        // Send the Excel buffer as the response
        res.send(excelBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports=downloads