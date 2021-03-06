import { Package1Service } from "../../../service/package1.service";
import {
  Component,
  NgZone,
  OnInit,
  AfterContentInit,
  AfterViewInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IPackage1 } from "../../../service/package1";
import { query } from "@angular/animations";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Package2Service } from "src/app/service/package2.service";
import { IPackage2 } from "src/app/service/package2";
import * as AOS from "aos";
import { ToastrService } from "ngx-toastr";
import { TokenStorageService } from "src/app/token-storage.service";
import { Input } from "@angular/core";
import { isNullOrUndefined } from "util";

@Component({
  selector: "app-causes",
  templateUrl: "./causes.component.html",
  styleUrls: ["./causes.component.css"],
})
export class CausesComponent implements OnInit {
  package1List: IPackage1[] = [];
  package2List: IPackage2[] = [];
  @Input() package1: IPackage1;

  public isShow: boolean = false;
  public goi: String = "Person";
  submitted = false;
  package1Form: FormGroup;
  package2Form: FormGroup;

  currentData = null;
  p: number = 1;
  title: any;
  width: any;
  exDate: any;
  user: any = null;

  constructor(
    private package1Service: Package1Service,
    private package2Service: Package2Service,
    private toastr: ToastrService,
    private tokenStorageService: TokenStorageService,

    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = this.tokenStorageService.getUser();

    AOS.init();
    this.package1Service.getByConfirm().subscribe((data) => {
      this.package1List = data;
      this.package1List.forEach((element) => {
        element.expirationDate = this.donghodemnguocEx(element.expirationDate);
        // console.log(element.expirationDate)
      });
    });
    // this.donghodemnguoc(Date.parse(document.getElementById("demo1").innerHTML))
    this.package2Service
      .getByConfirm()
      .subscribe((ps) => (this.package2List = ps));
  }

  donghodemnguoc(date: any) {
    var countDownDate = new Date(date).getTime();
    var x = setInterval(function () {
      // L???y th???i gian hi???n t???i
      var now = new Date().getTime();

      // L???y s??? th???i gian ch??nh l???ch
      var distance = countDownDate - now;

      // T??nh to??n s??? ng??y, gi???, ph??t, gi??y t??? th???i gian ch??nh l???ch
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // HI???n th??? chu???i th???i gian trong th??? p
      document.getElementById("demo1").innerHTML =
        days + "Ng??y " + hours + "Gi??? " + minutes + "Ph??t " + seconds + "Gi??y ";

      // N???u th???i gian k???t th??c, hi???n th??? chu???i th??ng b??o
      if (distance < 0) {
        clearInterval(x);
        document.getElementById("demo1").innerHTML =
          "Th???i gian quy??n g??p ???? k???t th??c";
      }
    }, 1000);
  }
  donghodemnguocEx(date: any) {
    var countDownDate = new Date(date).getTime();

    // L???y th???i gian hi???n t???i
    var now = new Date().getTime();

    // L???y s??? th???i gian ch??nh l???ch
    var distance = countDownDate - now;

    // T??nh to??n s??? ng??y, gi???, ph??t, gi??y t??? th???i gian ch??nh l???ch
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // HI???n th??? chu???i th???i gian trong th??? p
    // document.getElementById("demo1").innerHTML = days + "Ng??y " + hours + "Gi??? "
    //   + minutes + "Ph??t " + seconds + "Gi??y ";
    return (
      days + "Ng??y " + hours + "Gi??? " + minutes + "Ph??t " + seconds + "Gi??y "
    );
  }
  Search() {
    if (this.title === "") {
      this.ngOnInit();
    } else {
      this.package1List = this.package1List.filter((res) => {
        return res.title
          .toLocaleLowerCase()
          .match(this.title.toLocaleLowerCase());
      });
    }
  }
  follow(package1: IPackage1) {

    this.package1Service.formPackage1 = package1;
    this.package1Service.getById(this.package1Service.formPackage1._id).subscribe((data: IPackage1) => {
        this.package1 = data;
        if (isNullOrUndefined(this.user)) {
          this.toastr.error("Vui l??ng ????ng nh???p ????? c?? th??? s??? d???ng t??nh n??ng n??y !");
        }
        if (this.package1 !== undefined) {
          this.package1Service.getById(this.package1Service.formPackage1._id).subscribe((data) => {
              this.package1 = data;
              if(this.package1.followers.indexOf(this.tokenStorageService.getUser().id)!==-1){
                this.toastr.warning("Followed")

              }
              else{
                this.package1.followers.push(this.tokenStorageService.getUser().id)
                this.package1Service.updatePackage1(this.package1._id, this.package1).subscribe(
                 (res) => {
                   this.tokenStorageService.getUser().id,
                     this.toastr.success("Follow Success!!!");
                   this.package1Service
                     .getPackage1List()
                     .subscribe((ps) => (this.package1List = ps));
                 },
                 (error) => {
                   console.log(error);
                 }
               );
              }

            });
        }
      });
  }
  onToggle = () => {
    this.isShow = !this.isShow;
  };
  donateP(id: any) {
    this.router.navigate(["donate", id]);
  }
  causeDetails(id: number) {
    this.router.navigate(["causes/package1", id]);
  }
  causeDetails2(id: number) {
    this.router.navigate(["causes/package2", id]);
  }
  lamtron(x: any) {
    return Math.round(x);
  }
}
