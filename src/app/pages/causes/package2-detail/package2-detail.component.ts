import { IPackage2 } from 'src/app/service/package2';
import { NguoituthienService } from '../../../service/nguoituthien.service';
import { ICharity } from '../../../service/nguoituthien';
import { Package2Service } from '../../../service/package2.service';
import { Component, OnInit, Input, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as AOS from 'aos'
import { IComment } from 'src/app/service/comment';
import { CommentService } from 'src/app/service/comment.service';
import { TokenStorageService } from 'src/app/token-storage.service';
import { DonaterService } from 'src/app/service/donater.service';
import { isNullOrUndefined } from 'util';
declare var paypal;
@Component({
  selector: 'app-package2-detail',
  templateUrl: './package2-detail.component.html',
  styleUrls: ['./package2-detail.component.scss']
})
export class Package2DetailComponent implements OnInit {
  @Input() package2: IPackage2;
  Paypal
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;
  paidFor = false;

  commentList:IComment[]=[];
  commentForm:FormGroup;
  donate: number;
  errorMessage = '';
  p:number=1
  user: any = null;

  package2List: IPackage2[];
  id: number;
  charity: ICharity;
  charityList: ICharity[];

  submitted = false;
  isShow = false
  isHide = false

  formCharity: FormGroup;
  formPackage2: FormGroup;
  tinhnguyenForm = new FormGroup({
    username: new FormControl('',[Validators.required]),
    sdt: new FormControl('',[Validators.required]),
    hovaten: new FormControl('',[Validators.required]),
    style: new FormControl('',[Validators.required]),
  })
  currentTutorial = null;

  _id: string;
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  showUserBoard=false
  email: string;
  public const_data: any = {}
  constructor(
    private package2Service: Package2Service,
    private nguoituthienService: NguoituthienService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    public fb: FormBuilder,
    public commentService:CommentService,
    public tokenStorage:TokenStorageService,
    public donaterService: DonaterService

  ) {
    activatedRoute.params.subscribe(params => { this._id = params['_id']; });

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
    this.user = this.tokenStorage.getUser();

    AOS.init()
    this.getTutorial(this.activatedRoute.snapshot.paramMap.get('id'));

      this.commentForm = this.fb.group({
        _id: ['', Validators.required],
        content: ['',Validators.required],
        createdDate: [Date.now],
        idUser: [this.tokenStorage.getUser().id,Validators.required],
        likes: [0],
        idPost:[ this.id],
        email:[this.user.email]
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
      this.formCharity = this.fb.group({
        username: this.fb.control(''),
        card: this.fb.control('', [Validators.required]),
        cardNumber: this.fb.control('', [Validators.required, Validators.minLength(19)]),
        cardHolderName: this.fb.control('', [Validators.required]),
        expireDate: this.fb.control('', [Validators.required, Validators.minLength(5)]),
        securityCode: this.fb.control('', [Validators.required, Validators.minLength(3)]),
        donate: this.fb.control('', [Validators.required]),
        idpost: this.fb.control(''),
        style: this.fb.control('')
      }),
      paypal
        .Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'pill',
            label: 'paypal'
          },
          createOrder: async (data, actions) => {

            await this.package2Service.addPaypal(this.currentTutorial, this.activatedRoute.snapshot.paramMap.get('id'))
              .subscribe(
                async response => {
                  // if ((this.currentTutorial.raised + Number(this.formCharity.controls["donate"].value)) > this.currentTutorial.target) {
                  //   return this.toastr.error("Vượt quá số tiền yêu cầu, không thể khuyên góp");
                  // }
                  // if (isNullOrUndefined(this.user)) {
                  //   this.toastr.error("Vui lòng đăng nhập để có thể sử dụng tính năng này !");
                  // }
                  console.log(response);
                },
                error => {
                  console.log(error);
                });
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: 'USD',
                    value: Number(this.formCharity.controls["donate"].value)
                  }
                }
              ]
            });
          },

          onApprove: async (data, actions) => {
            if ((this.currentTutorial.raised + Number(this.formCharity.controls["donate"].value)) > this.currentTutorial.target) {
                return this.toastr.error("Vượt quá số tiền yêu cầu, không thể khuyên góp");
            }
            if (isNullOrUndefined(this.user)) {
              this.toastr.error("Vui lòng đăng nhập để có thể sử dụng tính năng này !");
            }
            this.currentTutorial.raised += Number(this.formCharity.controls["donate"].value);
            this.formCharity.controls["idpost"].setValue(this.activatedRoute.snapshot.paramMap.get('id'));
            this.formCharity.controls["username"].setValue(this.user.email);
            this.formCharity.controls["style"].setValue("donate");

            await this.donaterService.addDonater(this.formCharity.value).toPromise().then(
              (data: any) => {
                if (data.errors != null) {
                  this.toastr.error("Donate thất bại !");
                  return;
                }
                // this.socket.emit("client-send-data",{
                // message:this.tokenStorageService.getUser().email+"da donate"+" "+ Number(this.formCharity.controls["donate"].value)+"$",
                // id:this.activatedRoute.snapshot.paramMap.get('idpost')})

                this.toastr.success('Bạn đã donate thành công, chân thành cảm ơn bạn!')
                this.formCharity.reset()
              }
            );
            if ((this.currentTutorial.raised + Number(this.formCharity.controls["donate"].value)) == this.currentTutorial.target) {
              this.currentTutorial.confirm = 'da xoa';
              this.currentTutorial.raised += this.formCharity.controls["donate"].value;
              this.package2Service.updatePackage2(this.currentTutorial._id, this.currentTutorial).subscribe(
                (res) => {
                  this.getTutorial(this.activatedRoute.snapshot.paramMap.get('idpost'));
                }, (error) => {
                  console.log(error)
                });
            }
            // update tiền trong bài post
            else {
              this.currentTutorial.raised += this.formCharity.controls["donate"].value;
              this.package2Service.updatePackage2(this.currentTutorial._id, this.currentTutorial).subscribe(
                (res) => {
                  this.getTutorial(this.activatedRoute.snapshot.paramMap.get('id'));
                }, (error) => {
                  console.log(error)
                });
            }
            const order = await actions.order.capture();
            this.paidFor = true;
            console.log(order);

          },
          onError: err => {
            console.log(err);
          }
        })
        .render('#paypal');
  }
  getTransaction() {
    console.log(this.donate)
    this.currentTutorial.donate = this.donate
  }
  selectDonate(donate: any) {
    this.formCharity.controls["donate"].setValue(donate);
  }

  onSubmitComment() {
    this.commentService.addComment(this.commentForm.value).subscribe(
      data => {
        console.log(data);
        this.submitted=true
        this.toastr.success('New post created!')
        this.commentForm.controls['content'].reset()

        this.commentService.getByIdPost(this._id).subscribe(ps=>this.commentList=ps);

      },
      err => {
        this.errorMessage = err.error.message;

        this.toastr.warning(this.errorMessage,'Sign Up Failed!')

      }
    );
  }
  getTutorial(id) {
    this.package2Service.getById(id)
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
