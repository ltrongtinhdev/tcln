import { Component, OnInit } from '@angular/core';
declare var top:any
import { Socket } from 'ngx-socket-io'
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/internal/Observable';
import { MessagingService } from 'src/app/service/messaging.service';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.css']
})
export class DefaultLayoutComponent implements OnInit {
  title = 'push-notification';
  message;
  constructor(
   // private socket: Socket,
    public toastr: ToastrService,
    private messagingService: MessagingService
    ) { }

  ngOnInit() {

    // this.socket.on('Server-send-data', function(data){
    //   console.log(data)})
  }
  // public sendMessage(message) {
  //   this.socket.emit('connection', message);}



}
