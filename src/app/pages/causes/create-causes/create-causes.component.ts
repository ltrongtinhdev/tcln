import { Package2Service } from './../../../service/package2.service';
import { Package1Service } from 'src/app/service/package1.service';
import { Component, Input, NgZone, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IPackage1 } from 'src/app/service/package1';
import { ToastrService } from 'ngx-toastr';
import { IPackage2 } from 'src/app/service/package2';
import { TokenStorageService } from 'src/app/token-storage.service';
import { HttpClient } from '@angular/common/http';
declare var paypal;

@Component({
  selector: 'app-create-causes',
  templateUrl: './create-causes.component.html',
  styleUrls: ['./create-causes.component.css']
})
export class CreateCausesComponent implements OnInit {
  @Input() package1:IPackage1

  package1List:IPackage1[];
  package2List:IPackage2[];

  edit=false;
  submitted=false;
  formPackage1:FormGroup;
  formPackage2:FormGroup;
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  showUserBoard=false;
  private roles: string[];
  uploadedFiles: Array < File > ;

  constructor(
    private toastr:ToastrService,
    private package1Service:Package1Service,
    private package2Service:Package2Service,
    private activatedRoute:ActivatedRoute,
    public fb:FormBuilder,
    private router:Router,
    private tokenStorage: TokenStorageService,
    private http:HttpClient


  ) { }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if (this.isLoggedIn) {
          const user = this.tokenStorage.getUser();
          this.roles = user.roles;

          this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
          this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
          this.showUserBoard = this.roles.includes('ROLE_USER');

        }


    this.formPackage1=this.fb.group({
      title:['',Validators.required],
      description:[''],
      target:['',Validators.required],
      idUser:[this.tokenStorage.getUser().id],
      confirm:['chua xac thuc'],
      raised:[0],
      createDate:[Date.now],

      expirationDate:[''],
      accuracy:this.fb.control('',[Validators.required]),
      person:this.fb.group({
        firstName:this.fb.control('',[Validators.required]),
        lastName:this.fb.control('',[Validators.required]),
        gender:this.fb.control('',[Validators.required]),
        dob:this.fb.control(''),
        address:this.fb.control(''),
        avatarUrl:this.fb.control('')
      })
    })
    this.package1Service.getByUser().subscribe(ps => this.package1List = ps);

    this.package2Service.getPackage2List().subscribe(ps => this.package2List = ps);
    this.formPackage2=this.fb.group({
      title:this.fb.control('',[Validators.required]),
      description:this.fb.control(''),
      target:this.fb.control('',[Validators.required]),
      confirm:[''],
      raised:[0],
      accuracy:this.fb.control('',[Validators.required]),
      createBy:this.fb.control(''),
      createDate:this.fb.control(''),
      restaurant:this.fb.group({
        name:this.fb.control('',[Validators.required]),
        phoneNumber:this.fb.control('',[Validators.required]),
        address:this.fb.control(''),
      }),
      listPeople:this.fb.array([
        this.fb.group({
          name:this.fb.control('',[Validators.required]),
          dob:this.fb.control('',[Validators.required]),
          gender:this.fb.control('',[Validators.required]),
          phoneNumber:this.fb.control('',[Validators.required]),
          email:this.fb.control(''),
          address:this.fb.control(''),
        })
      ])
    })
  }

  onSubmit(){
    this.submitted=true
    if(!this.formPackage1.valid){
      return false;

    }else{
      this.package1Service.addPackage1(this.formPackage1.value).subscribe(
        (res)=>{
          this.toastr.success('Tao Thanh Cong!!!')
          this.formPackage1.reset()
          //this.ngZone.run(()=>this.router.navigateByUrl('/createCauses'))
        },(error)=>{
          console.log(error)
        });
    }
  }
  onSubmit2(){
    this.submitted=true
    if(!this.formPackage2.valid){
      console.error();
      return false;
    }else{
      this.package2Service.addPackage2(this.formPackage2.value).subscribe(
        (res)=>{
          this.toastr.success('Created Successfully!!!')
          this.formPackage2.reset()
          //this.ngZone.run(()=>this.router.navigateByUrl('/createCauses'))
        },(error)=>{
          console.log(error)
        });
    }
  }
  fileChange(element) {
    this.uploadedFiles = element.target.files;
    // console.log(this.uploadedFiles)
}
upload() {
  let formData = new FormData();
  for (var i = 0; i < this.uploadedFiles.length; i++) {
      formData.append("file", this.uploadedFiles[i], this.uploadedFiles[i].name);

  }
 // console.log(formData)
  this.http.post('http://localhost:3000/receivefood', formData)
      .subscribe((response) => {
          console.log('response received is ', response);
      })
}
  listPeople():FormArray{
    return this.formPackage2.get('listPeople') as FormArray;
  }
  newListPeople(): FormGroup {
    return this.fb.group({
      name:this.fb.control('',[Validators.required]),
      dob:this.fb.control('',[Validators.required]),
      gender:this.fb.control('',[Validators.required]),
      phoneNumber:this.fb.control('',[Validators.required]),
      email:this.fb.control(''),
      address:this.fb.control(''),
    })
  }
  addListPeople(){
    const control = new FormControl('', Validators.required);
    this.listPeople().push(this.newListPeople());
  }
  removeListPeople(index:number){
    this.listPeople().removeAt(index)
  }
  resetForm(){
    this.formPackage1=this.fb.group({
      title:['',Validators.required],
      description:[''],
      target:['',Validators.required],
      idUser:[this.tokenStorage.getUser().id],
      confirm:['chua xac thuc'],
      raised:[0],
      expirationDate:[''],
      accuracy:this.fb.control('',[Validators.required]),
      person:this.fb.group({
        firstName:this.fb.control('',[Validators.required]),
        lastName:this.fb.control('',[Validators.required]),
        gender:this.fb.control('',[Validators.required]),
        dob:this.fb.control(''),
        address:this.fb.control(''),
        avatarUrl:this.fb.control('')
      })
    })
   }
   onEdit(package1:IPackage1){
    this.edit=true;
    this.package1Service.formPackage1=package1;
    this.package1Service.getById(this.package1Service.formPackage1._id).subscribe((data:IPackage1)=>{
      this.package1=data;
      if (this.package1 !== undefined) {
        this.package1Service.getById(this.package1Service.formPackage1._id).subscribe(data => {
          this.package1 = data;

          if (this.package1Service.formPackage1!=null && this.package1!=null) {
            //this.editForm.controls['_id'].setValue(this.package1._id);
            this.formPackage1.controls['title'].setValue(this.package1.title);
            this.formPackage1.controls['description'].setValue(this.package1.description);
            this.formPackage1.controls['target'].setValue(this.package1.target);
            this.formPackage1.controls['raised'].setValue(this.package1.raised);
            this.formPackage1.controls['confirm'].setValue(this.package1.confirm);
            this.formPackage1.controls['person'].setValue(this.package1.person);
            // this.editForm.controls['lastName'].setValue(this.package1.person.lastName);
            // this.editForm.controls['dob'].setValue(this.package1.person.dob);
            // this.editForm.controls['address'].setValue(this.package1.person.address);
            // this.editForm.controls['avatarUrl'].setValue(this.package1.person.avatarUrl);
          }
        }, error => { console.log("Error while gettig post details") });
      }
    })
  }
}
