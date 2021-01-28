import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: 'First Post', content: 'This is the first post content.' },
  //   { title: 'Second Post', content: 'This is the second post content.' },
  //   { title: 'Third Post', content: 'This is the third post content.' },
  // ];
  posts: Post[] = [];

  postsUpdatedSubscription: Subscription;

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    // initial fetch
    this.posts = this.postsService.getPosts();
    this.postsUpdatedSubscription = this.postsService
      .getPostsUpdatedListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    if (this.postsUpdatedSubscription) {
      this.postsUpdatedSubscription.unsubscribe();
    }
  }
}
