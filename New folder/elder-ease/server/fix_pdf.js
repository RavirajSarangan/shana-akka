const fs = require('fs');
const path = require('path');
const https = require('https');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Story = require('./models/Story');

dotenv.config();

const elderPublicDir = path.join(__dirname, '../elder/public');
if (!fs.existsSync(elderPublicDir)) {
    fs.mkdirSync(elderPublicDir);
}

const adminPublicDir = path.join(__dirname, '../admin/public');
if (!fs.existsSync(adminPublicDir)) {
    fs.mkdirSync(adminPublicDir);
}

const fileUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
const elderFile = path.join(elderPublicDir, 'sample.pdf');
const adminFile = path.join(adminPublicDir, 'sample.pdf');

const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, response => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', err => {
            fs.unlink(dest, () => reject(err));
        });
    });
};

const updateDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Story.updateMany(
            { title: "Sample Story Book (PDF)" },
            { $set: { pdfUrl: "/sample.pdf" } } // use relative path because it's in the public folder
        );
        console.log("Database updated successfully");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

const run = async () => {
    try {
        await downloadFile(fileUrl, elderFile);
        console.log("Downloaded to elder");
        await downloadFile(fileUrl, adminFile);
        console.log("Downloaded to admin");
        await updateDB();
    } catch (e) {
        console.error("Error:", e);
    }
};

run();
