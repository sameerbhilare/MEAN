import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];

  private postsUpdated = new Subject<Post[]>();

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  getPosts() {
    // return a copy, not original array object
    return [...this.posts];
  }

  addPost(title: string, content: string) {
    const post: Post = { title, content };
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
