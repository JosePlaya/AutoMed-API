const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
//const serviceAccount = require("/Users/Shared/AutoMed-Functions/functions/permission.json");
const bodyParser = require('body-parser');
const { body, validationResult, param } = require('express-validator');
const { validate, clean, format, getCheckDigit } = require('rut.js');
// const { mailer } = require('./email.js');
//var messagebird = require('messagebird')('HbN2vflvdwndrCNqFkcsAB5Hs');


admin.initializeApp();

// CONFIGURACIÓN app
const app = express();
const db = admin.firestore();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// ------------------------------------------------- \\
//                RUTAS COLECCIONES                  \\
// ------------------------------------------------- \\
const centrosPath = 'centros';
const adminsPath = 'admins';
const medicoPath = 'medicos';
const usuariosPath = 'usuarios';
const pacientesPath = 'pacientes';
const medicamentosPath = 'medicamentos';
const preescripcionPath = 'prescripciones';
const farmaceuticosPath = 'farmaceuticos';
//
const tiposUsuarios = ['administrador', 'medico', 'farmaceutico']


// ------------------------------------------------- \\
//                 VALIDACIÓN DATOS                  \\
// ------------------------------------------------- \\
// USUARIO
const userCreationValidators = [
    body('tipoUsuario').notEmpty().isIn(tiposUsuarios).withMessage("Tipo usuario incorrecto: admin, medico, farmaceutico"),
    body('correo').notEmpty().isEmail().withMessage("Correo invalido"),
    body('rut').notEmpty().custom(value => {
        if(validate(value)){
            return format(value)
        }else{
            return Promise.reject('Rut inválido')
        }
    }).withMessage("Rut inválido"),
    body('nombre').notEmpty().withMessage("Falta nombre"),
    body('apaterno').notEmpty().withMessage("Falta apellido paterno"),
    body('amaterno').notEmpty().withMessage("Falta apellido materno"),
    body('idCentroMedico').notEmpty().withMessage("Falta ID del centro médico"),
    body('especialidad').optional(),
    body('password').notEmpty().isLength({min: 5}).withMessage("Largo mínimo de 5 dígitos")
   ];
// ADMIN
const adminUserCreationValidators = [
    body('tipoUsuario').notEmpty().isIn(tiposUsuarios).withMessage("Tipo usuario incorrecto: admin, medico, farmaceutico"),
    body('correo').isEmail().withMessage("Correo invalido"),
    body('nombre').notEmpty().withMessage("Falta nombre"),
    body('apaterno').notEmpty().withMessage("Falta apellido paterno"),
    body('amaterno').notEmpty().withMessage("Falta apellido materno"),
    body('password').isLength({min: 5}).withMessage("Largo mínimo de 5 dígitos")
   ];
// MEDICO
const medicoUserCreationValidators = [
    body('tipoUsuario').notEmpty().isIn(tiposUsuarios).withMessage("Tipo usuario incorrecto: admin, medico, farmaceutico"),
    body('correo').isEmail().withMessage("Correo invalido"),
    body('rut').notEmpty().withMessage("Rut inválido"),
    body('nombre').notEmpty().withMessage("Falta nombre"),
    body('apaterno').notEmpty().withMessage("Falta apellido paterno"),
    body('amaterno').notEmpty().withMessage("Falta apellido materno"),
    body('idCentroMedico').notEmpty().withMessage("Falta id del centro medico"),
    body('especialidad').notEmpty().withMessage("Falta especialidad"),
    body('password').isLength({min: 5}).withMessage("Largo mínimo de 5 dígitos")
   ];
// FARMACEUTICO
const farmaceuticoUserCreationValidators = [
    body('tipoUsuario').notEmpty().isIn(tiposUsuarios).withMessage("Tipo usuario incorrecto: admin, medico, farmaceutico"),
    body('correo').isEmail().withMessage("Correo invalido"),
    body('rut').notEmpty().withMessage("Rut inválido"),
    body('nombre').notEmpty().withMessage("Falta nombre"),
    body('apaterno').notEmpty().withMessage("Falta apellido paterno"),
    body('amaterno').notEmpty().withMessage("Falta apellido materno"),
    body('idCentroMedico').notEmpty().withMessage("Falta id del centro medico"),
    body('password').isLength({min: 5}).withMessage("Largo mínimo de 5 dígitos")
   ];
