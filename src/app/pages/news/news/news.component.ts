import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from './../../../service/post.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TokenStorageService } from '../../../token-storage.service';
import { IPost } from 'src/app/service/post';
import { ActivatedRoute } from '@angular/router';
import * as AOS from 'aos'
import { HttpClient } from '@angular/common/http';
import {AngularFireStorage} from '@angular/fire/storage'
import { finalize } from 'rxjs/operators';

declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  postList:IPost[]=[];
  isSuccessful = false;
  submitted = false;
  errorMessage = '';
  imgSrc:string;
  p:number=1
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  showUserBoard=false
  email: string;
  filePath:any
  selectedFile:any=null
  postForm:FormGroup
  constructor(
    private postService:PostService,
    private toastr:ToastrService,
    private fb:FormBuilder,
    private activatedRoute:ActivatedRoute,
    private tokenStorage: TokenStorageService,
    private af:AngularFireStorage
  ) { }

  ngOnInit() {
    AOS.init()
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if (this.isLoggedIn) {
          const user = this.tokenStorage.getUser();
          this.roles = user.roles;

          this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
          this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
          this.showUserBoard = this.roles.includes('ROLE_USER');

          this.email = user.email;
        }
    this.postService.getPost().subscribe(ps=>this.postList=ps);
    this.activatedRoute.queryParamMap.subscribe(
      query=>{
        const orderBy=query.get('orderby');
        console.log(orderBy);
      }
    )

    this.postForm = this.fb.group({
      _id: ['', Validators.required],
      title: ['',Validators.required],
      description: ['',Validators.required],
      content: ['',Validators.required],
      imageUrl: ['',Validators.required],
      idUser:[this.tokenStorage.getUser().id],
      confirm: ['',Validators.required],
      createdDate: [Date.now],
      email:[this.email],
      likes: [0]
    })
  }
  onFileSelected($event){
    this.selectedFile=$event.target.files[0];
    console.log(this.selectedFile)
    var filePath=`${this.selectedFile.name}_${new Date().getTime()}`
    const fileRef=this.af.ref(filePath)
    this.filePath=filePath
    if($event.target.files && $event.target.files[0]){
      const reader=new FileReader();
      reader.onload=(e:any)=>this.imgSrc=e.target.result;
      reader.readAsDataURL($event.target.files[0]);
      this.selectedFile=$event.target.files[0];

    }else{
      this.selectedFile=null
    }
  }
  newTutorial() {
    this.postForm.reset()
  }
  uploadImage(formValue){
    var filePath=`${this.selectedFile.name}_${new Date().getTime()}`
    const fileRef=this.af.ref(filePath)
    this.af.upload(filePath,this.selectedFile).snapshotChanges().pipe(
      finalize(()=>{
        fileRef.getDownloadURL().subscribe((url)=>{
          formValue['imageUrl']=url
        })
      })
    ).subscribe();
  }
  onSubmit(formValue) {
    var filePath=`${this.selectedFile.name}_${new Date().getTime()}`
        const fileRef=this.af.ref(filePath)
        this.af.upload(filePath,this.selectedFile).snapshotChanges().pipe(
          finalize(()=>{
            fileRef.getDownloadURL().subscribe((url)=>{
              formValue['imageUrl']=url
            })
          })
        ).subscribe();
    this.postService.addPost(this.postForm.value).subscribe(
      data => {

        this.submitted=true
        this.isSuccessful = true;
        this.toastr.success('New post created!')
        this.newTutorial()
      },
      err => {
        this.errorMessage = err.error.message;
        this.toastr.warning(this.errorMessage,'Sign Up Failed!')
      }
    );
  }
}

