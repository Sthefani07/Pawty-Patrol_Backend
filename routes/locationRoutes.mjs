import express from 'express';
import { check, validationResult } from 'express-validator';
import Location from '../models/Location.mjs'
import authMiddleware from '../middleware/authMiddleware.mjs'


const router = express.Router();


// POST ADD A NEW LOCATION-------------------------
router.post('/',
    authMiddleware, [
    check('name', 'Name is required').not().isEmpty(),
    check('type', 'Type is required').isIn(['park', 'cafe', 'trail']),
    check('address', 'Address is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('date', 'Date is required and must be in ISO format').isISO8601(),
    check('time', 'Time is required and must be a valid string').not().isEmpty(),
],

    async (req, res) => {
        const errors = validationResult(req); //Check any errors in router.post
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });  // and return the error if there is one

        const { name, type, address, description, date, time, userId } = req.body; //
        try {
            const location = new Location({
                name,
                type: type.toLowerCase(),
                address,
                description,
                date,
                time,
                userId,
            });
            await location.save(); //save new location to DB
            res.json(location); //Sends the saved location back as a response to the client.
        } catch (error) {
            console.error(error);
            res.status(500).json({ errors: [{ msg: 'Server Error' }] })
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
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});


// GET route to search  for location by type or proximity --------------------------
// router.get('/search', async (req, res) => {
//     const {type, lat, lng, maxDistance} = req.query
//     try {
//         const query = {}; // Initializes an empty object to hold search criteria for querying the db.
//         if (type) query.type = type; //check if type ['park', 'cafe','trail'] exists, then add to query

//         if (lat && lng && maxDistance) { //check if lat & lng are provided for proximity
//             query.coordinates = {
//                 $near: {  // Convert lng/lat to floats and set coordinates
//                     $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
//                     $maxDistance: parseFloat(maxDistance),
//                 }
//             }
//         }
//         const locations = await Location.find(query); //find matching location in the db
//         res.json(locations);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ errors: [{ msg: 'Server Error'}]})
//     }
// });



// PUT update location ----------------------------------------------

router.put('/:id', authMiddleware, async (req, res) => {
    const { name, type, address, description, date, time } = req.body;
    try {
        const location = await Location.findById(req.params.id);//find location and review using ID
        if (!location) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        if (location.userId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'You are not authorized to edit this event' });
        }

        if (name) location.name = name;
        if (type) location.type = type;
        if (address) location.address = address;
        if (description) location.description = description;
        if (date) location.date = date;
        if (time) location.time = time;

        await location.save();
        res.json(location.reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] })
    }
});


// DELETE event
router.delete('/:id', authMiddleware, async (req, res) => { //authMiddleware make sure that only logged-in users to add a review
    try {
        const location = await Location.findById(req.params.id);//find location and review by ID

        if (!location) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        if (location.userId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'You are not authorized to delete this event' });
        }
        await Location.deleteOne({ _id: req.params.id });

        res.json({ msg: 'Location removed successfuly' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] })
    }
});


export default router;