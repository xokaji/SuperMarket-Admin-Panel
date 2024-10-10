const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Initialize Firebase Admin
admin.initializeApp();

// Nodemailer setup
let transporter = nodemailer.createTransport({
    service: 'gmail', // You can change to another email service (e.g., Outlook, SendGrid)
    auth: {
        user: 'rmahiti2@gmail.com', // Your email
        pass: 'your-email-password' // Your email password or app-specific password
    }
});

// Cloud function to check expiring products and send email alerts
exports.checkExpiringProducts = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
    const today = new Date();
    const oneMonthLater = new Date(today);
    oneMonthLater.setMonth(today.getMonth() + 1); // Set the date one month ahead

    const expiringProducts = [];
    
    // Fetch products from Firestore
    const productsRef = admin.firestore().collection('products');
    const productsSnapshot = await productsRef.get();

    productsSnapshot.forEach((doc) => {
        const productData = doc.data();
        const inStockMonth = productData.inStockMonth || {};

        // Check each month for stock expiry
        for (let month in inStockMonth) {
            const stockDetails = inStockMonth[month];
            const expireDate = stockDetails.stockExpireDate;

            if (expireDate) {
                const expireDateObj = new Date(expireDate);

                // Check if the expiry date is within one month
                if (expireDateObj <= oneMonthLater && expireDateObj > today) {
                    expiringProducts.push({
                        productName: productData.productName,
                        stockCount: stockDetails.stockCount,
                        expireDate: expireDateObj,
                    });
                }
            }
        }
    });

    if (expiringProducts.length > 0) {
        // Send alert email if there are expiring products
        let emailContent = 'The following products are expiring soon:\n\n';

        expiringProducts.forEach((product) => {
            emailContent += `Product Name: ${product.productName}\n`;
            emailContent += `Stock Count: ${product.stockCount}\n`;
            emailContent += `Expiry Date: ${product.expireDate.toDateString()}\n\n`;
        });

        // Email options
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: 'admin@example.com', // Recipient's email address
            subject: 'Products Expiring Soon Alert',
            text: emailContent
        };

        // Send email
        try {
            await transporter.sendMail(mailOptions);
            console.log('Alert email sent successfully.');
        } catch (error) {
            console.error('Error sending alert email: ', error);
        }
    }

    return null;
});
