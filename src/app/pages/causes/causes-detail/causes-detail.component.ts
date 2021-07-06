import { IPackage1 } from 'src/app/service/package1';
import { ICharity } from './../../../service/nguoituthien';
import { Package1Service } from '../../../service/package1.service';
import { DonaterService } from '../../../service/donater.service';
import { Component, OnInit, Input, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TokenStorageService } from 'src/app/token-storage.service';
import { isNullOrUndefined } from 'util';
import { Socket } from 'ngx-socket-io'
import { emit } from 'process';
import { FcmPushService } from '../../../service/fcm-push.service';
import { AuthServices } from '../../../auth.service'
import { async } from 'rxjs/internal/scheduler/async';
declare var paypal;
@Component({
  selector: 'app-causes-detail',
  templateUrl: './causes-detail.component.html',
  styleUrls: ['./causes-detail.component.css']
})
export class CausesDetailComponent implements OnInit {
  @Input() package1: IPackage1;
  Paypal
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;
  _user: any;
  paidFor = false;
  donate: number;
  idpost: number;
  card: any = {};
  package1List: IPackage1[];
  id: number;
  charity: ICharity;
  listFolowers:string[]=[];

  submitted = false;
  isShow = false
  isHide = false
  user: any = null;

  formCharity: FormGroup;
  formPackage1: FormGroup;
  currentTutorial = null;
  currentURL: String;
  _url: String;
  constructor(
    private package1Service: Package1Service,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public fb: FormBuilder,
    private donaterService: DonaterService,
    private tokenStorageService: TokenStorageService,
    private _fcmPush: FcmPushService,
    private _auth: AuthServices
    // private socket: Socket
  ) { }

