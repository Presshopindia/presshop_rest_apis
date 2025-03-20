const admin = require('firebase-admin')
const serviceAccount = require('./presshopdev-db299-firebase-adminsdk-r42uz-b9ca75d6ae.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

module.exports = {
  db,
  admin
}
