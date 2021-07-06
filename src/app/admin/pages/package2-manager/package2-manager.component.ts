import { IListPeople } from './../../../service/package2';
import { ReceiveFoodService } from './../../../service/receive-food.service';
import { IPackage2 } from 'src/app/service/package2';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Package2Service } from 'src/app/service/package2.service';
import { TokenStorageService } from 'src/app/token-storage.service';
import { error } from 'jquery';
import * as XLSX from 'xlsx';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DonaterService } from 'src/app/service/donater.service';

@Component({
  selector: 'app-package2-manager',
  templateUrl: './package2-manager.component.html',
  styleUrls: ['./package2-manager.component.scss']
})
export class Package2ManagerComponent implements OnInit {

  @Input() package2: IPackage2
  package2List: IPackage2[] = [];
  IPeople: IListPeople[] = [];
  formReceiveFood:FormGroup;
  _id: string;
  editForm: FormGroup;
  submitted = false;
  data: [][]
  p: number = 1;
  selectedFile: any = null
  filePath: any
  imgSrc: string;
  uploadedFiles: Array < File > ;
  title: any
  danhsach: any[] = [];
  action:string = "";
  titl: string = "";
  constructor(
    private toastr: ToastrService,
    private package2Service: Package2Service,
    private activatedRoute: ActivatedRoute,
    public fb: FormBuilder,
    private router: Router,
    private tokenStorage: TokenStorageService,
    private af: AngularFireStorage,
    private receivefood:ReceiveFoodService,
    private http:HttpClient,
    private reveiveFoodService:ReceiveFoodService,
    private donaterService: DonaterService,

  ) { }

  ngOnInit() {
    this.package2Service.getPackage2List().subscribe(ps => this.package2List = ps);
    // this.activatedRoute.queryParamMap.subscribe(
    //   query => {
    //     const orderBy = query.get('orderby');
    //     console.log(orderBy);
    //   });
    this.formReceiveFood=this.fb.group({
      _id: [''],
      file: ['', Validators.required],
    })
    this.editForm = this.fb.group({
      _id: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      target: ['', Validators.required],
      confirm: [''],
      raised: [0],
      accuracy: ['', Validators.required],
      createDate: [Date.now],
      idUser: [this.tokenStorage.getUser().id, Validators.required],
      restaurant: this.fb.group({
        name: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        address: [''],
      }),
      listPeople: ['', Validators.required]
    })

    // if (this.package2List) {
    //   this.package2List.forEach(user => {
    //       this.addListPeople();
    //   });
    // } else {
    //     this.addListPeople();
    // }
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

  onFileChange(evt: any) {
    this.selectedFile = evt.target.files[0];
    console.log(this.selectedFile)
    var filePath = `${this.selectedFile.name}_${new Date().getTime()}`
    const fileRef = this.af.ref(filePath)
    this.filePath = filePath
    if (evt.target.files && evt.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(evt.target.files[0]);
      this.selectedFile = evt.target.files[0];
      // this.receivefood.addReceivefood(this.selectedFile)

    } else {
      this.selectedFile = null
    }

    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('cannot use multiple files')
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0]
      const ws: XLSX.WorkSheet = wb.Sheets[wsname]
      console.log(ws)
      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }))
      console.log(this.data)
    }
    reader.readAsBinaryString(target.files[0])
  }
  // onFileSelected($event){
  //   this.selectedFile=$event.target.files[0];
  //   console.log(this.selectedFile)
  //   var filePath=`${this.selectedFile.name}_${new Date().getTime()}`
  //   const fileRef=this.af.ref(filePath)
  //   this.filePath=filePath
  //   if($event.target.files && $event.target.files[0]){
  //     const reader=new FileReader();
  //     reader.onload=(e:any)=>this.imgSrc=e.target.result;
  //     reader.readAsDataURL($event.target.files[0]);
  //     this.selectedFile=$event.target.files[0];

  //   }else{
  //     this.selectedFile=null
  //   }
  // }
  onSubmitReceiveFood(){
    this.submitted=true
    if(!this.formReceiveFood.valid){
      return false;

    }else{
      this.receivefood.addReceivefood(this.formReceiveFood.value).subscribe(
        (res)=>{
          this.toastr.success('Tao Thanh Cong!!!')
          this.formReceiveFood.reset()
          //this.ngZone.run(()=>this.router.navigateByUrl('/createCauses'))
        },(error)=>{
          console.log(error)
        });
    }
  }
  uploadImage(formValue) {
    var filePath = `${this.selectedFile.name}_${new Date().getTime()}`
    const fileRef = this.af.ref(filePath)
    this.receivefood.addReceivefood(this.formReceiveFood.value).subscribe(
      (res)=>{
        this.toastr.success('Tao Thanh Cong!!!')
        this.formReceiveFood.reset()
        //this.ngZone.run(()=>this.router.navigateByUrl('/createCauses'))
      },(error)=>{
        console.log(error)
      });
    this.af.upload(filePath, this.selectedFile).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          formValue['listPeople'] = url
        })
      })
    ).subscribe();
  }
  Search() {
    if (this.title == "") {
      return this.ngOnInit()
    } else {
      this.package2List = this.package2List.filter(res => {
        return res.title.toLocaleLowerCase().match(this.title.toLocaleLowerCase())
      })
    }
  }
  key: string = 'title';
  reverse: boolean = false
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse
  }
  onSubmit(formValue) {
    this.submitted = true
    // var filePath = `${this.selectedFile.name}_${new Date().getTime()}`
    // const fileRef = this.af.ref(filePath)
    // this.af.upload(filePath, this.selectedFile).snapshotChanges().pipe(
    //   finalize(() => {
    //     fileRef.getDownloadURL().subscribe((url) => {
    //       formValue['listPeople'] = url
    //     })
    //   })
    // ).subscribe();
    this.receivefood.addReceivefood(this.selectedFile)
    if (this.editForm.invalid) {
      console.log(this.editForm.invalid)
      return false;
    } else {
      this.package2Service.getById(this.package2Service.formPackage2._id)
      this.package2Service.updatePackage2(this.package2._id, this.editForm.value).subscribe(
        (res) => {
          this.toastr.success('Updated Successfully!!!')
          this.package2Service.getPackage2List().subscribe(ps => this.package2List = ps);
          this.editForm.reset()
          //this.ngZone.run(()=>this.router.navigateByUrl('/createCauses'))
        }, (error) => {
          console.log(error)
        });
    }
  }

  onEdit(package2: IPackage2) {
    this.editForm.patchValue({
      _id: package2._id,
      title: package2.title,
      description: package2.description,
      target: package2.target,
      raised: package2.raised,
      confirm: package2.confirm,
      accuracy: package2.accuracy,
      restaurant: {
        name: package2.restaurant.name,
        phoneNumber: package2.restaurant.phoneNumber,
        address: package2.restaurant.address
      },
      listPeople: package2.listPeople
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
  loadDSReceiveFood(id : any, tittle: any)
  {
    this.titl = tittle;
    this.danhsach = [];
    this.action = "Danh Sach Nguoi Nhan Com";
    this.reveiveFoodService.getById(id).subscribe((res: any) => {
      res.forEach(el => {
        if(el.title == this.editForm.controls['title'])
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
