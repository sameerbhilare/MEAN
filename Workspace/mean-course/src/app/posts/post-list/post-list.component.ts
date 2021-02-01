import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: 'First Post', content: 'This is the first post content.' },
  //   { title: 'Second Post', content: 'This is the second post content.' },
  //   { title: 'Third Post', content: 'This is the third post content.' },
  // ];
  posts: Post[] = [];

  postsUpdatedSubscription: Subscription;

  isLoading: boolean = false;

  pageSizeOptions = [1, 2, 5, 10];
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;

  authStatusListenerSubs: Subscription;

  isUserAuthenticated: boolean = false;

  constructor(
    private postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // initial fetch
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsUpdatedSubscription = this.postsService
      .getPostsUpdatedListener()
      .subscribe((postsData: { posts: Post[]; postCount: number }) => {
        this.posts = postsData.posts;
        this.totalPosts = postsData.postCount;
        this.isLoading = false;
      });

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

  onPageChange(event: PageEvent) {
    this.isLoading = true;
    this.postsPerPage = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDeletePost(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    if (this.postsUpdatedSubscription) {
      this.postsUpdatedSubscription.unsubscribe();
    }

    if (this.authStatusListenerSubs) {
      this.authStatusListenerSubs.unsubscribe();
    }
  }
}
