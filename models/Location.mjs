// Pet-Friendly Locations

import mongoose from "mongoose";

const locationShema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
});


//// indexing on 'coordinates' allow proximity searches and geolocation queries
//locationShema.index({ coordinates: '2dsphere'}) //

export default mongoose.model('Location', locationShema)

