import multer from 'multer';
import path from 'path';

// Set up the storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the directory where the files will be stored
    cb(null, 'uploads/profile_pictures/'); // Ensure this path exists
  },
  filename: (req, file, cb) => {
    const employeeId = req.user._id; // Use employee ID from the JWT token
    const ext = path.extname(file.originalname); // Get the file extension
    console.log(ext);
    console.log(`${employeeId}${ext}`);
    cb(null, `${employeeId}${ext}`); // Name the file as employeeId.extension
  },
});

// Apply file size limits and file type filters
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const isExtValid = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const isMimeValid = allowedFileTypes.test(file.mimetype);

    if (isExtValid && isMimeValid) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpeg, .jpg, .png formats are allowed!'));
    }
  },
});

// Export middleware for single image uploads
export const uploadProfilePicture = upload.single('image');
