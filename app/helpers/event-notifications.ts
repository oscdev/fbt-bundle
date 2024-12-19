import nodemailer from "nodemailer";
//import { registrations } from "../services/registrations";
import { EventEmitter } from "events";
import { cnf } from "../../cnf.js";
import zlib from 'zlib';
import fs from 'fs';

const events = new EventEmitter();
const transporter = nodemailer.createTransport({
    
    host: (process.env.NODE_ENV === "production") ? process.env.SMTP_HOST : cnf.dev.SMTP_HOST,
    port: (process.env.NODE_ENV === "production") ? process.env.SMTP_POST : cnf.dev.SMTP_PORT,
    secure: false,
    auth: {
        user: (process.env.NODE_ENV === "production") ? process.env.SMTP_USER : cnf.dev.SMTP_USER,
        pass: (process.env.NODE_ENV === "production") ? process.env.SMTP_PASS : cnf.dev.SMTP_PASS,
    },
});

events.on('oscp:send:owner:appInstalled', async (storeDetails) => {
    try {
        const email = storeDetails.email;
        console.log("email send ===", email)
        const mailOptions = {
            //to: 'guddi.oscp@gmail.com',
            to: email,
            subject: "Welcome to the OSCP Upsell & Cross Sell App – We're Here to Assist You!",
            html: "<p>Hello!</p><p>We’re thrilled to welcome you to the OSCP Upsell & Cross Sell App! You’ve made a great choice by installing our app, and we’re committed to making sure it helps your business grow.</p><p>To ensure everything runs smoothly, our team offers free setup assistance and is always available to answer any questions you might have. Whether you need help with configuration or have feature requests, we're here to make the app work perfectly for your store.</p><p>We’re also interested in learning more about how we can best serve your business. Do you have any specific requirements or features in mind? Let us know, and we’ll be happy to explore customized solutions that fit your needs.</p><p>Feel free to reach out to us anytime. We're just a message away!</p><p>Looking forward to working with you.</p><p>Best regards,<br>OSCP Upsell & Cross Sell App Team</p>",

        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });


    } catch (error) {
        console.error('Error sending email:', error);
    }
});
events.on('oscp:send:owner:appUninstalled', async (storeDetails) => {
    try {
        const email = storeDetails.email;
        console.log("email send ===", email)
        const mailOptions = {
            //to: 'guddi.oscp@gmail.com',
            to: email,
            subject: "OSCP Upsell & Cross Sell App Uninstalled from Your Store",
            html: "<p>Hello!</p><p>We noticed that you recently uninstalled the OSCP Upsell & Cross Sell App from your Shopify store, and we’d like to ensure that everything is running smoothly on your end. If you experienced any issues or have questions regarding the app’s integration with your store, our team of experts is here to help.</p><p>If you have any specific feature requests or feedback, we’d love to hear from you. Don’t hesitate to reach out – we’re always just a message away!<p>Best regards,<br>OSCP Upsell & Cross Sell App Team</p>",

        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });


    } catch (error) {
        console.error('Error sending email:', error);
    }
});

export default events;