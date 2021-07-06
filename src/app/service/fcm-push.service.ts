import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import auth from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { AngularFireDatabase } from '@angular/fire/database';
import firebase from "firebase/app";
import 'rxjs/add/operator/take';

@Injectable()
export class FcmPushService {
  private fcmURL="http://localhost:3000/fcm/";
  messaging = firebase.messaging();
  currentMessage = new BehaviorSubject(null);
  token: any;
  constructor(private http:HttpClient,private db: AngularFireDatabase, private afAuth: AngularFireAuth) { }

  updateToken(token) {
    this.afAuth.authState.take(1).subscribe(user => {
    if (!user) return;
    //   const data = { [user.uid]: token }
    const data = {[user.uid]: token}
    this.db.object('tokens/').update(data)
    });
  }
  async getToken() {
    return await this.messaging.getToken(); 
  }
  getPermission() {
    this.messaging.requestPermission()
      .then(() => {
        console.log('Notification permission granted.');
        return this.messaging.getToken()
      })
      .then(token => {
        console.log(token)
        this.token = token;

        this.updateToken(token)
        return token;
      })
      .catch((err) => {
        console.log('Unable to get permission to notify.', err);
      });
  }

  sendMessage(param: any): any {
    return this.http.post(this.fcmURL+'send-fcm',param)
  }
  // sendMessage() {
  //     const param = {
  //       notification: {
  //           title: `Donate`,
  //           body: `Có người vừa donate cho quỹ`
  //         },
  //         to: this.token
  //     }
  //     console.log('param',param)
  //     return this.http.post('https://fcm.googleapis.com/fcm/send',param, {
  //         headers: {
  //             'Content-Type': 'application/json',
  //             'Authorization': 'AAAA98b7BoU:APA91bG5blKCdzmOJpvEG3WDbl_QDtdJ0JHHTM6rD0hvvoKHO2fAV2i27Q8J9pBsOofAn7Kynv2YXaoyVWnoU9vTJgTpEZEy9l6wMNPuXBwtFXLk94rQ5RuiRpqajDGpo9vpgozTnhRk'
  //         }
  //     })
  // }
  receiveMessage() {
      console.log(11111111111)
    this.messaging.onMessage((payload) => {
      console.log("Message received. ", payload);
      this.currentMessage.next(payload)
    }, e => {console.log(e)});
  }

}