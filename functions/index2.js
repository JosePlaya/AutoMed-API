const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
//const serviceAccount = require("/Users/Shared/AutoMed-Functions/functions/permission.json");
const bodyParser = require('body-parser');

admin.initializeApp();

const app = express();
const db = admin.firestore();

const centrosPath = 'centros';
const adminsPath = 'admins';
const medicoPath = 'medicos';
const farmaceuticosPath = 'farmaceuticos';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// ------------------------------------------------- \\
//                      STATUS                       \\
// ------------------------------------------------- \\
// STATUS
app.get('/status/', (rep, res) => {
    return res.status(200).send('Web API: ONLINE')
});


// ------------------------------------------------- \\
//                     CENTORS                       \\
// ------------------------------------------------- \\
// CREAR NUEVO CENTRO
app.post('/centro/', async (req, res) => {
    try {
        await db.collection(centrosPath)
        .doc()
        .create({
            tipo: req.body.tipo,
            nombre: req.body.nombre,
            direccion: req.body.direccion,
            comuna: req.body.comuna,
            region: req.body.region
        });
        return res.status(201).send(`Nuevo centro creado: ${req.body.nombre}`);
    } catch (error) {
        res.status(400).send(`Error: ${error}`)
    }        
});

// OBTENER TODOS LOS CENTRO
app.get('/centros/', async (req, res) => {
    try {
        const query = db.collection(centrosPath);
        const querySnapshot = await query.get();
        const docs = querySnapshot.docs;

        const response = docs.map((doc) => ({
            id: doc.id,
            nombre: doc.data().nombre,
            direccion: doc.data().direccion,
            comuna: doc.data().comuna,
            region: doc.data().region
        }));
        

        return res.status(200).json(response);
    } catch (error) {
        res.status(400).send(`Error: ${error}`)
    }        
});

// OBTENER UN CENTRO
app.get('/centros/:centro_id', async (req, res) => {
    try {
        const doc = db.collection(centrosPath).doc(req.params.centro_id);
        const centro = await doc.get();
        const response = centro.data();
        return res.status(200).json(response);
    } catch (error) {
        res.status(400).send(`Error: ${error}`)
    }        
});


// ------------------------------------------------- \\
//                      STATUS                       \\
// ------------------------------------------------- \\
// NEW ADMIN USER
app.post('/new-admin/', async (req, res) => {
    
    // Variables del request
    const correo = req.body.correo;
    const nombre = req.body.nombre;
    const apaterno = req.body.apaterno;
    const amaterno = req.body.amaterno;
    const displayName = nombre +' '+ apaterno +' '+ amaterno

    try {
        // Crear usuario en Auth
        await admin.auth().createUser({
            email: correo,
            emailVerified: true,
            password: req.body.password,
            displayName: displayName,
            disabled: false
          })
            // Almacenar datos del usuario en Firestore
            .then(function(userRecord) {
                try {
                    db.collection(adminsPath)
                    .doc(userRecord.uid)
                    .create({
                        correo: correo,
                        nombre: nombre,
                        apaterno: apaterno,
                        amaterno: amaterno
                    });
                    return res.status(201).send(`Nuevo usuario admin creado: ${displayName}`);
                } catch (error) {
                    res.status(400).send(`Error: SE HA CREADO EL USUARIO, PERO NO SE ALAMCENARON LOS DATOS. ${error}`);
                }
            })
            .catch(function(error) {
                res.status(400).send(`Error: ${error}`);
            });
    } catch (error) {
        res.status(500).send(`${error}`)
    }
});

// NEW MEDICO USER
app.post('/new-medico/', async (req, res) => {
    
    // Variables del request
    const rut = req.body.rut;
    const correo = req.body.correo;
    const nombre = req.body.nombre;
    const apaterno = req.body.apaterno;
    const amaterno = req.body.amaterno;
    const especialidad = req.body.especialidad;
    const idCentroMedico = req.body.idCentroMedico;
    const displayName = nombre +' '+ apaterno +' '+ amaterno

    try {
        // Crear usuario en Auth
        await admin.auth().createUser({
            email: correo,
            emailVerified: true,
            password: req.body.password,
            displayName: displayName,
            disabled: false
          })
            // Almacenar datos del usuario en Firestore
            .then(function(userRecord) {
                try {
                    db.collection(medicoPath)
                    .doc(userRecord.uid)
                    .create({
                        rut: rut,
                        correo: correo,
                        nombre: nombre,
                        apaterno: apaterno,
                        amaterno: amaterno,
                        especialidad: especialidad,
                        idCentroMedico: idCentroMedico
                    });
                    return res.status(201).send(`Nuevo usuario medico creado: ${displayName}`);
                } catch (error) {
                    res.status(400).send(`Error: SE HA CREADO EL USUARIO, PERO NO SE ALAMCENARON LOS DATOS. ${error}`);
                }
            })
            .catch(function(error) {
                res.status(400).send(`Error: ${error}`);
            });
    } catch (error) {
        res.status(500).send(`${error}`)
    }
});

// NEW FARMACEUTICO USER
app.post('/new-farmaceutico/', async (req, res) => {
    
    // Variables del request
    const rut = req.body.rut;
    const correo = req.body.correo;
    const nombre = req.body.nombre;
    const apaterno = req.body.apaterno;
    const amaterno = req.body.amaterno;
    const idCentroMedico = req.body.idCentroMedico;
    const displayName = nombre +' '+ apaterno +' '+ amaterno

    try {
        // Crear usuario en Auth
        await admin.auth().createUser({
            email: correo,
            emailVerified: true,
            password: req.body.password,
            displayName: displayName,
            disabled: false
          })
            // Almacenar datos del usuario en Firestore
            .then(function(userRecord) {
                try {
                    db.collection(farmaceuticosPath)
                    .doc(userRecord.uid)
                    .create({
                        rut: rut,
                        correo: correo,
                        nombre: nombre,
                        apaterno: apaterno,
                        amaterno: amaterno,
                        idCentroMedico: idCentroMedico
                    });
                    return res.status(201).send(`Nuevo usuario farmaceutico creado: ${displayName}`);
                } catch (error) {
                    res.status(400).send(`Error: SE HA CREADO EL USUARIO, PERO NO SE ALAMCENARON LOS DATOS. ${error}`);
                }
            })
            .catch(function(error) {
                res.status(400).send(`Error: ${error}`);
            });
    } catch (error) {
        res.status(500).send(`${error}`)
    }
});


//---------------------------------------------------
exports.webApi = functions.https.onRequest(app);