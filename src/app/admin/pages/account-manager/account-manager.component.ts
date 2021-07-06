import { UserService } from './../../../service/user.service';
import { IUser } from './../../../service/users';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account-manager',
  templateUrl: './account-manager.component.html',
  styleUrls: ['./account-manager.component.scss']
})
export class AccountManagerComponent implements OnInit {
  @Input() account:IUser;
  userList: IUser[]=[];
  _id:number;
  editForm:FormGroup;
  submitted=false;
  p:number=1;
  constructor(
    private toastr: ToastrService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    public fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.userService.getAllUser().subscribe(ps=>this.userList=ps);

    this.editForm=this.fb.group({
      _id:['',Validators.required],
      email:['',Validators.required],
      password:['',Validators.required],
      fullName:['',Validators.required],
      phoneNumber:['',Validators.required],
      address:['',Validators.required],
      roles:[]
    })
  }
  onSubmit(){
    this.submitted=true
    if(this.editForm.valid){
      return false;
    }else{
      const _id=this.userService.userForm._id
      this.userService.updateUser(_id,this.editForm.value).subscribe(
        (res)=>{
          this.toastr.success('Updated Successfully!!!')
          this.userService.getAllUser().subscribe(ps => this.userList = ps);
          this.editForm.reset()
          //this.ngZone.run(()=>this.router.navigateByUrl('/createCauses'))
        },(error)=>{
          console.log(error)
        });

    }
  }

}
