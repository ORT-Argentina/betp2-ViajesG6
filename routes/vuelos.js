var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
const { check, query } = require('express-validator');

const { getVuelos, getVueloByID, addVuelo, updateVuelo, deleteVuelo, filtrarVuelos } = require('../controllers/vuelosController');

router.get('/',
auth, 
getVuelos);


router.get('/vueloID/:id',
check('id').exists().isLength({min: 24, max:24}).withMessage("El ID debe ser de 24 caracteres de largo"),
getVueloByID
);

router.get('/filtrarVuelos',
auth,
query('origen').exists().withMessage("Debes insertar un origen como un IATA CODE (ej: 'origen=EZE')").isLength({min: 3, max:3}).withMessage("El IATA CODE de origen debe ser de 3 caracteres de longitud"),
query('destino').exists().withMessage("Debes insertar un destino como un IATA CODE (ej: 'destino=EZE')").isLength({min: 3, max:3}).withMessage("El IATA CODE de destino debe ser de 3 caracteres de longitud"),
query('millasMinimo').optional().isNumeric().withMessage("Las millas deben ser un numero"),
query('millasMaximo').optional().isNumeric().withMessage("Las millas deben ser un numero"),
query('millasExacto').optional().isNumeric().withMessage("Las millas deben ser un numero"),
filtrarVuelos
);

router.post('/addVuelo',
auth,
check('origen').exists().withMessage("El atributo 'origen' es requerido"),
check('origen.iata_code').exists().isLength({min: 3, max:3}).withMessage("El atributo 'iata_code' dentro de 'origen' es requerido y debe ser de 3 caracteres"),

check('destino').exists().withMessage("El atributo 'destino' es requerido"),
check('destino.iata_code').exists().isLength({min: 3, max:3}).withMessage("El atributo 'iata_code' dentro de 'destino' es requerido y debe ser de 3 caracteres"),

check('fecha_salida').exists().isISO8601().withMessage("El formato de la fecha debe ser ISO 8601 (YYYY-MM-DD)"),
check('millas').exists().isInt(),
addVuelo
);

router.put('/updateVuelo/:id',
auth,
check('origen.iata_code').optional().isLength({min: 3, max:3}).withMessage("El atributo 'iata_code' dentro de 'origen' es requerido y debe ser de 3 caracteres"),
check('origen.aeropuerto').optional().isString().withMessage("El atributo 'aeropuerto' dentro de 'origen' es requerido"),

check('destino.iata_code').optional().isLength({min: 3, max:3}).withMessage("El atributo 'iata_code' dentro de 'destino' es requerido y debe ser de 3 caracteres"),
check('destino.aeropuerto').optional().isString().withMessage("El atributo 'aeropuerto' dentro de 'destino' es requerido"),

check('fecha_salida').optional().isISO8601().withMessage("El formato de la fecha debe ser ISO 8601 (YYYY-MM-DD)"),
check('precio').optional().isInt(),
check('moneda').optional().isString().isLength({min: 3, max:3}).withMessage("La moneda debe ser de 3 caracteres de longitud (USD, EUR o ARS)"),
updateVuelo
);

router.delete('/deleteVuelo/:id',
auth,
check('id').exists().withMessage("El ID es requerido en la query: '/deleteVuelo/{id}'").isLength({min: 24, max:24}).withMessage("El ID debe ser de 24 caracteres de largo"),
deleteVuelo
);

module.exports = router;