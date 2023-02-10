import express from "express";
import multer from "multer";
import path from 'path';

const router = express.Router();

//set up disk. to store eng
const storage = multer.diskStorage({
    destination(req, file, cb) { 
        cb(null, 'uploads/')
    },
    filename(req, file, cb) {
        //file.extname - to get doc. extend name --> 111.jpg -> jpg is extend name
        cb(null, `${file.fieldname} - ${Date.now()}${path.extname(file.originalname)}`)
    }
})

//auth file type
const checkFileType = (file, cb) => {
    //define valid doc. extname
    const fileTypes = /jpg|jpeg|png/
    //valid doc. extname
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    //auth media type
    const mimetype = fileTypes.test(file.mimetype)
    if (mimetype && extname) {
        return cb(null, true)
    } else { 
        cb('limit to picture type')
    }
}

//upload
//fileFileter -> filter unfit doc. 
const upload = multer({ storage, fileFilter: function(req, file, cb){
    checkFileType(file, cb)
} })

//setUp route
router.post('/', upload.single('image'), (req, res) => { 
    res.send(`/${req.file.path}`)
})

export default router;