// PACIENTE
const pacienteCreationValidators = [
    body('correo').isEmail().optional().withMessage("Correo invalido"),
    body('telefono').isInt().optional().isLength({min: 11}).withMessage("Teléfono invalido"),
    body('nombre').notEmpty().withMessage("Falta nombre"),
    body('apaterno').notEmpty().withMessage("Falta apellido paterno"),
    body('amaterno').notEmpty().withMessage("Falta apellido materno"),
    body('rut').notEmpty().withMessage("Falta rut"),
    body('fechan').isDate().withMessage("Fecha de nacimiento invalida"),
    body('im_carnet').optional(),
    body('im_cif').optional(),
    body('color_cif').notEmpty().isIn(['rosado', 'celeste', 'verde']).withMessage('Falta color de la cif o color no es válido: rosado, celeste o verde.'),
    body('not_wsp').isBoolean().withMessage("Dato boleano"),
    body('not_cor').isBoolean().withMessage("Dato boleano")
   ];
// USUARIO
const prescripcionesCreationValidators = [
    body('tipoUsuario').notEmpty().isIn(tiposUsuarios).withMessage("Tipo usuario incorrecto: admin, medico, farmaceutico"),
    body('correo').notEmpty().isEmail().withMessage("Correo invalido"),
    body('rut').notEmpty().custom(value => {
        if(validate(value)){
            return format(value)
        }else{
            return Promise.reject('Rut inválido')
        }
    }).withMessage("Rut inválido"),
    body('nombre').notEmpty().withMessage("Falta nombre"),
    body('apaterno').notEmpty().withMessage("Falta apellido paterno"),
    body('amaterno').notEmpty().withMessage("Falta apellido materno"),
    body('idCentroMedico').notEmpty().withMessage("Falta ID del centro médico"),
    body('especialidad').optional(),
    body('password').notEmpty().isLength({min: 5}).withMessage("Largo mínimo de 5 dígitos")
];



// ------------------------------------------------- \\
//                      STATUS                       \\
// ------------------------------------------------- \\
// STATUS
app.get('/status/', (rep, res) => {
    return res.status(200).send('Web API: ONLINE')
});



// ------------------------------------------------- \\
//                      USUARIOS                     \\
// ------------------------------------------------- \\
// NEW USUARIO
app.post('/usuario/', userCreationValidators, async (req, res) => {

    // Validar datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Error en el request: ', errors.array());
        return res.status(404).json({ errors: errors.array() });
    }

    // Variables del request
    const correo = req.body.correo;
    const nombre = req.body.nombre;
    const apaterno = req.body.apaterno;
    const amaterno = req.body.amaterno;
    const displayName = nombre +' '+ apaterno +' '+ amaterno

    // Crear datos usuario para BD
    const user = req.body
    
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
                    db.collection(usuariosPath)
                    .doc(userRecord.uid)
                    .create(user);
                    return res.status(201).send(`Nuevo usuario admin creado: ${displayName}`);
                } catch (error) {
                    console.log('Error 1');
                    res.status(400).send(`Error: SE HA CREADO EL USUARIO, PERO NO SE ALAMCENARON LOS DATOS. ${error}`);
                }
            })
            .catch(function(error) {
                console.log('Error 2');
                res.status(400).send(`Error: ${error}`);
            });
    } catch (error) {
        res.status(500).send(`${error}`)
    }
});

// OBTENER USUARIOS POR TIPO
app.get('/usuarios/:tipo', async (req, res) => {

    const tipou = req.params.tipo;

    if(!tiposUsuarios.includes(tipou)){
        // Se especifica un tipo de usuario erroneo
        return res.status(400).send(`Error en el tipo de usuario a buscar.\nDeben ser del tipo: ` + tiposUsuarios);
    }

    try {
        const query = db.collection(usuariosPath).where('tipoUsuario', '==', tipou);
        const querySnapshot = await query.get();
        const docs = querySnapshot.docs;

        // Verificar que existan datos
        if(querySnapshot.size == 0){
            // No hay centros
            return res.status(404).send(`No exsten usuarios del tipo: ` + tipou);
        }

        const response = docs.map((doc) => ({
            id: doc.id,
            tipoUsuario: doc.data().tipoUsuario,
            rut: doc.data().rut,
            correo: doc.data().correo,
            nombre: doc.data().nombre,
            apaterno: doc.data().apaterno,
            amaterno: doc.data().amaterno,
            especialidad: doc.data().especialidad,
            idCentroMedico: doc.data().idCentroMedico
        }));
        return res.status(200).json(response);

    } catch (error) {
        res.status(400).send(`Error: ${error}`)
    }        
});

