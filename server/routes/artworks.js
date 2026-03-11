const express = require('express');
const router = express.Router();
const Artwork = require('../models/Artwork');

// Get all artworks
router.get('/', async (req, res) => {
    try {
        const artworks = await Artwork.find();
        res.json(artworks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const upload = require('../middleware/upload');

// Create artwork
router.post('/', upload.single('image'), async (req, res) => {
    const artwork = new Artwork({
        title: req.body.title,
        description: req.body.description,
        year: req.body.year,
        category: req.body.category,
        imageURL: req.file ? req.file.path : req.body.imageURL,
    });

    try {
        const newArtwork = await artwork.save();
        res.status(201).json(newArtwork);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
