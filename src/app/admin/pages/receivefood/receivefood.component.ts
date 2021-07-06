import { emit } from 'process';
import { IReceiveFood } from './../../../service/receivefood';
import { ReceiveFoodService } from './../../../service/receive-food.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-receivefood',
  templateUrl: './receivefood.component.html',
  styleUrls: ['./receivefood.component.scss']
})
export class ReceivefoodComponent implements OnInit {
  receieveList: IReceiveFood[] = [];
  @Input() receieve: IReceiveFood

  submitted = false
  editForm: FormGroup
  receieveFoodForm: FormGroup
  p: number = 1
  loading = false;
  buttionText = "Submit";

  constructor(
    private recieveFoodService: ReceiveFoodService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient

  ) { }

  ngOnInit() {
    this.recieveFoodService.getReceieve().subscribe(ps => this.receieveList = ps);
    this.activatedRoute.queryParamMap.subscribe(
      query => {
        const orderBy = query.get('orderby');
        console.log(orderBy);
      }
    )
    this.editForm = this.fb.group({
      _id: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: [''],
      createdDate: [''],

    })
  }
  registerAll(receive: IReceiveFood) {
    this.recieveFoodService.getReceieve().subscribe(ps => this.receieveList = ps);
    this.receieveList.forEach(element => {

      this.http.post("http://localhost:3000/receivefood/sendmail", element).subscribe(
        data => {
          let res: any = data;
          console.log(
            `👏 > 👏 > 👏 > 👏 ${element.name} is successfully register and mail has been sent and the message id is ${res.messageId}`
          );
          this.toastr.success(`Đã gửi Mail cho ${element.name}!!!`)

        },
        err => {
          console.log(err);
          this.loading = false;
          this.buttionText = "Submit";
        }, () => {
          this.loading = false;
          this.buttionText = "Submit";
        }
      );
    });

  }
  register(receieve: IReceiveFood) {
    this.loading = true;
    this.buttionText = "Submiting...";

    this.recieveFoodService.formReceieveFood = receieve;
    this.recieveFoodService.getById(this.recieveFoodService.formReceieveFood._id).subscribe((data: IReceiveFood) => {
      this.receieve = data;
      if (this.receieve !== undefined) {
        this.recieveFoodService.getById(this.recieveFoodService.formReceieveFood._id).subscribe(data => {
          this.receieve = data;

          if (this.recieveFoodService.formReceieveFood != null && this.receieve != null) {
            let user = {
              name: this.receieve.name,
              email: this.receieve.email,
              restaurant: this.receieve.restaurant
            }
            console.log(this.receieve.name)
            this.http.post("http://localhost:3000/receivefood/sendmail", user).subscribe(
              data => {
                let res: any = data;
                console.log(
                  `👏 > 👏 > 👏 > 👏 ${user.name} is successfully register and mail has been sent and the message id is ${res.messageId}`
                );
                this.toastr.success(`Đã gửi Mail cho ${user.name}!!!`)

              },
              err => {
                console.log(err);
                this.loading = false;
                this.buttionText = "Submit";
              }, () => {
                this.loading = false;
                this.buttionText = "Submit";
              }
            );

          }
        }, error => { console.log("Error while gettig post details") });
      }
    })


  }

  onSubmit() {
    this.submitted = true
    if (this.editForm.valid) {
      return false;
    } else {
      const _id = this.recieveFoodService.formReceieveFood._id
      this.recieveFoodService.updateRecieveFood(_id, this.editForm.value).subscribe(
        (res) => {
          this.toastr.success('Updated Successfully!!!')
          this.recieveFoodService.getReceieve().subscribe(ps => this.receieveList = ps);
          this.editForm.reset()
          //this.ngZone.run(()=>this.router.navigateByUrl('/createCauses'))
        }, (error) => {
          console.log(error)
        });

    }
  }
  onEdit(receieve: IReceiveFood) {
    this.recieveFoodService.formReceieveFood = receieve;
    this.recieveFoodService.getById(this.recieveFoodService.formReceieveFood._id).subscribe((data: IReceiveFood) => {
      this.receieve = data;
      if (this.receieve !== undefined) {
        this.recieveFoodService.getById(this.recieveFoodService.formReceieveFood._id).subscribe(data => {
          this.receieve = data;

          if (this.recieveFoodService.formReceieveFood != null && this.receieve != null) {
            //this.editForm.controls['_id'].setValue(this.package1._id);
            this.editForm.controls['name'].setValue(this.receieve.name);
            this.editForm.controls['email'].setValue(this.receieve.email);
            this.editForm.controls['phoneNumber'].setValue(this.receieve.phoneNumber);
            this.editForm.controls['createdDate'].setValue(this.receieve.createdDate);

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