  ngOnInit() {
    // this.package1Service.getPackage1List().subscribe(ps => this.package1List = ps);
    // this.activatedRoute.queryParamMap.subscribe(
    //   query => {
    //     const orderBy = query.get('orderby');
    //     console.log(orderBy);
    //   });
    var message:any
    if(window.location.host === 'localhost:4200') {
      this.currentURL = `http://172.0.0.1:4200/donate/${this.activatedRoute.snapshot.paramMap.get('idpost')}` 
      this._url = `https://www.facebook.com/sharer/sharer.php?u=${(this.currentURL)}&amp;src=sdkpreparse`
    } else {
      this.currentURL = window.location.href 
    this._url = `https://www.facebook.com/sharer/sharer.php?u=${(this.currentURL)}&amp;src=sdkpreparse`
    }
    
    this.user = this.tokenStorageService.getUser();
    this.getTutorial(this.activatedRoute.snapshot.paramMap.get('idpost'));
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

            await this.package1Service.addPaypal(this.currentTutorial, this.activatedRoute.snapshot.paramMap.get('idpost'))
              .subscribe(
                async response => {
                  // if ((this.currentTutorial.raised + Number(this.formCharity.controls["donate"].value)) > this.currentTutorial.target) {
                  //   return this.toastr.error("Vượt quá số tiền yêu cầu, không thể khuyên góp");
                  // }
                  // if (isNullOrUndefined(this.user)) {
                  //   this.toastr.error("Vui lòng đăng nhập để có thể sử dụng tính năng này !");
                  // }
                  
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
            console.log('this.currentTutorial',this.currentTutorial)
            const param = {
            title: this.currentTutorial.title,
            name: 'Một nhà hảo tâm'
          }
           this.sendMess(param)
            if ((this.currentTutorial.raised + Number(this.formCharity.controls["donate"].value)) > this.currentTutorial.target) {
                return this.toastr.error("Vượt quá số tiền yêu cầu, không thể khuyên góp");
            }
            if (isNullOrUndefined(this.user)) {
              this.toastr.error("Vui lòng đăng nhập để có thể sử dụng tính năng này !");
            }
            this.currentTutorial.raised += Number(this.formCharity.controls["donate"].value);
            this.formCharity.controls["idpost"].setValue(this.activatedRoute.snapshot.paramMap.get('idpost'));
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
              this.package1Service.updatePackage1(this.currentTutorial._id, this.currentTutorial).subscribe(
                (res) => {
                  this.getTutorial(this.activatedRoute.snapshot.paramMap.get('idpost'));
                }, (error) => {
                  console.log(error)
                });
            }
            // update tiền trong bài post
            else {
              this.currentTutorial.raised += this.formCharity.controls["donate"].value;
              this.package1Service.updatePackage1(this.currentTutorial._id, this.currentTutorial).subscribe(
                (res) => {
                  this.getTutorial(this.activatedRoute.snapshot.paramMap.get('idpost'));
                }, (error) => {
                  console.log(error)
                });
            }
            const order = await actions.order.capture();
            this.paidFor = true;
            

          },
          onError: err => {
            console.log(err);
          }
        })
        .render('#paypal');
  }

  getTutorial(id) {
    console.log(id)
    this.package1Service.getById(id)
      .subscribe(
        async data => {
          this.currentTutorial = data;
          //
          
          
        },
        error => {
          console.log(error);
        },
        () => {
          // const param = {
          //   title: this.currentTutorial.title,
          //   name: 'Một nhà hảo tâm'
          // }
          // this.sendMess(param)
        }
        );
  }
  sendMess(param):any {
    this._fcmPush.sendMessage(param)
      .subscribe(
        (data: any) => {
          console.log('data',data)
        },
        (err) => {
          console.log('err',err)
        }
      );
    
  }
  selectDonate(donate: any) {
    this.formCharity.controls["donate"].setValue(donate);
  }



  validate(date: any) {
    var date_regex = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])$/;
    if (!(date_regex.test(date))) {
      return false;
    }
  }
  async submit(data: any) {   // kiểm tra raise == target thì stop
    console.log(1111111113333)
    if ((this.currentTutorial.raised + Number(this.formCharity.controls["donate"].value)) > this.currentTutorial.target) {
      return this.toastr.error("Vượt quá số tiền yêu cầu, không thể khuyên góp");
    }

    // Validate data here (tự kiểm tra dữ liệu nhập rồi hay chưa, cái đó dễ quá rồi)
    if (isNullOrUndefined(this.user)) {
      this.toastr.error("Vui lòng đăng nhập để có thể sử dụng tính năng này !");
    }
    // Validate Ngày hết hạn của thẻ
    if (this.validate(data.controls.expireDate.value) == false || data.controls.expireDate.value == "30/02" || data.controls.expireDate.value == "31/02") {
      // hiển thị dialog thông báo hay làm kiểu gì đó để cho ngta biết là ngày k hợp lệ ở đây
      // TODO ... //
      return;
    }
    // thêm thông tin donate
    this.currentTutorial.raised += Number(this.formCharity.controls["donate"].value);
    this.formCharity.controls["idpost"].setValue(this.activatedRoute.snapshot.paramMap.get('idpost'));
    this.formCharity.controls["username"].setValue(this.user.email);
    this.formCharity.controls["style"].setValue("donate");

    await this.donaterService.addDonater(this.formCharity.value).toPromise().then(
      async(data: any) => {
        console.log(11111111122)
        if (data.errors != null) {
          
          

          this.toastr.error("Donate thất bại !");
          return;
        }
        
        this.toastr.success('Bạn đã donate thành công, chân thành cảm ơn bạn!')
        
        
        this.formCharity.reset()
        
      }
    );
    if ((this.currentTutorial.raised + Number(this.formCharity.controls["donate"].value)) == this.currentTutorial.target) {
      this.currentTutorial.confirm = 'da xoa';
      this.currentTutorial.raised += this.formCharity.controls["donate"].value;
      this.package1Service.updatePackage1(this.currentTutorial._id, this.currentTutorial).subscribe(
        (res) => {
          this.getTutorial(this.activatedRoute.snapshot.paramMap.get('idpost'));
        }, (error) => {
          console.log(error)
        });
    }
    // update tiền trong bài post
    else {
      console.log(111111111)

      this.currentTutorial.raised += this.formCharity.controls["donate"].value;
      this.package1Service.updatePackage1(this.currentTutorial._id, this.currentTutorial).subscribe(
        (res) => {
          this.getTutorial(this.activatedRoute.snapshot.paramMap.get('idpost'));
        }, (error) => {
          console.log(error)
        });
    }
  }

}
