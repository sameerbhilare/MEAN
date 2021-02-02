import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'mean-course';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    /*
      When our application is starting up, this component gets loaded first.
      So this is a great place to actually do our basic initializations.
    */
    this.authService.autoLoginUser();
  }
}
