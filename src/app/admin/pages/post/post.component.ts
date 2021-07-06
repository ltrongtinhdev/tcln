import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IPost } from 'src/app/service/post';
import { PostService } from 'src/app/service/post.service';
import { TokenStorageService } from 'src/app/token-storage.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  postList:IPost[]=[];
  p:number=1
  @Input() post:IPost

  submitted=false

  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  showUserBoard=false
  email: string;
  postForm:FormGroup
  editForm:FormGroup
  constructor(
    private postService:PostService,
    private toastr:ToastrService,
    private fb:FormBuilder,
    private activatedRoute:ActivatedRoute,
    private tokenStorage: TokenStorageService
  ) { }

  ngOnInit() {
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

    this.editForm = this.fb.group({
      _id: ['', Validators.required],
      title: ['',Validators.required],
      description: ['',Validators.required],
      content: ['',Validators.required],
      imageUrl: ['',Validators.required],
      idUser:[this.tokenStorage.getUser().id,Validators.required],
      confirm: ['',Validators.required],
      email: ['',Validators.required],

      createdDate: [Date.now],
      likes: [0]
    })
  }
  onSubmit(){
    this.submitted=true
    if(this.editForm.valid){
      return false;
    }else{
      const _id=this.postService.formPost._id
      this.postService.updatePost(_id,this.editForm.value).subscribe(
        (res)=>{
          this.toastr.success('Updated Successfully!!!')
          this.postService.getPost().subscribe(ps => this.postList = ps);
          this.editForm.reset()
          //this.ngZone.run(()=>this.router.navigateByUrl('/createCauses'))
        },(error)=>{
          console.log(error)
        });

    }
  }
  onEdit(post:IPost){
    this.postService.formPost=post;
    this.postService.getById(this.postService.formPost._id).subscribe((data:IPost)=>{
      this.post=data;
      if (this.post !== undefined) {
        this.postService.getById(this.postService.formPost._id).subscribe(data => {
          this.post = data;

          if (this.postService.formPost!=null && this.post!=null) {
            //this.editForm.controls['_id'].setValue(this.package1._id);
            this.editForm.controls['title'].setValue(this.post.title);
            this.editForm.controls['description'].setValue(this.post.description);
            this.editForm.controls['email'].setValue(this.post.email);
            this.editForm.controls['createdDate'].setValue(this.post.createdDate);
            this.editForm.controls['confirm'].setValue(this.post.confirm);
            this.editForm.controls['imageUrl'].setValue(this.post.imageUrl);
            this.editForm.controls['likes'].setValue(this.post.likes);
            this.editForm.controls['content'].setValue(this.post.content);

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

}
