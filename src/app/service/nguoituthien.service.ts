
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ICharity } from './nguoituthien';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { IPackage1 } from 'src/app/service/package1';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class NguoituthienService {
  headers=new HttpHeaders().set('Content-Type','application/json').set('Accept','application/json');
  httpOptions={
    headers:this.headers
  }

  private charityURL="http://localhost:3000/charity";
  charity=ICharity;
  editForm:FormGroup;
  formCharity:ICharity
  constructor(
    private http:HttpClient
  ) { }
  getCharityList():Observable<ICharity[]>{
    return this.http.get<ICharity[]>(this.charityURL).pipe(
      tap(receivedCharity=>console.log(`receivedCharity=${JSON.stringify(receivedCharity)}`)),
      catchError(error=>of([]))
    )
  }
  getById(id:number):Observable<ICharity>{
    const url=`${this.charityURL}/${id}`;
    return this.http.get<ICharity>(url).pipe(
      tap(selectedCharity=>console.log(`selected charity=${JSON.stringify(selectedCharity)}`))
      ,catchError(error=>of(new ICharity()))
    )
  }
  addCharity(charity: ICharity): Observable<ICharity> {
    return this.http.post<ICharity>(this.charityURL, charity).pipe(
      tap((prod: ICharity) => console.log(`added package1 w/ id=${charity.id}`)),
      catchError(this.handleError<ICharity>('addCauses'))
    );
  }
  postCharity(data){
    return this.http.post(this.charityURL, data);
  }

  update(id:number):Observable<ICharity>{
    return this.http.put<ICharity>(this.charityURL,this.httpOptions)
  }
  delete(id:number):Observable<ICharity>{
    return this.http.delete<ICharity>(this.charityURL,this.httpOptions)
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
