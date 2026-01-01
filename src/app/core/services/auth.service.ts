import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private isLoggedInSubject=new BehaviorSubject<boolean>(this.hasToken);

public isLoggedIn$=this.isLoggedInSubject.asObservable();

private get hasToken():boolean{
  //i am adding a mocked token check here
  return !!localStorage.getItem('auth_token');
}



  constructor() { }

  login(credentials:any):Observable<boolean>{
    //mocked login function
    return of(true).pipe(
      delay(15000),
      tap(()=>{
        localStorage.setItem('auth_token','mocked_jwt_token');
        this.isLoggedInSubject.next(true);
      })
    )

  }
  logout(){
    localStorage.removeItem('auth_Token');
    this.isLoggedInSubject.next(false);
  }
}
