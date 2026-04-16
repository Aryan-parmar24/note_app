import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Owner name for display
    ownerName: {
        type: String,
        default: ''
    },

    // Collaborators - users who can edit this note
    collaborators: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: {
            type: String
        },
        email: {
            type: String
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Unique share code for invite link
    shareCode: {
        type: String,
        default: undefined,
        unique: true,
        sparse: true
    },

    // Is sharing enabled
    isShared: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Note = mongoose.model('Note', NoteSchema);
export default Note;