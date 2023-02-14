##### BETP2-VIAJESG6
# APP Vuelos

Alumnos: Shanon Samora.

La aplicacion es un sistema de gestión de pasajes de avión en la que se pueden realizar consultas pudiendo filtrar por pais de origen y destino, millas y fecha de salida. Además, cada usuario puede comprar un pasaje de avión si cuenta con las millas suficientes y haya asientos disponibles. Por supuesto también se cuenta con registro e ingreso de usuario.

##### Descripción
Es una app de vuelos, en la que se realizan consultas pudiendo filtrar por país de origen/destino, y fecha de ida/vuelta. Cada usuario registrado podrá marcar un viaje como favorito, añadiendolo a una lista personal que podrá ver en su perfil, además podrá suscribirse para recibir información sobre promociones. 
 
##### Package
Ejecuta `npm install`, instalando así todas las dependencias en el path _node\_modules_. 
##### `npm start`
Abra [http://localhost:3000](http://localhost:3000) para verlo en el navegador.

# Usuarios:

- Todos los usuarios: GET /users (requiere token)
- GET usuario por ID: GET /users/:id (requiere token)
- Alta/Registro de usuario POST: /users/signup (body):
{
    "email": "elon@gmail.com",
    "password": "hola123",
    "nombre": "Elon",
    "apellido": "Musk",
    "fecha_nacimiento": "2001-12-26"
}
Se agrega automaticamente el dinero disponible (en 0) y una lista (array) vacia de "vuelos_comprados". Ademas, la password es encriptada con bcrypt.

- LogIn POST /users/login (body):
{
    "email": "elon@gmail.com",
    "password": "hola123"
}

- Compra de vuelo /users/comprarVuelo/:id (body):
{
    "pasajeros": 2
}

- Cancelación de vuelo /users/cancelarVuelo/:id
- Vuelos de usuario GET /users/misVuelos/:email
- Actualización de contraseña PUT /users/updatePassword/:id (body):
{
    "password": "hola12"
}

- Borrar un usuario DELETE /users/deleteUser/:id

# Vuelos:

- Todos los vuelos: GET /vuelos
- GET vuelo por ID: GET /vuelos/:id
- Alta de una vuelo: POST /vuelos/addVuelo (body):
    {
        "origen": {
            "iata_code": "EZE"
        },
        "destino": {
            "iata_code": "MAD"
        },
        "fecha_salida": "2023-10-09",
        "millas": 980
    }
El aeropuerto y asientos disponibles se añaden automáticamente. El aeropuerto se hace una llamada a la API 'https://airlabs.co/api/v9/airports?iata_code=${iata_code}&api_key=${API_KEY}' y los asientos disponibles siempre se setean en 10.

- UPDATE vuelo: PUT /vuelos/updateVuelo/:id (body):
    {
        "origen": {
            "iata_code": "EZE",
            "aeropuerto": "Buenos Aires - Ministro Pistarini International Airport"
        },
        "destino": {
            "iata_code": "MAD",
            "aeropuerto": "Adolfo Suarez Madrid-Barajas Airport"
        },
        "fecha_salida": "2023-07-13",
        "precio": 950,
        "moneda": "USD",
        "asientosDisponibles": 10
    }

- Borrar un vuelo: DELETE /vuelos/deleteVuelo/:id
- Filtrar vuelos: GET /vuelos/filtrarVuelos
Parametros posibles en la query: origen, destino, precioMinimo, precioMaximo, precioExacto, fechaMinima, fechaMaxima, fechaExacta.
Los minimos y maximos pueden usarse juntos.
http://localhost:3000/vuelos/filtrarVuelos?origen=EZE&destino=MAD