// OBTENER INFORMACIÓN DE UN USUARIO
app.get('/usuario/:user_id', async (req, res) => {
    try {
        const doc = db.collection(usuariosPath).doc(req.params.user_id);
        const user = await doc.get();
        const response = user.data();
        // Verificar que existan datos
        if (response == null){
            // No se hayó el usuario
            return res.status(404).send(`Usuario no encontrado`);    
        }else{
            // Existe el usuario
            // Se devuelven sus datos
            return res.status(200).json(response);
        }
    } catch (error) {
        res.status(400).send(`Error: ${error}`)
    }        
});

// ELIMINAR USUARIO 
app.delete('/usuario/:user_id', async (req, res) => {
    try {
        const userRef = db.collection(usuariosPath).doc(req.params.user_id).delete();
        res.status(200).send(`Fue eliminado el usuario: ${req.params.user_id}`);
    } catch (error) {
        res.status(400).send(`Error: ${error}`);
    }
});



// ------------------------------------------------- \\
//                     CENTROS                       \\
// ------------------------------------------------- \\
// CREAR NUEVO CENTRO MEDICO
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

// OBTENER TODOS LOS CENTRO MEDICO
app.get('/centros/', async (req, res) => {
    try {
        const query = db.collection(centrosPath);
        const querySnapshot = await query.get();
        const docs = querySnapshot.docs;

        // Verificar que existan datos
        if(querySnapshot.size == 0){
            // No hay centros
            return res.status(404).send(`No exsten centros`)
        }

        const response = docs.map((doc) => ({
            id: doc.id,
            tipo: doc.data().tipo,
            nombre: doc.data().nombre,
            direccion: doc.data().direccion,
            comuna: doc.data().comuna,
            region: doc.data().region
        }));
        

        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).send(`Error: ${error}`)
    }        
});

// OBTENER UN CENTRO MEDICO
app.get('/centros/:centro_id', async (req, res) => {
    try {
        const doc = db.collection(centrosPath).doc(req.params.centro_id);
        const centro = await doc.get();
        const response = centro.data();

        // Verificar que existan datos
        if (response == null){
            // No se hayó el CA
            return res.status(404).send(`Centro no encontrado`);    
        }else{
            // Existe el CA
            // Se devuelven sus datos
            return res.status(200).json(response);
        }
    } catch (error) {
        res.status(400).send(`Error: ${error}`)
    }        
});

// ELIMINAR MEDICAMENTO UN CENTRO MEDICO
app.delete('/centro/:centro_id', async (req, res) => {
    try {
        const medRef = db.collection(centrosPath).doc(req.params.centro_id).delete();
        res.status(200).send(`Fue eliminado el centro medico id: ${req.params.centro_id}`);
    } catch (error) {
        res.status(400).send(`Error: ${error}`);
    }
});


// ------------------------------------------------- \\
//                     PACIENTES                     \\
// ------------------------------------------------- \\
// CREAR NUEVO PACIENTE
app.post('/paciente/', pacienteCreationValidators, async (req, res) => {

    // Validar datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Crear datos usuario para BD
    const paciente = req.body

    try {
        await db.collection(pacientesPath)
        .doc()
        .create(paciente);
        return res.status(201).send(`Nuevo paciente creado: ${req.body.nombre}`);
    } catch (error) {
        res.status(400).send(`Error: ${error}`);
    }        
});

// OBTENER TODOS LOS PACIENTES
app.get('/pacientes/', async (req, res) => {
    try {
        const query = db.collection(pacientesPath);
        const querySnapshot = await query.get();
        const docs = querySnapshot.docs;

        // Verificar que existan datos
        if(querySnapshot.size == 0){
            // No hay centros
            return res.status(404).send(`No existen pacientes`)
        }

        const response = docs.map((doc) => ({
            id: doc.id,
            nombre: doc.data().nombre,
            apaterno: doc.data().apaterno,
            amaterno: doc.data().amaterno,
            rut: doc.data().rut,
            correo: doc.data().correo,
            telefono: doc.data().telefono,
            fechan: doc.data().fechan,
            color_cif: doc.data().color_cif,
            not_wsp: doc.data().not_wsp,
            not_cor: doc.data().not_cor
        }));
        return res.status(200).json(response);
    } catch (error) {
        res.status(400).send(`Error: ${error}`)
    }        
});

