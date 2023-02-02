const { validationResult } = require('express-validator');


function validateRequest(req, res, next) {

    // req.verifyParametersQuery = function () {
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return res.status(422).json({ errors: errors.array() });
    //     }
    // }

    req.verifyParametersQuery = function () {
        const errors = validationResult(req)

        console.log(errors)
        if (!errors.isEmpty()) {

            let errorsArr = []
            for (error of (errors.array())) {

                errorObj = {
                    msg: error.msg,
                    param: error.param,
                    location: error.location
                }

                errorsArr.push(errorObj)

            }

            res.status(400)
            res.json({
                success: 'false',
                errors: errorsArr
            })
            return false

        } else {

            return true
        }
    }

    next()
}



module.exports = {validateRequest};