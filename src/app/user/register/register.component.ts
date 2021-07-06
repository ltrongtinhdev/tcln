import { element } from 'protractor';
import { UserService } from './../../service/user.service';
import { Component, OnInit } from '@angular/core';
//import { _switch } from 'rxjs-compat/operator/switch';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthServices } from 'src/app/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  constructor(
    private toastr:ToastrService,
    public userService:UserService,
    private fb:FormBuilder,
    private authService: AuthServices
    )
    { }

  ngOnInit() {


  }
  comparePasswords(fb:FormGroup){
    let confirmPswrdCtrl=fb.get('confirmPassword');
    //passwordMismatch
    //confirmPswrdCtrl.errors={passwordMismatch:true}
    if(confirmPswrdCtrl.errors==null||'passwordMismatch' in confirmPswrdCtrl.errors){
      if(fb.get('password').value!=confirmPswrdCtrl.value)
      confirmPswrdCtrl.setErrors({passwordMismatch:true});
      else
      confirmPswrdCtrl.setErrors(null);
    }
  }
  onSubmit() {
    this.authService.register(this.form).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.toastr.success('New user created!', 'Registration successed.')
        this.isSignUpFailed = false;
      },
      err => {
        this.errorMessage = err.error.message;

        this.isSignUpFailed = true;
        this.toastr.warning(this.errorMessage,'Sign Up Failed!')

      }
    );
  }


}