// OBTENER UN PACIENTE POR ID
app.get('/paciente-id/:pac_id', async (req, res) => {
    try {
        const doc = db.collection(pacientesPath).doc(req.params.pac_id);
        const paciente = await doc.get();
        const response = paciente.data();

        // Verificar que existan datos
        if (response == null){
            // No se hayó el Medicamento
            return res.status(404).send(`Paciente no encontrado`);    
        }else{
            // Existe el paciente
            // Se devuelven sus datos
            return res.status(200).json(response);
        }
    } catch (error) {
        res.status(400).send(`Error: ${error}`)
    }        
});

// OBTENER UN PACIENTE POR RUT
app.get('/paciente-rut/:pac_rut', async (req, res) => {
    try {
        const query = await db.collection(pacientesPath).where('rut', '==', req.params.pac_rut);
        const querySnapshot = await query.get();
        const paciente = querySnapshot.docs;

        // Verificar que existan datos
        if(querySnapshot.size == 0){
            // No hay centros
            return res.status(404).send(`No existe el paciente`)
        }

        const response = paciente.map((doc) => ({
            id: doc.id,
            nombre: doc.data().nombre,
            apaterno: doc.data().apaterno,
            amaterno: doc.data().amaterno,
            rut: doc.data().rut,
            correo: doc.data().correo,
            telefono: doc.data().telefono,
            fechan: doc.data().fechan,
            color_cif: doc.data().color_cif,
            not_wsp: doc.data().not_wsp,
            not_cor: doc.data().not_cor
        }));
        return res.status(200).json(response);        
    } catch (error) {
        res.status(400).send(`Error: ${error}`)
    }        
});

// ACTUALIZAR UN PACIENTE
app.patch('/paciente/:pac_id', async (req, res) => {
    try {
        const updatedDoc = await admin.firebaseHelper.firestore
            .updateDocument(db, pacientesPath, req.params.pac_id, req.body);
        return res.status(200).send(`Fue actualizado el paciente: ${updatedDoc}`);
    } catch (error) {
        return res.status(400).send(`Error: ${error}`);
    }
});

// ELIMINAR PACIENTE 
app.delete('/paciente/:pac_id', async (req, res) => {
    try {
        const deletedPac = await db.collection(pacientesPath).doc(req.params.pac_id).delete();
        return res.status(200).send(`Fue eliminado el paciente: ${req.params.pac_id}`);
    } catch (error) {
        return res.status(500).send(`Error: ${error}`);
    }
});



// ------------------------------------------------- \\
//                    MEDICAMENTOS                   \\
// ------------------------------------------------- \\
// CREAR NUEVO MEDICAMENTOS
app.post('/medicamento/', async (req, res) => {
    try {
        await db.collection(medicamentosPath)
        .doc()
        .create({
            stock: req.body.stock,
            nombre: req.body.nombre,
            codigo: req.body.codigo,
            gramaje: req.body.gramaje,
            cantidad: req.body.cantidad,
            contenido: req.body.contenido,
            fabricante: req.body.fabricante,
            descripcion: req.body.descripcion,
            idCentroMedico: req.body.idCentroMedico
        });
        return res.status(201).send(`Nuevo medicamento creado: ${req.body.nombre}`);
    } catch (error) {
        res.status(400).send(`Error: ${error}`);
    }        
});

// OBTENER TODOS LOS MEDICAMENTOS
app.get('/medicamentos/', async (req, res) => {
    try {
        const query = db.collection(medicamentosPath);
        const querySnapshot = await query.get();
        const docs = querySnapshot.docs;

        // Verificar que existan datos
        if(querySnapshot.size == 0){
            // No hay centros
            return res.status(404).send(`No exsten medicamentos`)
        }

        const response = docs.map((doc) => ({
            id: doc.id,
            nombre: doc.data().nombre,
            stock: doc.data().stock,
            codigo: doc.data().codigo,
            gramaje: doc.data().gramaje,
            cantidad: doc.data().cantidad,
            contenido: doc.data().contenido,
            fabricante: doc.data().fabricante,
            descripcion: doc.data().descripcion,
            idCentroMedico: doc.data().idCentroMedico 
        }));
        return res.status(200).json(response);
    } catch (error) {
        res.status(400).send(`Error: ${error}`)
    }        
});

