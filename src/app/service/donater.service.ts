import { IDonater } from 'src/app/service/donater';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class DonaterService {
  headers=new HttpHeaders().set('Content-Type','application/json').set('Accept','application/json');
  httpOptions={
    headers:this.headers
  }
  private donaterURL="http://localhost:3000/donater";
  donater=IDonater;

  constructor(
    private http:HttpClient

  ) { }
  getByIdPost(id:string):Observable<IDonater[]>{
    const url=`${this.donaterURL}/${'post'}/${id}`;
    return this.http.get<IDonater[]>(url, this.httpOptions);
  }
  addDonater(donater: IDonater): Observable<IDonater> {
    return this.http.post<IDonater>(this.donaterURL, donater).pipe(
      tap((prod: IDonater) => console.log(`added donater w/ id=${donater._id}`)),
      catchError(this.handleError<IDonater>('addDonater'))
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
