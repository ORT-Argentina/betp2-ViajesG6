const dataVuelos = require('../data/vuelodb');
const {getAirport} = require('../src/utils/airports');

getVuelos = async function (req, res) {

    const vuelos = await dataVuelos.getVuelos();
    res.json(vuelos);
}

getVueloByID = async function (req, res) {

    if (req.verifyParametersQuery()) {

        try {
            const vuelo = await dataVuelos.getVuelo(req.params.id);
            res.json(vuelo);
    
        } catch (error) {
            res.status(404).json({ 'success': false, 'message': error.message});
        }
    }
}

filtrarVuelos = async function (req, res) {

    if (req.verifyParametersQuery()) {

        try {
            const vuelos = await dataVuelos.getVuelosByIataCode(req.query)
            res.json(vuelos);
    
        } catch (error) {
            res.status(404).json({ 'success': false, 'message': error.message});
        }
    }
}

addVuelo = async function (req, res) {

    if (req.verifyParametersQuery()) {

        try {
            await dataVuelos.findVuelo(req.body);

            const airportOrigen = await getAirport(req.body.origen.iata_code);
            const airportDestino = await getAirport(req.body.destino.iata_code);

            req.body.origen.aeropuerto = airportOrigen;
            req.body.destino.aeropuerto = airportDestino;
            req.body.asientosDisponibles = 10;
            
            const vuelo = await dataVuelos.addVuelo(req.body);
            res.json(vuelo);

        } catch (error) {
            res.status(422).json({ 'success': false, 'message': error.message});
        }
    }
}
  

updateVuelo = async function (req, res) {

    if (req.verifyParametersQuery()) {

        try {
            let vueloExiste = await dataVuelos.getVuelo(req.params.id);
            if (vueloExiste) {
                await dataVuelos.updateVuelo(req.params.id, req.body)
                res.send(`Se actualizaron los datos del vuelo con ID: ${req.params.id}`);
            } else {
                throw new Error('Vuelo no registrado') 
            }

        } catch (error) {
            res.status(422).json({ 'success': false, 'message': error.message});
        }
    }
}

deleteVuelo = async function (req, res) {
    
    if (req.verifyParametersQuery()) {

        try {
            await dataVuelos.getVuelo(req.params.id);
            await dataVuelos.deleteVuelo(req.params.id)
            res.send(`El vuelo con ID ${req.params.id} fue eliminado`);

        } catch (error) {
            res.status(422).json({ 'success': false, 'message': error.message});
        }
    }
}

// restarAsientos = async function (req, res)

module.exports = { getVuelos, getVueloByID, filtrarVuelos, addVuelo, updateVuelo, deleteVuelo }