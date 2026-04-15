import express from 'express';
import Note from '../models/Note.js';
import middleware from '../middleware/middleware.js';
const router = express.Router();

router.post("/add",middleware,async (req,res)=>{
    try {
        const { title,description } = req.body;


        const newNote = new Note({
            title, description,userId: req.user.id
        });

        await newNote.save();

        return res.status(200).json({
            code: 1,
            success: true,
            message: "Note Created Successfully!!!",
            note: newNote
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            code: 0,
            success: false,
            message: "Server Error!!!"
        })
    }
});

router.get('/',middleware, async(req,res) => {
    try{
        const notes = await Note.find({userId: req.user.id});
        return res.status(200).json({
            code: 1,
            success: true,
            message: "Notes",
            note: notes 
        })
    }catch(error){
        console.log(error.message);
        return res.status(500).json({
            code: 0,
            success: false,
            message: "Server Error!!!"
        })
    }
});

router.put('/:id', async(req,res) => {
    try{

    const {id} = req.params;

        const updateNote = await Note.findByIdAndUpdate(id,req.body,);
        return res.status(200).json({
            code: 1,
            success: true,
            message: "Notes",
            note: updateNote 
        })
    }catch(error){
        console.log(error.message);
        return res.status(500).json({
            code: 0,
            success: false,
            message: "Server Error!!!"
        })
    }
});

router.delete('/:id', async(req,res) => {
    try{

    const {id} = req.params;

        const updateNote = await Note.findByIdAndDelete(id);
        return res.status(200).json({
            code: 1,
            success: true,
            message: "Notes",
            note: updateNote 
        })
    }catch(error){
        console.log(error.message);
        return res.status(500).json({
            code: 0,
            success: false,
            message: "Server Error!!!"
        })
    }
});


export default router;