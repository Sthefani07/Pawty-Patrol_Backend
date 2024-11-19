import express from 'express';
import { check, validationResult } from 'express-validator';
import Location from '../models/Location.mjs'
import authMiddleware from '../middleware/authMiddleware.mjs'
const router = express.Router();


// POST ADD A NEW LOCATION-------------------------
router.post('/', 
    authMiddleware,[
        check('name', 'Name is required').not().isEmpty(),
        check('type', 'Type is required').isIn(['park', 'cafe','trail']),
        check('Address', 'Address is required').not().isEmpty(),
        check('coordinates', 'Coordinates are required').isArray({ min: 2, max: 2}), 
        //description is not add here, cause it not required
    ],

    async (req, res) => {
        const error = validationResult(req); //Check any errors in router.post
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array()});  // and return the error if there is one

        const { name, type, address, coordinates, description} = req.body; //
        try {
            const location = new Location({
            name,
            type,
            address,
            coordinates: {type: 'Point', coordinates},
            description,
        });
        await location.save();
        res.jon(location);
        } catch (error) {
            console.error(error);
            res.status(500).jon({ errors: [{ msg: 'Server Error'}]})
        } 
    }

);


//Read/GET  ---------------------------


export default router;