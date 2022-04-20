https://www.youtube.com/watch?v=uAZye3L2NPo

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebaseHelper = require('firebase-functions-helper');
const express = require('express');
const bodyParser = require('body-parser');

admin.initializeApp(functions.config().firebase);
// admin.initializeApp({X
//     credential: admin.credential.cert('/permission.json')
// });
const db = admin.firestore();

const app = express();
const main = express();
const contactsCollection = 'contacts';

main.use('/api/', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));



// Add new contact
app.post('/contacts', async (req, res) => {
    try {
        const contact = {
            firstName: req.body['firstName'],
            lastName: req.body['lastName'],
            email: req.body['email']
        }
        const newDoc = await firebaseHelper.firestore
            .createNewDocument(db, contactsCollection, contact);
        res.status(201).send(`Created a new contact: ${newDoc.id}`);
    } catch (error) {
        res.status(400).send(`Contact should only contains firstName, lastName and email!!!`)
    }        
})
// Update new contact
app.patch('/contacts/:contactId', async (req, res) => {
    const updatedDoc = await firebaseHelper.firestore
        .updateDocument(db, contactsCollection, req.params.contactId, req.body);
    res.status(204).send(`Update a new contact: ${updatedDoc}`);
})// View a contact
app.get('/contacts/:contactId', (req, res) => {
    firebaseHelper.firestore
        .getDocument(db, contactsCollection, req.params.contactId)
        .then(doc => res.status(200).send(doc))
        .catch(error => res.status(400).send(`Cannot get contact: ${error}`));
})// View all contacts
app.get('/contacts', (req, res) => {
    firebaseHelper.firestore
        .backup(db, contactsCollection)
        .then(data => res.status(200).send(data))
        .catch(error => res.status(400).send(`Cannot get contacts: ${error}`));
})// Delete a contact 
app.delete('/contacts/:contactId', async (req, res) => {
    const deletedContact = await firebaseHelper.firestore
        .deleteDocument(db, contactsCollection, req.params.contactId);
    res.status(204).send(`Contact is deleted: ${deletedContact}`);
})

// webApi is your functions name, and you will pass main as 
// a parameter
exports.webApi = functions.https.onRequest(main);