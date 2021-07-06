import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, tap } from 'rxjs/operators';
import { IPackage1 } from './package1';
import { Observable, of, throwError } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { data } from 'jquery';
import { TokenStorageService } from '../token-storage.service';
@Injectable({
  providedIn: 'root'
})
export class Package1Service {
  headers=new HttpHeaders().set('Content-Type','application/json').set('Accept','application/json');
  httpOptions={
    headers:this.headers
  }
  private package1URL="http://localhost:3000/package1";
  //private causes:ICauses[];

  package1=IPackage1;
  formPackage1:IPackage1;
  editForm:FormGroup;
  constructor(
    private http:HttpClient,
    private tokenStorage: TokenStorageService

  ) { }

  getPackage1List():Observable<IPackage1[]>{
    return this.http.get<IPackage1[]>(this.package1URL,this.httpOptions).pipe(
      tap(
        receivedPackage1=> console.log(`2`)
        ),
      catchError(error=>of([]))
      )
  }
  getByConfirm():Observable<IPackage1[]>{
    const url=`${this.package1URL}/${'confirm'}`;
    return this.http.get<IPackage1[]>(url, this.httpOptions).pipe(
      tap(selectedPackage1=>console.log(`1`))
       ,catchError(error=>of([]))
      );
  }
  getByUser():Observable<IPackage1[]>{
    const url=`${this.package1URL}/${'news'}/${this.tokenStorage.getUser().id}`;
    return this.http.get<IPackage1[]>(url, this.httpOptions).pipe(
      tap(selectedPackage1=>console.log(`1`))
       ,catchError(error=>of([]))
      );
  }
  getById(id:number):Observable<IPackage1>{
    const url=`${this.package1URL}/${id}`;
    return this.http.get<IPackage1>(url, this.httpOptions).pipe(
      tap(selectedPackage1=>console.log(`1`))
       ,catchError(error=>of(new IPackage1()))
      );
  }

  


  addPackage1(package1: IPackage1): Observable<IPackage1> {
    return this.http.post<IPackage1>(this.package1URL, package1).pipe(
      tap((prod: IPackage1) => console.log(`added package1 w/ id=${package1._id}`)),
      catchError(this.handleError<IPackage1>('addCauses'))
    );
  }
  addPaypal(package1: IPackage1,id:string): Observable<IPackage1> {
    const url=`${this.package1URL}/${id}/${'pay'}`;
    return this.http.post<IPackage1>(url, package1).pipe(
      tap((prod: IPackage1) => console.log(`added package1 w/ id=${package1._id}`)),
      catchError(this.handleError<IPackage1>('addCauses'))
    );
  }
  updatePackage1(id,package1:IPackage1):Observable<any>{
    console.log(id)
    const url=`${this.package1URL}/${id}`;
    return this.http.put(url,package1).pipe(
      tap(selectedPackage1=>console.log(`updatePackage1 id=${JSON.stringify(selectedPackage1)}`)),
      catchError(error=>of(new IPackage1()))
    );
  }
  deletePackage1(id: any): Observable<IPackage1> {
    const url = `${this.package1URL}/${id}`;
    return this.http.delete<IPackage1>(url,this.httpOptions).pipe(
      tap(_ => console.log(`deleted package1 id=${id}`)),
      catchError(this.handleError<IPackage1>('deletePackage1'))
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
