import { async } from '@angular/core/testing';
import { UserService } from './../../service/user.service';
import { AuthServices } from './../../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms"
import {Router } from "@angular/router"
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from '../../token-storage.service';
import { ToastrService } from 'ngx-toastr';
import { FacebookLoginProvider, GoogleLoginProvider, SocialUser,AuthService } from "angular4-social-login";
import { Socialusers } from '../../service/socialusers'
import {FcmPushService} from '../../service/fcm-push.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formModel={
    email:'',
    password:''
  }
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  _user: any;
  message: any;
  public user :any=SocialUser;
  response;
  socialusers=new Socialusers();
  constructor(
    private toastr:ToastrService,
    private userService:UserService,
    private router:Router,
    private tokenStorage: TokenStorageService,
    private authService:AuthService,
    private authServices:AuthServices,
    private http:HttpClient,
    private _fcmPush: FcmPushService
    ) {

    }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
    // this.authService.authState.subscribe((user) => {
    //   this.user = user;
    //   this.isLoggedIn = (user != null);
    //   console.log(this.user);
    //   //this.http.post(`http://localhost:3000/user/auth/facebook`, {access_token: this.user})

    // });
  }
  signInWithGmail():void {
    this.authServices.gmailLogin()
      .then( async(rs: any) => {
        
        const token = await this._fcmPush.getToken()
        const param = {
          email: rs.user.email,
          password: rs.user.uid,
          providerId: 'google.com',
          displayName: rs.user.displayName,
          phoneNumber: rs.user.phoneNumber,
          uid: rs.user.uid,
          token: token
        }
        this.checkMail(param)
        return;
      })
      
      .catch((e) => {
        this.errorMessage = e.error.message;
        this.isLoginFailed = true;
        this.toastr.warning('Login failed!', this.errorMessage)
      })
      .finally( async() => {
        const tk = await this._fcmPush.getToken();
        console.log('tk',tk)
      })
    
  }
  checkMail(param: any) {
    this.authServices.getByEmail(param).subscribe(
      async(data: any) => {
        
        if(data.code === 1) {
            this.login(param);
        } else {
            this.registerSocical(param);
        }
      },
      (err: any) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        this.toastr.warning('Login failed!', this.errorMessage)
      }
    )
  }
  registerSocical(param:any) {
    this.authServices.registerSocical(param)
    .subscribe(
      async(data: any) => {
          
          if(data.code === 1) {
            return this.login(param)
          } else {
            this.isLoginFailed = true;
            this.toastr.warning('Login failed!', this.errorMessage)
            return;
          }
          
      },
      (err: any) => {
        console.log("err++++",err)
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        this.toastr.warning('Login failed!', this.errorMessage)
      }
    )
  }
  login(param: any) {
    this.authServices.login(param)
    .subscribe(
      (data: any) => {
        console.log('data',data)
        if(data.id ) {
          this.tokenStorage.saveToken(data.accessToken);
          this.tokenStorage.saveUser(data);

          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.tokenStorage.getUser().roles;
          this.toastr.success('Login successed.')

          this.reloadPage();
        }
        return this.router.navigate([`/login`]);
      },
      (err: any) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        this.toastr.warning('Login failed!', this.errorMessage)
      }
    )
  }
  signInWithFB(): void {
    this.authServices.facebookLogin()
    .then(async(rs) => {
      const token = await this._fcmPush.getToken()
      const param = {
        email: rs.user.email,
        password: rs.user.uid,
        providerId: 'facebook.com',
        displayName: rs.user.displayName,
        phoneNumber: rs.user.phoneNumber,
        uid: rs.user.uid,
        token
      }
      this.checkMail(param)
      return;
    })
    .catch((e) => {
        this.errorMessage = e.error.message;
        this.isLoginFailed = true;
        this.toastr.warning('Login failed!', this.errorMessage)
    })
    //  this.authServices.fbLogin().then(data => {

    //   this.tokenStorage.saveUser(data);

    //   this.checkLogin();
    //   console.log('User has been logged in');
    //   this.router.navigate(['/login']);
    // });
    // this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(socialusers => {
    //   console.log(socialusers);
    //   this.Savesresponse(socialusers);

    //   console.log(socialusers);
    //   this.tokenStorage.saveToken(socialusers.authToken);
    //   this.tokenStorage.saveUser(socialusers);

    //   this.isLoginFailed = false;
    //   this.isLoggedIn = true;
    //   this.roles = this.tokenStorage.getUser().roles;
    //   this.toastr.success('Login successed.')

    //  this.reloadPage();

    // });


  }
  Savesresponse(socialusers: Socialusers) {

    this.authServices.Savesresponse(socialusers).subscribe((res: any) => {
      debugger;
      console.log(res);
      this.socialusers=res;
      this.response = res.userDetail;
      localStorage.setItem('socialusers', JSON.stringify( this.socialusers));
      console.log(localStorage.setItem('socialusers', JSON.stringify(this.socialusers)));
      this.router.navigate([`/Dashboard`]);
    })
  }
  onSubmit() {
    this.authServices.login(this.form).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.toastr.success('Login successed.')

        this.reloadPage();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        this.toastr.warning('Login failed!', this.errorMessage)

      }
    );
  }
  logout() {
    this.tokenStorage.logout();
    window.location.reload();
  }
  checkLogin(): Promise<boolean> {
    return new Promise((resolve, reject) => {
        this.authServices.isLoggedIn().then(() => {
            resolve(true);
        }).catch(() => {
            this.router.navigate(['/login']);
            reject(false);
        });
    });
}
  reloadPage() {
    window.location.reload();
  }


  // onSubmit(form:NgForm){
  //   this.userService.login(form.value).subscribe(
  //     (res:any)=>{
  //       localStorage.setItem('token',res.token);
  //       this.router.navigateByUrl('/home')
  //     },
  //     err=>{
  //       if(err.status==400){
  //         console.log("success")
  //       }else{
  //         console.log(err)
  //       }
  //     }
  //   )
  // }

}
