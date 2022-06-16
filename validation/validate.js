const { validationResult } = require('express-validator');

module.exports = validations => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) { // validation 통과
            return next();
        }

        res.status(400).json( // validation 불통
            errors.array()[0].msg
        );
    };
};

