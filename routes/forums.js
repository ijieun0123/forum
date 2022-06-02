const router = require('express').Router();
const controllers = require('../controllers/forums');

// multer 모듈 불러오기
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require("path");

//image upload func
const uniqueId = uuidv4()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../client/public/uploads"));
      //cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      cb(null, uniqueId + file.originalname);
    },
});
  
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/jpeg" || 
        file.mimetype === "image/jpg" || 
        file.mimetype === "image/png"
      ) {
        cb(null, true);
    } else {
      req.fileValidationError = "jpg,jpeg,png 파일만 업로드 가능합니다.";
      cb(null, false);
    }
  };
  
const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
});

// multer.single(fieldName) => 파일이름 전달받아서 req.file에 저장
router.post('/post', upload.single('attachImage'), controllers.postForum);

router.get('/get', controllers.getForums);
router.get('/search/get', controllers.getSearchForums);
router.get('/get/:id', controllers.getForum);

router.put('/update/:id', upload.single('attachImage'), controllers.updateForum);
router.patch('/heart/update/:id', controllers.updateForumHeart);

router.delete('/delete/:id', controllers.deleteForum);
router.delete('/delete', controllers.deleteForums);

module.exports = router;