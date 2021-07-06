import { TokenStorageService } from 'src/app/token-storage.service';
import { CommentService } from './../../../service/comment.service';
import { IPost } from 'src/app/service/post';
import { PostService } from './../../../service/post.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComment } from 'src/app/service/comment';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit {
  currentPost = null;
  @Input() post:IPost;
  id: string;
  commentList:IComment[]=[];
  commentForm:FormGroup;
  submitted=false;
  errorMessage = '';
  p:number=1


  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  showUserBoard=false
  email: string;

  constructor(
    private postService:PostService,
    private activatedRoute:ActivatedRoute,
    private toastr:ToastrService,
    public fb:FormBuilder,
    public commentService:CommentService,
    public tokenStorage:TokenStorageService


  ) {
    activatedRoute.params.subscribe(params => { this.id = params['id']; });

  }

  ngOnInit() {
    if (this.isLoggedIn) {
      const user = this.tokenStorage.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
      this.showUserBoard = this.roles.includes('ROLE_USER');
      this.email = user.email;
    }
    //hien danh sach comment
    this.commentService.getByIdPost(this.id).subscribe(ps=>this.commentList=ps);
    this.activatedRoute.queryParamMap.subscribe(
      query=>{
        const orderBy=query.get('orderby');
        console.log(orderBy);
      }
    )
    const user = this.tokenStorage.getUser();


    const post=this.getPostId(this.activatedRoute.snapshot.paramMap.get('id'));
      console.log(post)
   // this.currentPost= this.getPostDataId(this.activatedRoute.snapshot.paramMap.get('id'));
    this.commentForm = this.fb.group({
      _id: ['', Validators.required],
      content: ['',Validators.required],
      //createdDate: [Date.now],
      idUser: [this.tokenStorage.getUser().id,Validators.required],
      likes: [0],
      idPost:[ this.id],
      email:[user.email]
      // commentChild:[
      //   this.fb.group({
      //     idUserChild:[this.tokenStorage.getUser().id,Validators.required],
      //     createdDateChild:[Date.now],
      //     contentChild:['',Validators.required],
      //     likesChild:[0],
      //     emailChild:['',]
      //   })
      // ]
    })
  }
  onSubmit() {
    this.commentService.addComment(this.commentForm.value).subscribe(
      data => {
        console.log(data);
        this.submitted=true
        this.toastr.success('New post created!')
        this.commentForm.controls['content'].reset()

        this.commentService.getByIdPost(this.id).subscribe(ps=>this.commentList=ps);

      },
      err => {
        this.errorMessage = err.error.message;

        this.toastr.warning(this.errorMessage,'Sign Up Failed!')

      }
    );
  }
  getPostId(id) {
    this.postService.getById(id)
      .subscribe(
        data => {
          this.currentPost = data;
        },
        error => {
          console.log(error);
        });
  }
  getPostDataId(id) {
    this.postService.getById(id)
      .subscribe(
        data => {
          this.currentPost = data._id;
          //console.log(id)
        },
        error => {
          console.log(error);
        });
  }
}
