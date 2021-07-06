import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {IUser} from '../service/users';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { IPost } from './post';
import { AuthService, FacebookLoginProvider, SocialUser } from 'angular4-social-login';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const API_URL = 'http://localhost:3000/user';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  userForm:IUser
  user=IUser;
  constructor(
    private http:HttpClient,
  ) { }
  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'user', { responseType: 'text' });
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(API_URL + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'admin', { responseType: 'text' });
  }

  getAllUser():Observable<IUser[]>{
    return this.http.get<IUser[]>(API_URL).pipe(
      tap(received=> console.log(`receivedUser=${JSON.stringify(received)}`)),
      catchError(error=>of([]))
      )
  }
  updateUser(id,post:IPost):Observable<any>{
    console.log(id)
    const url=`${API_URL}/${id}`;
    return this.http.put(url,post).pipe(
      tap(selectedPost=>console.log(`updatePost id=${JSON.stringify(selectedPost)}`)),
      catchError(error=>of(new IPost()))
    );
  }

  // login(formData){
  //   return this.http.post(this.userURL+'/login',formData)
  // }
  // getUserProfile(){
  //   var tokenHeader=new HttpHeaders({'Authorization':'Bearer'+localStorage.getItem('token')})
  //   return this.http.get(this.userURL+'/userProfile',{headers:tokenHeader});
  // }

  // register(){
  //   var body={
  //     userName:this.formModel.value.userName,
  //     email:this.formModel.value.email,
  //     password:this.formModel.value.passwords.password,
  //     fullName:this.formModel.value.fullName,
  //     phoneNumber:this.formModel.value.phoneNumber
  //   };
  //     return this.http.post(this.userURL,body)
  // }

  // login(formData){
  //   return this.http.post
  // }
}
