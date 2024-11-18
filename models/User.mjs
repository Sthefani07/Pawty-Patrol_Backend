import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, minlength: [2] },
    email: { type: String, required: true, unique: true, match: [/^\S+@\S+\.\S+$/] },
    password: { type: String, required: true },
});



export default mongoose.model('User', UserSchema)