// OBTENER TODOS LOS MEDICAMENTOS DE UN CENTRO
app.get('/medicamentos/:cen_id', async (req, res) => {
    try {
        const query = db.collection(medicamentosPath).where('idCentroMedico', '==', req.params.cen_id);
        const querySnapshot = await query.get();
        const docs = querySnapshot.docs;

        // Verificar que existan datos
        if(querySnapshot.size == 0){
            // No hay centros
            return res.status(404).send(`No exsten medicamentos`)
        }

        const response = docs.map((doc) => ({
            id: doc.id,
            nombre: doc.data().nombre,
            stock: doc.data().stock,
            codigo: doc.data().codigo,
            gramaje: doc.data().gramaje,
            cantidad: doc.data().cantidad,
            contenido: doc.data().contenido,
            fabricante: doc.data().fabricante,
            descripcion: doc.data().descripcion
        }));
        return res.status(200).json(response);
    } catch (error) {
        res.status(400).send(`Error: ${error}`)
    }        
});

// OBTENER UN MEDICAMENTO POR ID
app.get('/medicamento-id/:med_id', async (req, res) => {
    try {
        const doc = db.collection(medicamentosPath).doc(req.params.med_id);
        const medicamento = await doc.get();
        const r = medicamento.data();

        // Verificar que existan datos
        if (r == null){
            // No se hayó el Medicamento
            return res.status(404).send(`Medicamento no encontrado`);    
        }else{
            // Existe el medicamento
            // Se devuelven sus datos
            const response = {
                id: doc.id,
                stock: r.stock,
                codigo: r.codigo,
                nombre: r.nombre,
                gramaje: r.gramaje,
                cantidad: r.cantidad,
                contenido: r.contenido,
                fabricante: r.fabricante,
                descripcion: r.descripcion,
                idCentroMedico: r.idCentroMedico
            };

            return res.status(200).json(response);
        }
    } catch (error) {
        res.status(500).send(`Error: ${error}`)
    }        
});

// OBTENER UN MEDICAMENTO POR SU CÓDIGO
app.get('/medicamento-cod/:med_cod', async (req, res) => {
    try {
        const query = await db.collection(medicamentosPath).where('codigo', '==', req.params.med_cod);
        const querySnapshot = await query.get();
        const paciente = querySnapshot.docs;

        // Verificar que existan datos
        if(querySnapshot.size == 0){
            // No hay centros
            return res.status(404).send(`No existe el medicamento`)
        }

        const response = paciente.map((doc) => ({
            id: doc.id,
            nombre: doc.data().nombre,
            stock: doc.data().stock,
            codigo: doc.data().codigo,
            gramaje: doc.data().gramaje,
            cantidad: doc.data().cantidad,
            contenido: doc.data().contenido,
            fabricante: doc.data().fabricante,
            descripcion: doc.data().descripcion,
            idCentroMedico: doc.data().idCentroMedico
        }));
        return res.status(200).json(response);        
    } catch (error) {
        res.status(400).send(`Error: ${error}`)
    }        
});

// ACTUALIZAR UN MEDICAMENTO
app.post('/medicamento/update/:med_id', async (req, res) => {
    try {
        const medRef = db.collection(medicamentosPath).doc(req.params.med_id);
        const response = await medRef.update(req.body);
        return res.status(204).send(`Fue actualizado el medicamento: ${req.body}`);
    } catch (error) {
        return res.status(400).send(`Error: ${error}`);
    }
});

// ELIMINAR MEDICAMENTO 
app.delete('/medicamento/:med_id', async (req, res) => {
    try {
        const medRef = db.collection(medicamentosPath).doc(req.params.med_id).delete();
        res.status(200).send(`Fue eliminado el medicamento: ${req.params.med_id}`);
    } catch (error) {
        res.status(400).send(`Error: ${error}`);
    }
});

