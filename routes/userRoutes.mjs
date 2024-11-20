// REGISTRATION ROUTE
import express from 'express';
import User from '../models/User.mjs'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {check, validationResult} from 'express-validator'


dotenv.config();
const router = express.Router()

// @route:   POST api/users
// @desc:    Registrando a user
// @access:  Public
router.post('/', [
    check('username', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
],
    async (req, res) => {
        //Run our validation 'checks' on the request body
        const errors = validationResult(req);
        //if there are errors, respond with errors
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        const { username, email, password } = req.body;
        try {
            //Check if user is already registered in DB
            let user = await User.findOne({ email });
            //   If user exists return with error message
            if (user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'User Already Exists' }] });
            }

            user = new User({
                username,
                email,
                password,
            });

            //encrypt password
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password, salt)
            await user.save();

            //create payload
            const payload = {
                user: {
                    id: user.id,
                    name: user.username, //same name used in the schema file
                },
            };

            jwt.sign(
                payload,
                process.env.jwtSecret,
                { expiresIn: 3600 }, //optional options object to keep you 1h logged in to the internet
                (err, token) => {
                    if (err) throw err;
                res.json({ message: 'User registered successfully' });
                }
            );
        } catch (err) {
            console.error(err);
            res.status(500).json({ errors: [{ msg: 'Server Error' }] })

        }
    }
);



export default router