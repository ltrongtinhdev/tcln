import { IComment } from 'src/app/service/comment';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class CommentService {
  headers=new HttpHeaders().set('Content-Type','application/json').set('Accept','application/json');
  httpOptions={
    headers:this.headers
  }
  private commentURL="http://localhost:3000/comment";
  comment=IComment;

  constructor(
    private http:HttpClient

  ) { }
  getCommentList():Observable<IComment[]>{
    return this.http.get<IComment[]>(this.commentURL).pipe(
      tap(receivedComment=>console.log(`receivedComment=${JSON.stringify(receivedComment)}`)),
      catchError(error=>of([]))
    )
  }
  getById(id:number):Observable<IComment>{
    const url=`${this.commentURL}/${id}`;
    return this.http.get<IComment>(url).pipe(
      tap(selectedComment=>console.log(`selectedComment=${JSON.stringify(selectedComment)}`))
      ,catchError(error=>of(new IComment()))
    )
  }
  getByIdPost(id:string):Observable<IComment[]>{
    const url=`${this.commentURL}/${'post'}/${id}`;
    return this.http.get<IComment[]>(url, this.httpOptions).pipe(
      tap(selectedComment=>console.log(`selected comment=${JSON.stringify(selectedComment)}`))
       ,catchError(error=>of([]))
      );
  }
  addComment(comment: IComment): Observable<IComment> {
    return this.http.post<IComment>(this.commentURL, comment).pipe(
      tap((prod: IComment) => console.log(`added comment w/ id=${comment._id}`)),
      catchError(this.handleError<IComment>('addComment'))
    );
  }
  updateComment(id,comment:IComment):Observable<any>{
    console.log(id)
    const url=`${this.commentURL}/${id}`;
    return this.http.put(url,comment).pipe(
      tap(selectedComment=>console.log(`updateComment id=${JSON.stringify(selectedComment)}`)),
      catchError(error=>of(new IComment()))
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
