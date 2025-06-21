import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    originalname: { type: String, required: true },
    path: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedBy: { type: String, required: true },
    role : {type : String },
    uploadedAt: { type: Date, default: Date.now() }
});

export const fileUpload = mongoose.model('File', FileSchema);