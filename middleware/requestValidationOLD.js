const { validationResult } = require('express-validator');
var Ajv = require('ajv');
var schemaValidator = new Ajv({strict: false, allErrors:true});
require('ajv-errors')(schemavalidator /*, {singleError: true}*/)
require('ajv-keywords')(schemaValidator)

// var clients = require('../helpers/clients.js')

function validateRequest(request, response, next) {

    request.verifyParametersBody = function(pValidationSchema) {

        var driversValidator = schemaValidator.compile(pValidationSchema);
        var valid = driversValidator(request.body);
        let validationErrors = driversValidator.errors

        if (!valid) {
            
            errorsArr = []

            for (error of validationErrors) {
                
                errorObj = {
                    msg: error.message,
                    instancePath: error.instancePath,
                    location: 'body'
                }

                errorsArr.push(errorObj)

            }

            response.status(400).json({
                success: 'false',
                errors: errorsArr
            })

        }

        return valid
        
    }

    request.verifyParametersQuery = function () {
        const errors = validationResult(request)

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

            response.status(400)
            response.json({
                success: 'false',
                errors: errorsArr
            })
            return false

        } else {

            return true
            
        }
    }

    request.verifyClientToken = function () {

        let client = request.query.client
        let token = request.query.token
        
        clientAuthorized = clients.verifyClient(client, token)
        
        if (clientAuthorized) {

            return true

        } else {

            response.status(400)
            response.json({
                success: 'false',
                error: 'invalid client or token'
            })
            return false

        }
        
    }


    next()

}


module.exports = {validateRequest}