import { AngularFireStorage, AngularFireStorageModule ,} from '@angular/fire/storage';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';
//import firebase from "firebase/app";
//import * as firebase from 'firebase';
import { AngularFireMessaging } from '@angular/fire/messaging';

import firebase from "firebase/app";
import "firebase/messaging";
import { AngularFireModule } from '@angular/fire';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private messaging = firebase.messaging()
  currentMessage = new BehaviorSubject(null)
  private messageSource = new Subject()

  constructor(
    private afs: AngularFireStorage ,
    private afAuth:AngularFireModule,
    private angularFireMessaging: AngularFireMessaging
     ) { }

  getMessagingObject() {
    // [START messaging_get_messaging_object]
    const messaging = firebase.messaging();
    // [END messaging_get_messaging_object]
  }
  requestPermission () {
    this.angularFireMessaging.requestToken.subscribe (
    (token) => {
    console.log (token);
    },
    (err) => {
    console.error ('Không thể xin phép thông báo.', err);
    }
    );
    }
  receiveMessage() {
    //const messaging = firebase.messaging();
    // [START messaging_receive_message]
    // Handle incoming messages. Called when:
    // - a message is received while the app has focus
    // - the user clicks on an app notification created by a service worker
    //   `messaging.onBackgroundMessage` handler.
    this.messaging.onMessage((payload) => {
      console.log('Message received. ', payload);
      // ...
    });
    // [END messaging_receive_message]
  }

  getToken() {
    //const messaging = firebase.messaging();
    // [START messaging_get_token]
    // Get registration token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    this.messaging.getToken({ vapidKey: 'BIpCRU4CMbY7oyY4lS0fsl1k7J7WmlLIBPZojvJYGMWFdIvOKKCtgSt1xAo36bo_umvvWignihrELHhkub0EVWE' }).then((currentToken) => {
      if (currentToken) {
        // Send the token to your server and update the UI if necessary
        // ...
        console.log(currentToken)
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    });
    // [END messaging_get_token]
  }

  // requestPermission() {
  //   // [START messaging_request_permission]

  //   Notification.requestPermission().then((permission) => {
  //     if (permission === 'granted') {
  //       console.log('Notification permission granted.');
  //       console.log(this.messaging.getToken())
  //       return this.messaging.getToken()

  //       // TODO(developer): Retrieve a registration token for use with FCM.
  //       // ...
  //     } else {
  //       console.log('Unable to get permission to notify.');
  //     }
  //   });
  //   // [END messaging_request_permission]
  // }

  deleteToken() {
    //const messaging = firebase.messaging();

    // [START messaging_delete_token]
    this.messaging.deleteToken().then(() => {
      console.log('Token deleted.');
      // ...
    }).catch((err) => {
      console.log('Unable to delete token. ', err);
    });
    // [END messaging_delete_token]
  }

}
