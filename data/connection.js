const mongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const uri = process.env.CONNECTION_MONGO;
console.log(uri);
const client = new mongoClient(uri, { useUnifiedTopology: true });

let instance = null;

async function getConnection() {
    if(instance==null){
        try{
            instance = await client.connect();
        }catch(err){
            console.log(err.message);
        }
    }
    return instance;
}


module.exports = {getConnection}