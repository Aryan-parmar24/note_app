import express from 'express';
import Note from '../models/Note.js';
import User from '../models/User.js';
import middleware from '../middleware/middleware.js';
import crypto from 'crypto';

const router = express.Router();

// Generate unique share code
const generateShareCode = () => {
    return crypto.randomBytes(6).toString('hex');
};

// ADD NOTE
router.post("/add", middleware, async (req, res) => {
    try {
        const { title, description } = req.body;

        const newNote = new Note({
            title,
            description,
            userId: req.user.id,
            ownerName: req.user.name
        });

        await newNote.save();

        return res.status(200).json({
            code: 1,
            success: true,
            message: "Note Created Successfully!!!",
            note: newNote
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            code: 0,
            success: false,
            message: "Server Error!!!"
        });
    }
});

// GET ALL NOTES (own + shared/collaborated)
router.get('/', middleware, async (req, res) => {
    try {
        // Get own notes
        const ownNotes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });

        // Get notes where user is a collaborator
        const sharedNotes = await Note.find({
            'collaborators.userId': req.user.id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            code: 1,
            success: true,
            message: "Notes",
            note: ownNotes,
            sharedNotes: sharedNotes
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            code: 0,
            success: false,
            message: "Server Error!!!"
        });
    }
});

// UPDATE NOTE (owner or collaborator can edit)
router.put('/:id', middleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        // Check if user is owner or collaborator
        const isOwner = note.userId.toString() === req.user.id;
        const isCollaborator = note.collaborators.some(
            c => c.userId.toString() === req.user.id
        );

        if (!isOwner && !isCollaborator) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to edit this note"
            });
        }

        note.title = title || note.title;
        note.description = description || note.description;
        await note.save();

        return res.status(200).json({
            code: 1,
            success: true,
            message: "Note Updated",
            note: note
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            code: 0,
            success: false,
            message: "Server Error!!!"
        });
    }
});

// DELETE NOTE (only owner can delete)
router.delete('/:id', middleware, async (req, res) => {
    try {
        const { id } = req.params;

        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        // Only owner can delete
        if (note.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Only the owner can delete this note"
            });
        }

        await Note.findByIdAndDelete(id);

        return res.status(200).json({
            code: 1,
            success: true,
            message: "Note Deleted"
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            code: 0,
            success: false,
            message: "Server Error!!!"
        });
    }
});

// ENABLE SHARING - Generate share link
router.post('/share/:id', middleware, async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }
        console.log("=== SHARE DEBUG ===");
        console.log("note.userId:", note.userId.toString());
        console.log("req.user.id:", req.user.id);
        console.log("req.user:", req.user);
        console.log("Match:", note.userId.toString() === req.user.id);
        // Only owner can share
        if (note.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Only the owner can share this note"
            });
        }

        // Generate share code if not exists
        if (!note.shareCode) {
            note.shareCode = generateShareCode();
        }
        note.isShared = true;
        await note.save();

        return res.status(200).json({
            success: true,
            message: "Share link generated",
            shareCode: note.shareCode
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

// DISABLE SHARING
router.post('/unshare/:id', middleware, async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        if (note.userId.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the owner can manage sharing"
            });
        }

        // Use $unset to completely REMOVE shareCode field
        // instead of setting it to null
        await Note.findByIdAndUpdate(id, {
            $set: {
                isShared: false,
                collaborators: []
            },
            $unset: {
                shareCode: ""  // ← Completely removes field from document
            }
        });

        return res.status(200).json({
            success: true,
            message: "Sharing disabled"
        });
    } catch (error) {
        console.log("Unshare error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

// JOIN NOTE - User joins with share code
router.post('/join/:shareCode', middleware, async (req, res) => {
    try {
        const { shareCode } = req.params;

        const note = await Note.findOne({ shareCode: shareCode, isShared: true });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Invalid or expired share link"
            });
        }

        // Check if user is already the owner
        if (note.userId.toString() === req.user.id) {
            return res.status(200).json({
                success: true,
                message: "You are the owner of this note",
                note: note
            });
        }

        // Check if user already joined
        const alreadyJoined = note.collaborators.some(
            c => c.userId.toString() === req.user.id
        );

        if (alreadyJoined) {
            return res.status(200).json({
                success: true,
                message: "You already have access to this note",
                note: note
            });
        }

        // Get user details
        const user = await User.findById(req.user.id);

        // Add user as collaborator
        note.collaborators.push({
            userId: req.user.id,
            name: user.name,
            email: user.email,
            joinedAt: new Date()
        });

        await note.save();

        return res.status(200).json({
            success: true,
            message: "Successfully joined! You can now edit this note.",
            note: note
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

// GET NOTE INFO BY SHARE CODE (for preview before joining)
router.get('/preview/:shareCode', middleware, async (req, res) => {
    try {
        const { shareCode } = req.params;

        const note = await Note.findOne({ shareCode: shareCode, isShared: true });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Invalid or expired share link"
            });
        }

        return res.status(200).json({
            success: true,
            note: {
                title: note.title,
                ownerName: note.ownerName,
                collaboratorsCount: note.collaborators.length,
                isOwner: note.userId.toString() === req.user.id,
                alreadyJoined: note.collaborators.some(
                    c => c.userId.toString() === req.user.id
                )
            }
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

// LEAVE SHARED NOTE (collaborator leaves)
router.post('/leave/:id', middleware, async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        // Remove user from collaborators
        note.collaborators = note.collaborators.filter(
            c => c.userId.toString() !== req.user.id
        );

        await note.save();

        return res.status(200).json({
            success: true,
            message: "You left the shared note"
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

// REMOVE COLLABORATOR (owner removes someone)
router.post('/remove-collaborator/:id', middleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { collaboratorId } = req.body;

        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        // Only owner can remove
        if (note.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Only the owner can remove collaborators"
            });
        }

        note.collaborators = note.collaborators.filter(
            c => c.userId.toString() !== collaboratorId
        );

        await note.save();

        return res.status(200).json({
            success: true,
            message: "Collaborator removed"
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

export default router;