// OBTENER STOCK DE UN MEDICAMENTO POR ID
app.get('/stock/medicamento-id/:med_id', async (req, res) => {
    try {
        const doc = db.collection(medicamentosPath).doc(req.params.med_id);
        const medicamento = await doc.get();
        const response = medicamento.data();

        // Verificar que existan datos
        if (response == null){
            // No se hayó el Medicamento
            return res.status(404).send(`Medicamento no encontrado`);    
        }else{
            // Existe el medicamento
            // Se devuelven sus datos
            const resp = {
                stock: response.stock
            };
            return res.status(200).json(resp);
        }
    } catch (error) {
        res.status(400).send(`Error: ${error}`)
    }              
});

// OBTENER STOCK DE UN MEDICAMENTO POR SU CÓDIGO
app.get('/stock/medicamento-cod/:med_cod', async (req, res) => {
    try {
        const query = await db.collection(medicamentosPath).where('codigo', '==', req.params.med_cod);
        const querySnapshot = await query.get();
        const paciente = querySnapshot.docs;

        // Verificar que existan datos
        if(querySnapshot.size == 0){
            // No hay madicamento
            return res.status(404).send(`Medicamento no encontrado`)
        }

        const response = paciente.map((doc) => ({
            stock: doc.data().stock
        }));
        return res.status(200).json(response);        
    } catch (error) {
        res.status(400).send(`Error: ${error}`)
    }        
});

// ACTUALIZAR STOCK DE UN MEDICAMENTO POR ID
app.patch('/stock/medicamento-id/:med_id', async (req, res) => {
    // Variables del request
    const changeStock = req.body.stock;
    // Revisar si es un enteri: int (número)
	if (!Number.isInteger(changeStock)){
        return res.status(400).send(`El valor debe ser un entero (int)`);
    }else{
        // Es número
        // Revisar que sea distinto a 0
        if(changeStock == 0){
            return res.status(400).send(`El valor debe ser distinto a 0`);
        }
    }
    
    try {
        // Realizar consulta de stock a la BD
        const doc = db.collection(medicamentosPath).doc(req.params.med_id);
        const medicamento = await doc.get();
        const response = medicamento.data();

        // Verificar que existan datos
        if (response == null){
            // No se hayó el Medicamento
            return res.status(404).send(`Medicamento no encontrado`);    
        }else{
            // Existe el medicamento
            // Se calcula el nuevo stock
            const oldStock = response.stock;
            const newStock = oldStock + changeStock
            if(newStock < 0){
                // Stock insuficiente
                return res.status(400).send(`¡No hay stock suficiente!`);
            }else{
                // Stock suficiente
                // Se actualiza
                await db.collection(medicamentosPath).doc(req.params.med_id).update({stock: newStock});
                return res.status(200).send(`Actualizado el stock: ${newStock}`);
            }
        }
    } catch (error) {
        return res.status(400).send(`Error: ${error}`);
    }      
});

// ------------------------------------------------- \\
//                    PREESCRIPCIÓN                  \\
// ------------------------------------------------- \\
// CREAR NUEVA PRESCRIPCIÓN (DATOS)
app.post('/prescipcion-d/', async (req, res) => {
    // Almacenar en BD
    try {
        const newPres =  db.collection(preescripcionPath).doc();
        await newPres.create({
            status: 'pendiente',
            fecha: Date(),
            rutMedico: req.body.rutMedico,
            rutPaciente: req.body.rutPaciente,
            descripcion: req.body.descripcion,
            idCentroMedico: req.body.idCentroMedico,
            duracionTratamiento: req.body.duracionTratamiento
        });
        return res.status(201).json({'key' : `${newPres.id}`, 'mensaje' : `Se ha creado la nueva prescripción SIN MEDICAMENTOS `});
    } catch (error) {
        res.status(400).send(`Error: ${error}`);
    }        
});

// CREAR NUEVA PRESCRIPCIÓN (MEDICAMENTOS)
app.post('/prescipcion-m/:id_pres', async (req, res) => {

    // Datos
    const medicamentos = req.body.medicamentos;

    try {
        const medRef = db.collection(preescripcionPath).doc(req.params.id_pres);
        const response = await medRef.update(req.body);
        return res.status(204).send(`Fue actualizado el medicamento: ${req.body}`);
    } catch (error) {
        return res.status(400).send(`Error: ${error}`);
    }
});

