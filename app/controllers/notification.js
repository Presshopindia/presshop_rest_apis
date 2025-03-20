const express = require('express')
const router = express.Router()
const FCM = require('fcm-node')

// var serverKey = 'AAAAyXjSB2M:APA91bFxCJAlCLqKomgNB0I1VNBvTU5WFJDcccwFjzjGDHOmyFMTYXVJY_BxMjMpsZidQjBnkSppFmvIh_63IZwXJkrAhEX9pXV9zUcVYQuwwBgLaoYojJnxroEUKBz0MV6At9WwEiqt'; //put your server key here
// var fcm = new FCM(serverKey);

exports.sendPushNotification = function(token, title, body, device_type, data) {
  ;(data = {
    title,
    body
  }),
    (notification = {
      title,
      body
    })

  if (token) {
    var message = {
      // this may vary according to the message type (single recipient, multicast, topic, et cetera)
      to: token,
      // collapse_key: 'your_collapse_key',

      data
    }
  }

  FCM.send(message, (err, response) => {
    if (err) {
      console.log('Something has gone wrong!')
    } else {
      console.log('Successfully sent with response: ', response)
    }
  })
}
