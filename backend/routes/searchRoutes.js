import express from 'express';
import {Gift} from '../models/giftSchema.js';

const router = express.Router();

router.get('/', async (req, res) => {

    try{
        
        let query = {};
        if (req.query.name && req.query.name.trim() != '') {
            query.name = { $regex: req.query.name, $option: 'i'}
        };
        
        if (req.query.category) {
            query.category = req.query.category;
        };

        if (req.query.condition) {
            query.condition = req.query.condition;
        };

        if (req.query.age_years) {
            query.age_years = { $lte: parseInt(req.query.age_years) };
        };
        
        const gifts = await Gift.find(query);
        
        if (!gifts) {
            return res.status(404).json({ message: "Does not match any result" });
        }
        res.status(201).json(gifts);
        
    } catch (error) {
        logger.error("No gift match");
        next(error);
    }

    });

    export default router;