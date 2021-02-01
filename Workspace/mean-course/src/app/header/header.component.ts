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
    // manually set current auth status when this component is being loaded.
    /*
      IMP:
      The getAuthStatusListener() will emit events only on login() service call.
      And by that time, this post-list component is not initialed so even if we set
      getAuthStatusListener() subscription, we won't get the previous value i.e. the value just before
      this component is loaded.
      There are couple of approaches to fix this case -
      1. Using a isAuthenticated property in the AuthService and setting it to true at login() service call.
      2. Using BehaviorSubject instead of Subject in the AuthService

      BehaviourSubject will return the initial value or the current value on Subscription.

      Subject does not return the current value on Subscription.
      It triggers only on .next(value) call and return/output the value.
    */
    this.isUserAuthenticated = this.authService.isUserAuthenticated();
    // setup auth listner for latest changes
    this.authStatusListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isUserAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.authStatusListenerSubs) {
      this.authStatusListenerSubs.unsubscribe();
    }
  }
}
