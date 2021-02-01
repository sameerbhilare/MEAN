import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  authStatusListenerSubs: Subscription;

  isUserAuthenticated: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authStatusListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isUserAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy() {
    if (this.authStatusListenerSubs) {
      this.authStatusListenerSubs.unsubscribe();
    }
  }
}
