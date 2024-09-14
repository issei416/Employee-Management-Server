import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // folder where the images will be stored
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Rename file to avoid conflicts
    }
  });
  
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png/; // Allowed file types
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = fileTypes.test(file.mimetype);
  
      if (extname && mimetype) {
        cb(null, true);
      } else {
        cb(new Error('Only images are allowed'));
      }
    } 
  });
  