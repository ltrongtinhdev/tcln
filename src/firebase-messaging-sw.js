importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js');
 importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js');
//  importScripts('https://www.gstatic.com/firebasejs/8.4.1/firebase/init.js');

// firebase.initializeApp({
//   apiKey: 'AIzaSyBcYAEhcJrQuwTDpgZDVSWFmc9diB9WlRo',
//   authDomain: 'appangular-da7d3.firebaseapp.com',
//   projectId: 'appangular-da7d3',
//   databaseURL: 'https://appangular-da7d3-default-rtdb.asia-southeast1.firebasedatabase.app/',
//   storageBucket: 'appangular-da7d3.appspot.com',
//   messagingSenderId: '1064195262085',
//   appId: "1:1064195262085:web:720eb27d27886c4ba9cbec",
//   measurementId: "G-K92JQ7YF48"
// });


firebase.initializeApp({
  apiKey: 'AIzaSyBcYAEhcJrQuwTDpgZDVSWFmc9diB9WlRo',
  authDomain: 'appangular-da7d3.firebaseapp.com',
  projectId: 'appangular-da7d3',
  databaseURL: 'https://appangular-da7d3-default-rtdb.asia-southeast1.firebasedatabase.app/',
  storageBucket: 'appangular-da7d3.appspot.com',
  messagingSenderId: '1064195262085',
  appId: "1:1064195262085:web:720eb27d27886c4ba9cbec",
  measurementId: "G-K92JQ7YF48"
});
// {
//   apiKey: "AIzaSyBpIOS3f66VUT5obTFPS7kx19AoECVd3JA",
//   authDomain: "webtuthien.firebaseapp.com",
//   databaseURL: "https://webtuthien-default-rtdb.firebaseio.com",
//   projectId: "webtuthien",
//   storageBucket: "webtuthien.appspot.com",
//   messagingSenderId: "102889078940",
//   appId: "1:102889078940:web:77826010eb1b66d0db6d59",
//   measurementId: "G-16R93YQK98"
// }
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  const title = 'Hello World from SW!';
  const options = {
      body: payload.data.status
  };
  console.log('payload',payload);
  return self.registration.showNotification(title, options);
});
