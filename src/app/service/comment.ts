import { data } from 'jquery';
export class IComment{
  _id:number;
  content:string;
  createdDate:Date;
  idUser:string;
  email:string;
  likes:number;
  // childComment:[{
  //   likesChild:number;
  //   contentChild:string;
  //   createdDate:Date;
  //   idUser:string;
  //   email:string
  // }]
  idPost:string;
}
