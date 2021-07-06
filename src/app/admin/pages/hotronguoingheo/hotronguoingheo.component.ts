import { Package1Service } from '../../../service/package1.service';
import { Component, Input, OnInit } from '@angular/core';
import { IPackage1 } from 'src/app/service/package1';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { data } from 'jquery';
import { DonaterService } from 'src/app/service/donater.service';

@Component({
  selector: 'app-hotronguoingheo',
  templateUrl: './hotronguoingheo.component.html',
  styleUrls: ['./hotronguoingheo.component.css']
})
export class HotronguoingheoComponent implements OnInit {
  @Input() package1:IPackage1
  package1List: IPackage1[]=[];
  _id:number;
  editForm:FormGroup;
  submitted=false;
  p:number=1;
  firstName:any
  currentPackage1=null;
  danhsach: any[] = [];
  action:string = "";
  titl: string = "";
  constructor(
    private toastr: ToastrService,
    private package1Service: Package1Service,
    private activatedRoute: ActivatedRoute,
    private donaterService: DonaterService,
    public fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.package1Service.getPackage1List().subscribe(ps => this.package1List = ps);


    //this.getTutorial(this.activatedRoute.snapshot.paramMap.get('id'));

    //let Id = window.localStorage.getItem("editCauseId");
    this.editForm=this.fb.group({
      _id:['',Validators.required],
      title:['',Validators.required],
      description:['',Validators.required],
      target:['',Validators.required],
      confirm:[''],
      raised:[''],
      accuracy:['',Validators.required],
      person:this.fb.group({
        firstName:['',Validators.required],
        lastName:['',Validators.required],
        gender:['',Validators.required],
        dob:['',Validators.required],
        address:['',Validators.required],
        avatarUrl:['',Validators.required]
      })
    })

  }

  Search(){
    if(this.firstName==""){
      return this.ngOnInit()
    }else{
      this.package1List=this.package1List.filter(res=>{
        return res.person.firstName.toLocaleLowerCase().match(this.firstName.toLocaleLowerCase())
      })
    }
  }

  key:string='title';
  reverse:boolean=false
  sort(key){
    this.key=key;
    this.reverse=!this.reverse
  }
  getTutorial(id) {
    this.package1Service.getById(id)
      .subscribe(
        data => {
          this.currentPackage1 = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  onSubmit(){
    this.submitted=true
    if(this.editForm.valid){
      return false;
    }else{
      const _id=this.package1Service.formPackage1._id
      this.package1Service.updatePackage1(_id,this.editForm.value).subscribe(
        (res)=>{
          this.toastr.success('Updated Successfully!!!')
          this.package1Service.getPackage1List().subscribe(ps => this.package1List = ps);
          this.editForm.reset()
          //this.ngZone.run(()=>this.router.navigateByUrl('/createCauses'))
        },(error)=>{
          console.log(error)
        });

    }
  }


  onEdit(package1:IPackage1){
    this.package1Service.formPackage1=package1;
    this.package1Service.getById(this.package1Service.formPackage1._id).subscribe((data:IPackage1)=>{
      this.package1=data;
      if (this.package1 !== undefined) {
        this.package1Service.getById(this.package1Service.formPackage1._id).subscribe(data => {
          this.package1 = data;

          if (this.package1Service.formPackage1!=null && this.package1!=null) {
            //this.editForm.controls['_id'].setValue(this.package1._id);
            this.editForm.controls['title'].setValue(this.package1.title);
            this.editForm.controls['description'].setValue(this.package1.description);
            this.editForm.controls['target'].setValue(this.package1.target);
            this.editForm.controls['raised'].setValue(this.package1.raised);
            this.editForm.controls['confirm'].setValue(this.package1.confirm);
            this.editForm.controls['accuracy'].setValue(this.package1.accuracy);
            this.editForm.controls['person'].setValue(this.package1.person);
            // this.editForm.controls['firstName'].setValue(this.package1.person.firstName);
            // this.editForm.controls['lastName'].setValue(this.package1.person.lastName);
            // this.editForm.controls['dob'].setValue(this.package1.person.dob);
            // this.editForm.controls['address'].setValue(this.package1.person.address);
            // this.editForm.controls['avatarUrl'].setValue(this.package1.person.avatarUrl);
          }
        }, error => { console.log("Error while gettig post details") });
      }
    })
  }
  loadDSTN(id : any, tittle: any)
  {
    this.titl = tittle;
    this.danhsach = [];
    this.action = " người tình nguyện";
    this.donaterService.getByIdPost(id).subscribe((res: any) => {
      res.forEach(el => {
        if(el.style != "donate")
        {
          this.danhsach.push(el);
        }
      });
    }, err => {
      this.toastr.error("Lỗi")
    })
  }
  loadDSDN(id : any, tittle: any)
  {
    this.titl = tittle;
    this.action = " người quyên góp tiền";
    this.danhsach = [];
    this.donaterService.getByIdPost(id).subscribe((res: any) => {
      res.forEach(el => {
        if(el.style == "donate")
        {
          this.danhsach.push(el);
        }
      });
    }, err => {
      this.toastr.error("Lỗi")
    })
  }
}
