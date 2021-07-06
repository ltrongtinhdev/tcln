import { Data } from '@angular/router';

export class IPackage1{
  _id:number;
  title:string;
  imageUrl:string;
  target:number;
  raised:number;
  confirm:string;
  accuracy:string;
  description:string;
  idUser:string;
  donate:number
  person:{
    firstName:string;
    lastName:string;
    gender:string
    dob:Date;
    address:string;
    avatarUrl:string;
  }
  createdBy:string;
  createDate:Date
  expirationDate:string
  followers:string[]=[]
}
