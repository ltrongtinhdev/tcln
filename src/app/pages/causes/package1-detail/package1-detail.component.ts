import { IPackage1 } from 'src/app/service/package1';
import { NguoituthienService } from '../../../service/nguoituthien.service';
import { ICharity } from '../../../service/nguoituthien';
import { Package1Service } from '../../../service/package1.service';
import { Component, OnInit, Input, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, subscribeOn, switchMap } from 'rxjs/operators'
import { FormBuilder, FormGroup, Validators, NgForm, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { resolve } from 'url';
import * as AOS from 'aos'
import { IComment } from 'src/app/service/comment';
import { TokenStorageService } from 'src/app/token-storage.service';
import { CommentService } from 'src/app/service/comment.service';
import { DonaterService } from 'src/app/service/donater.service';
declare var paypal;
@Component({
  selector: 'app-package1-detail',
  templateUrl: './package1-detail.component.html',
  styleUrls: ['./package1-detail.component.css']
})
export class Package1DetailComponent implements OnInit {
  @Input() package1: IPackage1;
  //Paypal
  //@ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  paidFor = false;
  donate: number;
  p:number=1

  package1List: IPackage1[];
  id: string;
  charity: ICharity;
  charityList: ICharity[];
  commentList:IComment[]=[];
  commentForm:FormGroup;
  errorMessage = '';

  submitted = false;
  isShow = false
  isHide = false

  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  showUserBoard=false
  email: string;

  public const_data: any = {}

  formCharity: FormGroup;
  formPackage1: FormGroup;
  tinhnguyenForm = new FormGroup({
    username: new FormControl('',[Validators.required]),
    sdt: new FormControl('',[Validators.required]),
    hovaten: new FormControl('',[Validators.required]),
    style: new FormControl('',[Validators.required]),
  })
  currentTutorial = null;
  constructor(
    private package1Service: Package1Service,
    private nguoituthienService: NguoituthienService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    public fb: FormBuilder,
    public tokenStorage:TokenStorageService,
    public commentService:CommentService,
    public donaterService: DonaterService


  ) {
    activatedRoute.params.subscribe(params => { this.id = params['id']; });

  }

  ngOnInit() {
    AOS.init()
    if (this.isLoggedIn) {
      const user = this.tokenStorage.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
      this.showUserBoard = this.roles.includes('ROLE_USER');
      this.email = user.email;
    }
    const user = this.tokenStorage.getUser();

    this.getTutorial(this.activatedRoute.snapshot.paramMap.get('id'));
    this.commentService.getByIdPost(this.id).subscribe(ps=>this.commentList=ps);
    this.activatedRoute.queryParamMap.subscribe(
      query=>{
        const orderBy=query.get('orderby');
        console.log(orderBy);
      })
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
  getTransaction() {
    console.log(this.donate)
    this.currentTutorial.donate = this.donate
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
  getTutorial(id) {
    this.package1Service.getById(id)
      .subscribe(
        data => {
          this.currentTutorial = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }
  donateP()
  {

    this.router.navigate(['donate',this.id]);
  }
  DK()
  {
    const user = this.tokenStorage.getUser();
      this.const_data.style="tinhnguyen";
      this.const_data.username = user.email;
      this.const_data.hovaten = this.tinhnguyenForm.value.hovaten;
      this.const_data.sdt = this.tinhnguyenForm.value.sdt;
      this.const_data.idpost = this.id;
      this.donaterService.addDonater(this.const_data).toPromise().then(
        (data: any) => {
          if(data.errors != null)
          {
            this.toastr.error("Đăng ký thất bại !");
            return;
          }
          this.toastr.success('Bạn đã đăng ký thành công, chân thành cảm ơn bạn!')
          this.formCharity.reset()
        }
      );
  }

}
