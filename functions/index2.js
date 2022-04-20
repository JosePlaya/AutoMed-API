const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
//const serviceAccount = require("/Users/Shared/AutoMed-Functions/functions/permission.json");
const bodyParser = require('body-parser');

admin.initializeApp();

const app = express();
const db = admin.firestore();
const centrosPath = 'centros';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// STATUS
app.get('/status/', (rep, res) => {
    return res.status(200).send('Web API: ONLINE')
});

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

exports.webApi = functions.https.onRequest(app);