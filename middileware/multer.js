const multer  = require('multer')

const storage = multer.diskStorage({
    destination:  (req, file, cb)=> {
      cb(null, 'public/images')
    },
    filename:  (req, file, cb)=> {
      cb(null, Date.now() + '_' + file.originalname)
    }
  })
  
exports.upload = multer({ storage: storage })
exports.upload2=multer({storage:storage})

