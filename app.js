// app.js - Fichier pour la gestion de la connexion MongoDB, du modèle Contact et des opérations

const mongoose = require('mongoose');
require('dotenv').config({ path: 'MONGO-URI.env' }); // Chargement des variables d'environnement depuis le fichier '.env'

// Connexion à MongoDB Atlas
async function startApp() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connexion réussie à MongoDB Atlas');
  } catch (err) {
    console.error('Erreur de connexion à MongoDB Atlas:', err);
    return; // Arrêter l'exécution si la connexion échoue
  }

  // Définition du modèle Contact
  const contactSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: Number, required: true },
    birthdate: { type: Number, required: true },
  });

  const Contact = mongoose.model('Contact', contactSchema);

  // Fonction pour ajouter un contact à la base de données
  async function createContact() {
    try {
      const newContact = new Contact({
        fullName: 'John Doe',
        email: 'johndoe@example.com',
        phoneNumber: 123456789,
        birthdate: 19900101,
      });

      const savedContact = await newContact.save();
      console.log('Contact sauvegardé :', savedContact);
    } catch (err) {
      console.error('Erreur lors de l’ajout d’un contact :', err);
    }
  }

  const searchContact = async (email) => {
    try {
      // Search for a contact by email (you can adjust this to search by any field)
      const contact = await Contact.findOne({ email: email });
  
      if (contact) {
        console.log('Contact found:', contact);
      } else {
        console.log('No contact found with that email.');
      }
    } catch (error) {
      console.error('Error while searching for the contact:', error);
    }
  };


  const searchAndUpdateContact = async (email, newPhoneNumber, newBirthdate) => {
    try {
      // Search for the contact by email and update fields
      const updatedContact = await Contact.findOneAndUpdate(
        { email: email }, 
        { 
          phoneNumber: newPhoneNumber, 
          birthdate: newBirthdate 
        },
        { new: true }  
      );
  
      if (updatedContact) {
        console.log('Updated contact:', updatedContact);
      } else {
        console.log('No contact found with that email to update.');
      }
    } catch (error) {
      console.error('Error while searching and updating the contact:', error);
    }
  };
  
  

  // Fonction pour supprimer un contact par son email
  async function deleteContact(email) {
    try {
      const deletedContact = await Contact.findOneAndDelete({ email: email });
      if (deletedContact) {
        console.log('Contact supprimé :', deletedContact);
      } else {
        console.log('Aucun contact trouvé avec cet email');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression du contact :', err);
    }
  }

  // Fonction pour déconnecter la base de données
  async function disconnectDatabase() {
    try {
      await mongoose.disconnect();
      console.log('Déconnexion réussie de MongoDB');
    } catch (err) {
      console.error('Erreur lors de la déconnexion de MongoDB:', err);
    }
  }

  // Exécution des opérations
  try {
    await createContact();
    await searchContact('johndoe@example.com');
    await searchAndUpdateContact('johndoe@example.com',987654321,20001204);
    await deleteContact('johndoe@example.com');
  } catch (err) {
    console.error('Erreur lors de l’exécution des opérations :', err);
  } finally {
    await disconnectDatabase(); // Assurez que la déconnexion se fait après les opérations
  }
}

// Démarrer l'application
startApp();
