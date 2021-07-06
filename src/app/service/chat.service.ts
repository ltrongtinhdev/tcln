import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ChatModule, Message, User, Action, ExecuteActionEvent, SendMessageEvent } from '@progress/kendo-angular-conversational-ui';


// Mock remote service

@Injectable()
export class ChatService {
    public readonly responses: Subject<Message> = new Subject<Message>();
    public isQuery:boolean=false;
    message: Message 
  public submit(question: string): void {
    const length = question.length;
    let answer = "Tôi không hiểu bạn nói gì ?";
    if(question==="Tôi muốn donate")
    {
      answer="Bạn có thể truy cập vào phần Quyên góp để bắt đầu donate?";
    }
     if(question==="Tôi muốn liên lạc với bạn")
    {
        answer="Số điện thoại của chúng tối 0000123400"; 
    }
    this.message = {
        author: {id: 0},
        
        timestamp: new Date(),
        text: answer
      };
      setTimeout(
        () => this.responses.next(this.message),
        1000
      );
    
    
  }
}
