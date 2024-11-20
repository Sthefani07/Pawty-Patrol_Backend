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
        check('address', 'Address is required').not().isEmpty(),
        check('coordinates', 'Coordinates are required').isArray({ min: 2, max: 2}), 
        //description is not add here, cause it not required
    ],

    async (req, res) => {
        const errors = validationResult(req); //Check any errors in router.post
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
        await location.save(); //save new location to DB
            res.json(location); //Sends the saved location back as a response to the client.
        } catch (error) {
            console.error(error);
            res.status(500).json({ errors: [{ msg: 'Server Error'}]})
        } 
    }

);


// GET  all locations ---------------------------
router.get('/', async (req, res) => {
    try {
        const location = await Location.find();
        res.json(location);
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ msg: 'Server Error'}]});
    }
});


// GET route to search  for location by type or proximity --------------------------
router.get('/search', async (req, res) => {
    try {
        const query = {}; // Initializes an empty object to hold search criteria for querying the db.
        if (type) query.type = type; //check if type ['park', 'cafe','trail'] exists, then add to query

        if (lat && lng && maxDistance) { //check if lat & lng are provided for proximity
            query.coordinates = {
                $near: {  // Convert lng/lat to floats and set coordinates
                    $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
                    $maxDistance: parseFloat(maxDistance),
                }
            }
        }
        const locations = await Location.find(query); //find matching location in the db
        res.json(locations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ msg: 'Server Error'}]})
    }
});


// POST review to a location ---------------------------------

router.post('/:id/reviews', authMiddleware, async (req, res) =>{ //authMiddleware make sure that only logged-in users to add a review

    const { text, rating} = req.body; 

    try {
    const location = await Location.findById(req.params.id);//find location and review using ID
    
    if(!location){
        return res.status(404).json({ msg: 'Location not found'});
    }

    //create a new review with user ID, message and star rating
    const newReview = {
        user: req.user.id,
        text,
        rating
    };

    location.review.push(newReview); //push new review to location
    await location.save(); // save the updated location to db

    res.json(location.review); 

    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ msg: 'Server Error'}]})
    }
});


export default router;