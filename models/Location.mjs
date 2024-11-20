// Pet-Friendly Locations

import mongoose from "mongoose";

const locationShema = new mongoose.Schema({
    name:{type: String, required: true},
    type:{type: String, enum: ['park', 'cafe', 'trail'], required: true},
    address: {type: String, required: true},
    coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },  // type of geolocation data (Point for fixed location)
        coordinates: { type: [Number], required: true }, // [longitude, latitude, find local pet events]
    },
    description: {type: String},
});


//// indexing on 'coordinates' allow proximity searches and geolocation queries
locationShema.index({ coordinates: '2dsphere'}) //

export default mongoose.model('Location', locationShema)