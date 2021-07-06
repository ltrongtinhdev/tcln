
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import auth from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import {User} from "./auth.model";

declare const FB: any;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const AUTH_API = 'http://localhost:3000/user/'

@Injectable({
  providedIn: 'root'
})
export class AuthServices {
  url;
  authState: any = null;
  public isAuthorized = false
  constructor(
    private http: HttpClient,
    public afAuth: AngularFireAuth
    //private https: AuthHttp
  ) {

    // FB.init({
    //   appId      : '1567123180016188',
    //   status     : true, // the SDK will attempt to get info about the current user immediately after init
    //   cookie     : true,  // enable cookies to allow the server to access
    //   // the session
    //   xfbml      : true,  // With xfbml set to true, the SDK will parse your page's DOM to find and initialize any social plugins that have been added using XFBML
    //   version    : 'v3.2', // use graph api version 2.5
    // });
    this.afAuth.authState.subscribe(
      (user: any) => {
        this.authState = user
      },
      (err) => {
        console.log('err',err)
      }
    )
  }
  get authenticated(): boolean {
    return this.authState !== null;
  }
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }
  

  // Returns
  get currentUserObservable(): any {
    return this.afAuth.authState
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }
  registerSocical(param: any): Observable<any> {
    return this.http.post(AUTH_API + 'v2/register',param);
  }

  
  getByEmail(param: any): Observable<any> {
    return this.http.post(AUTH_API + 'v2/getByEmail',param);
  }
  gmailLogin() {
    return this.afAuth.signInWithPopup(new auth.auth.GoogleAuthProvider());
  }
  facebookLogin() {
    return this.afAuth.signInWithPopup(new auth.auth.FacebookAuthProvider());
  }
  Savesresponse(responce)
      {
        this.url =  'http://localhost:3000/user/auth/facebook';
        return this.http.post(this.url,responce,httpOptions);
      }
   fbLogin() {
    return new Promise((resolve, reject) => {

      FB.login(result => {
        console.log(result)
        if (result.authResponse) {

          return this.http
            .post(`http://localhost:3000/user/auth/facebook`, {access_token: result.authResponse.accessToken})
            .toPromise()
            .then(response => {
              console.log(result)

            const token = response;
            if (token) {
              localStorage.setItem('id_token', JSON.stringify(token));
            }
            resolve(response);
            })
            .catch(() => reject());

        } else {
          reject();
        }
      }, { scope: 'public_profile,email' });
    });
  }

  isLoggedIn() {
    return new Promise((resolve, reject) => {
      this.getCurrentUser().then(user => resolve(true)).catch(() => reject(false));
    });
  }

  getCurrentUser() {
    return new Promise((resolve, reject) => {
      return this.http.get(AUTH_API + `auth/me`).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }

  login(credentials): Observable<any> {
    return this.http.post(AUTH_API + 'login', {
      email: credentials.email,
      password: credentials.password
    }, httpOptions)
  }
  // loginfb(credentials){
  //   return new Promise((resolve, reject) => {
  //     return this.http.get(AUTH_API+'auth/facebook').toPromise().then(response => {
  //       resolve(response);
  //     }).catch(() => reject());
  //   });
  // }
  register(user): Observable<any> {
    return this.http.post(AUTH_API + 'register', {
      email: user.email,
      password: user.password,
      address: user.address,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName
    }, httpOptions)
  }
  logout() {
    this.isAuthorized = false
  }
}
