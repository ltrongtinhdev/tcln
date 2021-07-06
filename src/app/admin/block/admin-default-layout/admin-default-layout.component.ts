import { Component, OnInit } from '@angular/core';
declare var top:any
import { Socket } from 'ngx-socket-io'
import { Observable } from 'rxjs';
@Component({
  selector: 'app-admin-default-layout',
  templateUrl: './admin-default-layout.component.html',
  styleUrls: ['./admin-default-layout.component.css']
})
export class AdminDefaultLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

// public getMessages = () => {
//   return Observable.create((observer) => {
//           this.socket.on('new-message', (message) => {
//               observer.next(message);
//           });
//   });
// }
}
