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
          this.autoLogoutUserTimer(expiresIn);

          // save auth data
          const expirationTime = new Date(
            new Date().getTime() + expiresIn * 1000
          );

          this.saveAuthData(this.token, expirationTime);

          this.router.navigate(['/']);
        }
      });
  }

  /**
   * initialize our auth status whenever the app starts
   */
  autoLoginUser() {
    const authData = this.getAuthData();
    if (!authData) {
      return;
    }

    const expirationTime = authData.expirationTime;
    const difference = expirationTime.getTime() - new Date().getTime();

    if (difference > 0) {
      console.log('User Auto logged in');
      // token is NOT expired yet
      this.token = authData.token;
      this.isAuthenticated = true;
      this.autoLogoutUserTimer(difference / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    console.log('logout');
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    clearTimeout(this.timer);
    this.router.navigate(['/']);
  }

  private autoLogoutUserTimer(durationInSeconds: number) {
    console.log('Auto logout in ' + durationInSeconds + ' seconds');
    this.timer = setTimeout(() => {
      this.logout();
    }, durationInSeconds * 1000);
  }

  /**
   * local storage simply is a storage managed by the browser, accessible through Javascript,
   * therefore vulnerable to cross-site scripting attacks.
   * But Angular prevents us against these by default
   * so we can't output script tags with Angular for example, so we should be safe .
   */
  private saveAuthData(token: string, expirationTime: Date) {
    localStorage.setItem('token', token);
    // NOT toString but toISoString which is serialized and standard style version of the date
    // which we then can use to recreate it.
    localStorage.setItem('expirationTime', expirationTime.toISOString());
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationTimeStr = localStorage.getItem('expirationTime');

    if (!token || !expirationTimeStr) {
      return;
    }

    return {
      token: token,
      expirationTime: new Date(expirationTimeStr),
    };
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
  }
}
