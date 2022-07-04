const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;

module.exports = validations => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => 
                validation.run(req)
            )
        );

        const errors = validationResult(req);

        if (errors.isEmpty()) { // validation 통과
            return next();
        } else{  // validation 불통
            // cloudinary 이미지 삭제
            if(req.file) {
                cloudinary.uploader.destroy(
                    req.file.filename, 
                    (err, res) => { console.log(res, err) }
                )
            }

            res.status(400).json( 
                errors.array()[0].msg
            );
        }
    };
};

