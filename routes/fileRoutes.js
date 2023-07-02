const express = require('express');
const router = express.Router();
const multer = require('multer');
const s3 = require('../awsConfig');

const File = require('../models/File');

const storage = multer.memoryStorage(); // Use memory storage for uploading files to Amazon S3
const upload = multer({ storage: storage });

router.post('/', upload.single('upfile'), async (req, res) => {
    const { originalname, mimetype, size, buffer } = req.file;

    try {
        // upload to s3
        const uploadResult = await s3.upload({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: originalname,
            Body: buffer,
        }).promise();

        // Create a new file object
        const file = new File({
            name: uploadResult.Key,
            type: mimetype,
            size: size,
        });

        // Save the file object to the database
        await file.save();

        // Return the file details as JSON
        res.json({
            name: file.name,
            type: file.type,
            size: file.size,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'A server error occurred' });
    }
});

module.exports = router;
