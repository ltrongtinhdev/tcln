import { IListPeople } from './package2';
import { IReceiveFood } from './receivefood';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReceiveFoodService {
  headers=new HttpHeaders().set('Content-Type','application/json').set('Accept','application/json');
  httpOptions={
    headers:this.headers
  }
  formReceieveFood:IReceiveFood;
  receivefood=IReceiveFood
  private receivefoodURL="http://localhost:3000/receivefood";
  constructor(
    private http:HttpClient
  ) {

  }

  getReceieve():Observable<IReceiveFood[]>{
    return this.http.get<IReceiveFood[]>(this.receivefoodURL,this.httpOptions).pipe(
      tap(receivedFood=> console.log(`receivedFood=${JSON.stringify(receivedFood)}`)),
      catchError(error=>of([]))
      )
  }
  addReceivefood(receivefood: IReceiveFood): Observable<IReceiveFood> {
    return this.http.post<IReceiveFood>(this.receivefoodURL, receivefood,this.httpOptions).pipe(
      tap((prod: IReceiveFood) => console.log(`added w/ id=`)),
      catchError(this.handleError<IReceiveFood>('add'))
    );
  }
  getById(id:any):Observable<IReceiveFood>{
    const url=`${this.receivefoodURL}/${id}`;
    return this.http.get<IReceiveFood>(url, this.httpOptions).pipe(
      tap(selectedReceiveFood=>console.log(`selected receiveFood=${JSON.stringify(selectedReceiveFood)}`))
       ,catchError(error=>of(new IReceiveFood()))
      );
  }
  updateRecieveFood(id,post:IReceiveFood):Observable<any>{
    console.log(id)
    const url=`${this.receivefoodURL}/${id}`;
    return this.http.put(url,post).pipe(
      tap(selectedRecieveFood=>console.log(`updatePost id=${JSON.stringify(selectedRecieveFood)}`)),
      catchError(error=>of(new IReceiveFood()))
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
