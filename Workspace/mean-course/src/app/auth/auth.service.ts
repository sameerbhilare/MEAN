import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string;
  private isAuthenticated: boolean = false;
  timer: any;

  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  isUserAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe((response) => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http
      .post<{ token: string; expiresIn: number }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe((response) => {
        console.log(response);
        this.token = response.token;
        if (this.token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const expiresIn = response.expiresIn;
          this.timer = setTimeout(() => {
            this.logout();
          }, expiresIn * 1000);
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    console.log('logout');
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.timer);
  }
}
