import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string;
  private userId: string;
  private isAuthenticated: boolean = false;
  timer: any;
  BACKEND_URL = environment.apiURL + '/user/';

  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  isUserAuthenticated() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post(this.BACKEND_URL + 'signup', authData).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['/']);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        this.BACKEND_URL + 'login',
        authData
      )
      .subscribe(
        (response) => {
          console.log(response);
          this.token = response.token;
          if (this.token) {
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);

            const expiresIn = response.expiresIn;
            this.autoLogoutUserTimer(expiresIn);

            // save auth data
            const expirationTime = new Date(
              new Date().getTime() + expiresIn * 1000
            );

            this.saveAuthData(this.token, expirationTime, this.userId);

            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
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
      this.userId = authData.userId;
      this.autoLogoutUserTimer(difference / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    console.log('logout');
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
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
  private saveAuthData(token: string, expirationTime: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    // NOT toString but toISoString which is serialized and standard style version of the date
    // which we then can use to recreate it.
    localStorage.setItem('expirationTime', expirationTime.toISOString());
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const expirationTimeStr = localStorage.getItem('expirationTime');

    if (!token || !expirationTimeStr) {
      return;
    }

    return {
      token: token,
      userId: userId,
      expirationTime: new Date(expirationTimeStr),
    };
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationTime');
  }
}
