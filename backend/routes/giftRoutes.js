import express from 'express';
import {Gift} from '../models/giftSchema.js'
import logger from '../logger.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
    logger.info('/called');

    try {
        const gifts = await Gift.find({});
        return res.status(200).json(gifts);
    } catch (error) {
        logger.error('Error while gettting the gifts', error);
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const giftId = req.params.id;
        const giftExist = await Gift.findOne({ id: giftId });

        if (!giftId) {
            logger.error('Gift with this id does not exist');
            return res.status(404).json({ message: "gift not found" });
        };

        return res.status(200).json(giftExist);
    } catch (error) {
        logger.error("Error while getting the gift", error);
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const giftData = req.body;
        if (!giftData) {
            logger.error("There is no Gift Data or unable to read it");
            return res.status(404).json({ message: "No gift data found or read" });
        };

        const gift = await Gift.create(giftData);
        // const gift = await Gift.create({...giftData});    both work same it pass individual field

        return res.status(201).json({ message: "Gift added successfully", gift });

    } catch (error) {
        logger.error("Unable to add gift");
        next(error);
    }
})

export default router;