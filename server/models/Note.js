import mongoose  from "mongoose";

const NoteSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },

    description:{
        type: String,
        unique: true,
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

const Note = mongoose.model('Note',NoteSchema);
export default Note;