// OBTENER TODASS LAS PRESCRIPCIONES DE UN MEDICO
app.get('/prescipciones/medico/:med_rut', async (req, res) => {
    try {
        const query = db.collection(preescripcionPath).where('rutMedico', '==', req.params.med_rut);
        const querySnapshot = await query.get();
        const docs = querySnapshot.docs;

        const response = docs.map((doc) => ({
            id: doc.id,
            fecha: doc.data().fecha,
            status: doc.data().status,
            rutMedico: doc.data().rutMedico,
            rutPaciente: doc.data().rutPaciente,
            descripcion: doc.data().descripcion,
            idCentroMedico: doc.data().idCentroMedico,
            duracionTratamiento: doc.data().duracionTratamiento,
            medicamento: doc.data().medicamento
        }));
        return res.status(200).json(response);
    } catch (error) {
        res.status(400).send(`Error: ${error}`)
    }        
});

// OBTENER TODASS LAS PRESCRIPCIONES DE UN PACIENTE
app.get('/prescipciones/paciente/:pac_rut', async (req, res) => {
    try {
        const query = db.collection(preescripcionPath).where('rutPaciente', '==', req.params.pac_rut);
        const querySnapshot = await query.get();
        const docs = querySnapshot.docs;

        const response = docs.map((doc) => ({
            id: doc.id,
            fecha: doc.data().fecha,
            status: doc.data().status,
            rutMedico: doc.data().rutMedico,
            rutPaciente: doc.data().rutPaciente,
            descripcion: doc.data().descripcion,
            idCentroMedico: doc.data().idCentroMedico,
            duracionTratamiento: doc.data().duracionTratamiento,
            medicamento: doc.data().medicamento
        }));
        return res.status(200).json(response);
    } catch (error) {
        res.status(400).send(`Error: ${error}`)
    }        
});

// OBTENER UNA PREESCRIPCION
app.get('/prescipcion/:pre_id', async (req, res) => {
    try {
        const doc = db.collection(preescripcionPath).doc(req.params.pre_id);
        const centro = await doc.get();
        const response = centro.data();
        return res.status(200).json(response);
    } catch (error) {
        res.status(400).send(`Error: ${error}`)
    }        
});

// ELIMINAR MEDICAMENTO 
app.delete('/prescipcion/:pre_id', async (req, res) => {
    try {
        const preRef = db.collection(preescripcionPath).doc(req.params.pre_id).delete();
        res.status(200).send(`La prescripción fue eliminada: ${req.params.pre_id}`);
    } catch (error) {
        res.status(400).send(`Error: ${error}`);
    }
});



// ------------------------------------------------- \\
//                   NOTIFICACIONES                  \\
// ------------------------------------------------- \\
// NOTIFICACIÓN POR NUEVO STOCK
app.post('/notificacion/new-stock/', async (req, res) => {
    return res.status(100).send('Metodo no operativo.')
});

// NOTIFICAR POR CORREO ELECTRÓNICO
// app.post('/notificacion/correo/', async (req, res) => {

//     // Datos
//     const remitentes = req.body.remitentes;
//     const stockDisponible = req.body.stockDisponible;
//     const nombreMedicamento = req.body.nombreMedicamento;
//     const nombreCentroMedico = req.body.nombreCentroMedico;

//     // Enviar correo
//     const respons = mailer(remitentes, nombreMedicamento, nombreCentroMedico, stockDisponible);
//     if (respons == 200){
//         res.status(200).send(`Mensaje enviado`);
//     }else{
//         res.status(400).send(`Error. Mensaje no enviado.`);
//     }
// });

app.post('/notificacion/wsp/', async (req, res) => {

    // Datos
    const remitentes = req.body.remitentes;
    const stockDisponible = req.body.stockDisponible;
    const nombreMedicamento = req.body.nombreMedicamento;
    const nombreCentroMedico = req.body.nombreCentroMedico;

    // Configurar wsp
    var params = {
        'to': '+56976423354',
        'from': 'e22d1dc8-d9d1-4070-8da8-7d703df148fd',
        'type': 'text',
        'content': {
          'text': 'WhatsApp de prueba!',
          'disableUrlPreview': false
        }
      };
      
      // Enviar wsp
      messagebird.conversations.send(params, function (err, response) {
        if (err) {
          return console.log(err);
        }
        console.log(response);
      });
});

//---------------------------------------------------
exports.webApi = functions.https.onRequest(app);