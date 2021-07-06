import { AuthServices } from './../../auth.service';
import { Package1Service } from '../../service/package1.service';
import { IPackage1 } from '../../service/package1';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { switchMap, map, windowCount, scan, take, tap } from 'rxjs/operators';
import { Subject, from, merge, Observable } from 'rxjs';
import * as AOS from 'aos'
import * as moment from 'moment';
import { ChatModule, Message, User, Action, ExecuteActionEvent, SendMessageEvent } from '@progress/kendo-angular-conversational-ui';
import { ChatService } from '../../service/chat.service';
export interface IMessage {
  id?: number,
  text?: String;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  package1List: IPackage1[];
  public feed: Observable<Message[]>;
  public readonly user: User = {
    id: 1
  };

  public readonly bot: User = {
    id: 0
  };
  private local: Subject<Message> = new Subject<Message>();
  progress: any
  show: boolean = false
  val: any;
  arrMessage: IMessage[] = [];
  arr: String;
  constructor(
    private package1Service: Package1Service,
    private activatedRoute: ActivatedRoute,
    private authService: AuthServices,
    private router: Router,
    private svc: ChatService

  ) {
    const hello: Message = {
      author: this.bot,
      suggestedActions: [ {
        type: 'reply',
        value: 'Tôi muốn donate'
      }, {
        type: 'reply',
        value: 'Tôi muốn liên lạc với bạn'
      }],
      timestamp: new Date(),
      text: 'Xin chào tôi là bot Từ thiện ?'
    };
    this.feed = merge(
      from([ hello ]),
      this.local,
      this.svc.responses.pipe(
        
        map((response:Message): Message => ({
          
          author: this.bot,
          text: response.text
        })
      ))
    ).pipe(
      // ... and emit an array of all messages
      scan((acc: Message[], x: Message) => [...acc, x], [])
    );
    console.log(this.feed)
  }

  ngOnInit() {
    // this.activatedRoute.paramMap.pipe(
    //   map(params=>params.get(1)),
    //   switchMap(id=>this.causesService.getById(id)
    // ).subscribe(cause=>this.cause=cause)
    AOS.init()
    this.package1Service.getByConfirm().subscribe((data)=>{
      this.package1List=data.slice(1,2);
      this.package1List.forEach(element => {
        var countDownDate = new Date(element.expirationDate).getTime();
        var x = setInterval(function () {

          // Lấy thời gian hiện tại
          var now = new Date().getTime();

          // Lấy số thời gian chênh lệch
          var distance = countDownDate - now;

          // Tính toán số ngày, giờ, phút, giây từ thời gian chênh lệch
          var days = Math.floor(distance / (1000 * 60 * 60 * 24));
          var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((distance % (1000 * 60)) / 1000);

          // HIển thị chuỗi thời gian trong thẻ p
          document.querySelector("#demo").innerHTML = days + "Ngày " + hours + "Giờ "
            + minutes + "Phút " + seconds + "Giây ";

          // Nếu thời gian kết thúc, hiển thị chuỗi thông báo
          if (distance < 0) {
            clearInterval(x);
            document.getElementById("demo").innerHTML = "Thời gian quyên góp đã kết thúc";
          }
        }, 1000);

      })
    })

    // this.package1Service.getByConfirm().subscribe((data)=>{
    //   this.package1List=data;
    //   // this.countDown(this.package1List)
    //   this.package1List.forEach(element => {
    //       element.expirationDate = this.donghodemnguocEx(element.expirationDate);
    //   });
    // })
  }
  public sendMessage(e: SendMessageEvent): void {
    this.local.next(e.message);
    console.log(e.message)
    this.local.next({
      author: this.bot,
      typing: true,
    });

    this.svc.submit(e.message.text);
  }
  sendMsg(val) {
    console.log(val)
    this.arrMessage.push({id: 1, text: val})
    this.arr += this.arr + '\n' + val
    console.log(this.arrMessage)
  }
  donghodemnguocEx(date: any) {
    var countDownDate = new Date(date).getTime();

        // Lấy thời gian hiện tại
      var now = new Date().getTime();

      // Lấy số thời gian chênh lệch
      var distance = countDownDate - now;

      // Tính toán số ngày, giờ, phút, giây từ thời gian chênh lệch
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000)-1;

      // HIển thị chuỗi thời gian trong thẻ p
      // document.getElementById("demo1").innerHTML = days + "Ngày " + hours + "Giờ "
      //   + minutes + "Phút " + seconds + "Giây ";
      return days + "Ngày " + hours + "Giờ "
      + minutes + "Phút " + seconds + "Giây ";
  }
  donghodemnguoc(date: any) {
    var countDownDate = new Date(date).getTime();
    var x = setInterval(function () {

      // Lấy thời gian hiện tại
      var now = new Date().getTime();

      // Lấy số thời gian chênh lệch
      var distance = countDownDate - now;

      // Tính toán số ngày, giờ, phút, giây từ thời gian chênh lệch
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // var show_time = document.getElementById("demo");
      // // HIển thị chuỗi thời gian trong thẻ p
      // show_time.innerHTML = days + "Ngày " + hours + "Giờ "
      //   + minutes + "Phút " + seconds + "Giây ";

      // Nếu thời gian kết thúc, hiển thị chuỗi thông báo
      if (distance < 0) {
        clearInterval(x);
        document.getElementById("demo").innerHTML = "Thời gian đếm ngược đã kết thúc";
      }
    }, 1000);
    return x;
  }
  causesP() {
    this.router.navigate(['causes']);
  }
  logout() {
    this.authService.logout()
  }
  getCauses(): void {
    this.package1Service.getPackage1List().subscribe(package1List => this.package1List = package1List.slice(1, 2))
  }
  donateP(id: any) {
    this.router.navigate(['donate', id]);
  }
  causeDetails(id: number) {
    this.router.navigate(['causes/package1', id]);
  }
  lamtron(x: any) {
    return Math.round(x);
  }


}
