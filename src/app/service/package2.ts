export class IPackage2{
  _id:number;
  title:string;
  target:number;
  raised:number;
  confirm:string;
  accuracy:string;
  description:string;
  idUser:string;
  createDate:Date;
  restaurant:{
    name:string;
    phoneNumber:number;
    address:string;
  }
  listPeople:string
}
export class IListPeople{
  fullName:string;
  gender:string;
  phoneNumber:number;
  email:string;
  dob:Date;
  address:string;
}
