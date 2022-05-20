// ------------------------------------------------- \\
//                   CREAR USUARIO                   \\
// ------------------------------------------------- \\
// NEW ADMIN USER
// app.post('/new-admin/', adminUserCreationValidators, async (req, res) => {

//     // Validar datos de entrada
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(404).json({ errors: errors.array() });
//     }

//     // Variables del request
//     const correo = req.body.correo;
//     const nombre = req.body.nombre;
//     const apaterno = req.body.apaterno;
//     const amaterno = req.body.amaterno;
//     const displayName = nombre +' '+ apaterno +' '+ amaterno

//     // Crear datos usuario para BD
//     const user = req.body
    
//     try {
//         // Crear usuario en Auth
//         await admin.auth().createUser({
//             email: correo,
//             emailVerified: true,
//             password: req.body.password,
//             displayName: displayName,
//             disabled: false
//           })
//             // Almacenar datos del usuario en Firestore
//             .then(function(userRecord) {
//                 try {
//                     db.collection(adminsPath)
//                     .doc(userRecord.uid)
//                     .create(user);
//                     return res.status(201).send(`Nuevo usuario admin creado: ${displayName}`);
//                 } catch (error) {
//                     res.status(400).send(`Error: SE HA CREADO EL USUARIO, PERO NO SE ALAMCENARON LOS DATOS. ${error}`);
//                 }
//             })
//             .catch(function(error) {
//                 res.status(400).send(`Error: ${error}`);
//             });
//     } catch (error) {
//         res.status(500).send(`${error}`)
//     }
// });

// // NEW MEDICO USER
// app.post('/new-medico/', medicoUserCreationValidators, async (req, res) => {

//     // Validar datos de entrada
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(404).json({ errors: errors.array() });
//     }
    
//     // Variables del request
//     const correo = req.body.correo;
//     const nombre = req.body.nombre;
//     const apaterno = req.body.apaterno;
//     const amaterno = req.body.amaterno;
//     const displayName = nombre +' '+ apaterno +' '+ amaterno

//     // Crear datos usuario para BD
//     const user = req.body

//     try {
//         // Crear usuario en Auth
//         await admin.auth().createUser({
//             email: correo,
//             emailVerified: true,
//             password: req.body.password,
//             displayName: displayName,
//             disabled: false
//           })
//             // Almacenar datos del usuario en Firestore
//             .then(function(userRecord) {
//                 try {
//                     db.collection(medicoPath)
//                     .doc(userRecord.uid)
//                     .create(user);
//                     return res.status(201).send(`Nuevo usuario medico creado: ${displayName}`);
//                 } catch (error) {
//                     res.status(400).send(`Error: SE HA CREADO EL USUARIO, PERO NO SE ALAMCENARON LOS DATOS. ${error}`);
//                 }
//             })
//             .catch(function(error) {
//                 res.status(400).send(`Error: ${error}`);
//             });
//     } catch (error) {
//         res.status(500).send(`${error}`)
//     }
// });

// // NEW FARMACEUTICO USER
// app.post('/new-farmaceutico/', farmaceuticoUserCreationValidators, async (req, res) => {

//     // Validar datos de entrada
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(404).json({ errors: errors.array() });
//     }
    
//     // Variables del request
//     const correo = req.body.correo;
//     const nombre = req.body.nombre;
//     const apaterno = req.body.apaterno;
//     const amaterno = req.body.amaterno;
//     const displayName = nombre +' '+ apaterno +' '+ amaterno

//     // Crear datos usuario para BD
//     const user = req.body

//     try {
//         // Crear usuario en Auth
//         await admin.auth().createUser({
//             email: correo,
//             emailVerified: true,
//             password: req.body.password,
//             displayName: displayName,
//             disabled: false
//           })
//             // Almacenar datos del usuario en Firestore
//             .then(function(userRecord) {
//                 try {
//                     db.collection(farmaceuticosPath)
//                     .doc(userRecord.uid)
//                     .create(user);
//                     return res.status(201).send(`Nuevo usuario farmaceutico creado: ${displayName}`);
//                 } catch (error) {
//                     res.status(400).send(`Error: SE HA CREADO EL USUARIO, PERO NO SE ALAMCENARON LOS DATOS. ${error}`);
//                 }
//             })
//             .catch(function(error) {
//                 res.status(400).send(`Error: ${error}`);
//             });
//     } catch (error) {
//         res.status(500).send(`${error}`)
//     }
// });




// ------------------------------------------------- \\
//                INFORMACIÓN USUARIOS               \\
// ------------------------------------------------- \\
// // OBTENER INFORMACIÓN USUARIO ADMIN
// app.get('/admins/:user_id', async (req, res) => {
//     try {
//         const doc = db.collection(adminsPath).doc(req.params.user_id);
//         const user = await doc.get();
//         const response = user.data();
//         // Verificar que existan datos
//         if (response == null){
//             // No se hayó el CA
//             return res.status(404).send(`Admin no encontrado`);    
//         }else{
//             // Existe el CA
//             // Se devuelven sus datos
//             return res.status(200).json(response);
//         }
//     } catch (error) {
//         res.status(400).send(`Error: ${error}`)
//     }        
// });

// // OBTENER INFORMACIÓN USUARIO FARMACEUTICO
// app.get('/medicos/:user_id', async (req, res) => {
//     try {
//         const doc = db.collection(medicoPath).doc(req.params.user_id);
//         const user = await doc.get();
//         const response = user.data();
//         // Verificar que existan datos
//         if (response == null){
//             // No se hayó el CA
//             return res.status(404).send(`Medico no encontrado`);    
//         }else{
//             // Existe el CA
//             // Se devuelven sus datos
//             return res.status(200).json(response);
//         }
//     } catch (error) {
//         res.status(400).send(`Error: ${error}`)
//     }        
// });

// // OBTENER INFORMACIÓN USUARIO FARMACEUTICO
// app.get('/farmaceuticos/:user_id', async (req, res) => {
//     try {
//         const doc = db.collection(farmaceuticosPath).doc(req.params.user_id);
//         const user = await doc.get();
//         const response = user.data();
//         // Verificar que existan datos
//         if (response == null){
//             // No se hayó el CA
//             return res.status(404).send(`Farmaceutico no encontrado`);    
//         }else{
//             // Existe el CA
//             // Se devuelven sus datos
//             return res.status(200).json(response);
//         }
//     } catch (error) {
//         res.status(400).send(`Error: ${error}`)
//     }        
// });