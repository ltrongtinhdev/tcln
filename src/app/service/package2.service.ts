import { IPackage2 } from './package2';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { catchError, tap } from 'rxjs/operators';
import { Observable,of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Package2Service {
  headers=new HttpHeaders().set('Content-Type','application/json').set('Accept','application/json');
  httpOptions={
    headers:this.headers
  }
  private package2URL="http://localhost:3000/package2";
  package2=IPackage2;
  formPackage2:IPackage2;
  editForm:FormGroup;
  constructor(
    private http:HttpClient

  ) { }
  getPackage2List():Observable<IPackage2[]>{
    return this.http.get<IPackage2[]>(this.package2URL,this.httpOptions).pipe(
      //tap(receivedPackage2=> console.log(`receivedPackage2=${JSON.stringify(receivedPackage2)}`)),
      catchError(error=>of([]))
      )
  }
  addPaypal(package2: IPackage2,id:string): Observable<IPackage2> {
    const url=`${this.package2URL}/${id}/${'pay'}`;
    return this.http.post<IPackage2>(url, package2).pipe(
      tap((prod: IPackage2) => console.log(`added package2 w/ id=${package2._id}`)),
      catchError(this.handleError<IPackage2>('addCauses'))
    );
  }
  getByConfirm():Observable<IPackage2[]>{
    const url=`${this.package2URL}/${'confirm'}`;
    return this.http.get<IPackage2[]>(url, this.httpOptions).pipe(
      tap(selectedPackage2=>console.log(`selected package2=${JSON.stringify(selectedPackage2)}`))
       ,catchError(error=>of([]))
      );
  }
  // addPaypal(package2: IPackage2,id:number): Observable<IPackage2> {
  //   const url=`${this.package2URL}/${id}/${'pay'}`;
  //   return this.http.post<IPackage2>(url, package2).pipe(
  //     tap((prod: IPackage2) => console.log(`added package1 w/ id=${package2._id}`)),
  //     catchError(this.handleError<IPackage2>('addCauses'))
  //   );
  // }
  getById(id:any):Observable<IPackage2>{
    const url=`${this.package2URL}/${id}`;
    return this.http.get<IPackage2>(url, this.httpOptions).pipe(
      tap(selectedPackage2=>console.log(`selected package2=${JSON.stringify(selectedPackage2)}`))
       ,catchError(error=>of(new IPackage2()))
      );
  }
  addPackage2(package2: IPackage2): Observable<IPackage2> {
    return this.http.post<IPackage2>(this.package2URL, package2).pipe(
      tap((prod: IPackage2) => console.log(`added package2 w/ id=${package2._id}`)),
      catchError(this.handleError<IPackage2>('addPackage2'))
    );
  }
  updatePackage2(id:any,package2:IPackage2):Observable<any>{
    const url=`${this.package2URL}/${id}`;
    return this.http.put(url,package2,this.httpOptions).pipe(
      tap(selectedPackage2=>console.log(`updatePackage1 id=${JSON.stringify(selectedPackage2)}`)),
      catchError(error=>of(new IPackage2()))
    );
  }
  deletePackage2(id: any): Observable<IPackage2> {
    const url = `${this.package2URL}/${id}`;
    return this.http.delete<IPackage2>(url,this.httpOptions).pipe(
      tap(_ => console.log(`deleted package2 id=${id}`)),
      catchError(this.handleError<IPackage2>('deletePackage2'))
    );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }
  private log(message: string) {
    console.log(message);
  }
}
