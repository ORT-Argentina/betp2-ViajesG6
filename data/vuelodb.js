const connection = require('./connection');
let objectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');

const DBNAME = 'sample_tp2';
const COLLECTION = 'vuelos';

async function getVuelos() {
    const clienteMongo = await connection.getConnection();

    const vuelos = await clienteMongo.db(DBNAME)
    .collection(COLLECTION).find()
    .toArray();
    return vuelos;
}

async function getVuelo(id) {
    const clienteMongo = await connection.getConnection();
    const vuelo = await clienteMongo.db(DBNAME).collection(COLLECTION)
        .findOne({_id: new objectId(id)});

    if(!vuelo){ 
        throw new Error('Vuelo no registrado') 
    }   
    return vuelo;
}

async function getVuelosByIataCode(query) {
    const clienteMongo = await connection.getConnection();

    let queryBuilder = {
        "origen.iata_code": query.origen,
        "destino.iata_code": query.destino
      };

      //$gte = greater than or equal to - $lte less than or equal to
      if (query.millasMinimo && query.millasMaximo) {
        queryBuilder.millas = {
          $gte: parseInt(query.millasMinimo),
          $lte: parseInt(query.millasMaximo)
        };

      } else if (query.millasMinimo) {
        queryBuilder.millas = { $gte: parseInt(query.millasMinimo) };

      } else if (query.millasMaximo) {
        queryBuilder.millas = { $lte: parseInt(query.millasMaximo) };

      } else if (query.millasExacto) {
        queryBuilder.millas = parseInt(query.millasExacto);
      }



      if (query.fechaMinima && query.fechaMaxima) {
        queryBuilder["fecha_salida"] = {
          $gte: query.fechaMinima,
          $lte: query.fechaMaxima
        };
      } else if (query.fechaMinima) {
        queryBuilder["fecha_salida"] = { $gte: query.fechaMinima };

      } else if (query.fechaMaxima) {
        queryBuilder["fecha_salida"] = { $lte: query.fechaMaxima };

      } else if (query.fechaExacta) {
        queryBuilder["fecha_salida"] = query.fechaExacta;
      }
  
      const vuelos = await clienteMongo.db(DBNAME).collection(COLLECTION)
          .find(queryBuilder)
          .toArray();

    if(vuelos.length === 0){ 
        throw new Error('No se han encontrado vuelos con los parametros insertados') 
    }   
    return vuelos;
}

async function addVuelo(vuelo) {
    const clienteMongo = await connection.getConnection();
    const agregar = await clienteMongo.db(DBNAME).collection(COLLECTION)
        .insertOne(vuelo);
    return agregar;
}

// async function updateVuelo(id, body) {
//     const clienteMongo = await connection.getConnection();
//     const query = {_id: new objectId(id)};
//     const newValues = {
//         // $set: {
//         //     origen:{
//         //         iata_code: body.origen.iata_code,
//         //         ciudad: body.origen.ciudad
//         //     },
//         //     destino:{
//         //         iata_code: body.destino.iata_code,
//         //         ciudad: body.destino.ciudad
//         //     },
//         //     // "origen.iata_code": body.origen.iata_code,
//         //     // "origen.ciudad": body.origen.ciudad,
//         //     // "destino.iata_code": body.destino.iata_code,
//         //     // "destino.ciudad": body.destino.ciudad,
//         //     fecha_salida: body.fecha_salida,
//         //     precio: body.precio,
//         //     moneda: body.moneda
//         // }
//         $set: Object.assign({}, body)
//     };
//     const actualizar = await clienteMongo.db(DBNAME).collection(COLLECTION)
//         .updateOne(query, newValues);
//     return actualizar;
// }

async function updateVuelo(id, body) {
    const clienteMongo = await connection.getConnection();
    const query = { _id: new objectId(id) };
    const currentValues = await clienteMongo.db(DBNAME).collection(COLLECTION)
      .findOne(query);
    const newValues = {};
    Object.keys(body).forEach(key => {
      if (body[key] !== currentValues[key]) {
        newValues[key] = body[key];
      }
    });
    if (Object.keys(newValues).length > 0) {
      const updateOperation = { $set: newValues };
      const actualizar = await clienteMongo.db(DBNAME).collection(COLLECTION)
        .updateOne(query, updateOperation);
      return actualizar;
    }
    return {};
}  
  

async function findVuelo(body){
    const clienteMongo = await connection.getConnection();
    const vuelo = await clienteMongo.db(DBNAME)
        .collection(COLLECTION)
        .findOne({
            fecha_salida: body.fecha_salida,
            "origen.iata_code": body.origen.iata_code,
            "destino.iata_code": body.destino.iata_code
        });

    if (vuelo){
        throw new Error(`Ya existe un vuelo con los mismos datos (${body.origen.iata_code} - ${body.destino.iata_code} - ${body.fecha_salida})`);
    }
    // return vuelo ? true : false;
}

async function generateJWT(user) {
    const token = jwt.sign({_id: user._id, email: user.email}, process.env.SECRET, {expiresIn: '1h'});
    return token;
}

async function deleteVuelo(id) {
    const clienteMongo = await connection.getConnection();
    const borrar = await clienteMongo.db(DBNAME).collection(COLLECTION).deleteOne({_id: new objectId(id)}); 
    return borrar;
}

async function restarAsientos(id, pasajeros) {
  const clienteMongo = await connection.getConnection();

  const updatedVuelo = await clienteMongo.db(DBNAME).collection(COLLECTION).updateOne(
    { _id: new objectId(id) },
    { $inc: { asientosDisponibles: -pasajeros } }
  );

  if(!updatedVuelo){ 
      throw new Error('Vuelo no registrado') 
  }

  return updatedVuelo;
}

async function sumarAsientos(id, pasajeros) {
  const clienteMongo = await connection.getConnection();

  const updatedVuelo = await clienteMongo.db(DBNAME).collection(COLLECTION).updateOne(
    { _id: new objectId(id) },
    { $inc: { asientosDisponibles: +pasajeros } } //The  $inc operator increments a field by a specified value
  );

  if(!updatedVuelo){ 
      throw new Error('Vuelo no registrado') 
  }
  
  return updatedVuelo;
}


module.exports = { getVuelos, getVuelo, getVuelosByIataCode, addVuelo, updateVuelo, 
                deleteVuelo, findVuelo, generateJWT, restarAsientos, sumarAsientos };
