import { IPost } from 'src/app/service/post';
import { IUser } from './users';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postURL="http://localhost:3000/post";
  headers=new HttpHeaders().set('Content-Type','application/json').set('Accept','application/json');
  httpOptions={
    headers:this.headers
  }
  formPost:IPost;
  post=IPost;
  constructor(
    private http:HttpClient
  ) { }

  getPost():Observable<IPost[]>{
    return this.http.get<IPost[]>(this.postURL,this.httpOptions).pipe(
      tap(receivedPost=> console.log(`receivedPost=${JSON.stringify(receivedPost)}`)),
      catchError(error=>of([]))
      )
  }
  getById(id:number):Observable<IPost>{
    const url=`${this.postURL}/${id}`;
    return this.http.get<IPost>(url, this.httpOptions).pipe(
      tap(selectedPost=>console.log(`selected post=${JSON.stringify(selectedPost)}`))
       ,catchError(error=>of(new IPost()))
      );
  }
  addPost(post: IPost): Observable<IPost> {
    return this.http.post<IPost>(this.postURL, post,this.httpOptions).pipe(
      tap((prod: IPost) => console.log(`added post w/ id=${post._id}`)),
      catchError(this.handleError<IPost>('addPost'))
    );
  }
  updatePost(id,post:IPost):Observable<any>{
    console.log(id)
    const url=`${this.postURL}/${id}`;
    return this.http.put(url,post).pipe(
      tap(selectedPost=>console.log(`updatePost id=${JSON.stringify(selectedPost)}`)),
      catchError(error=>of(new IPost()))
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
