import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private http: HttpClient) {}

  private posts: Post[] = [];

  private postsUpdated = new Subject<Post[]>();

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  getPosts() {
    this.http
      .get<{ message: string; posts: Post[] }>(
        'http://localhost:3000/api/posts'
      )
      .subscribe((postsResponse) => {
        this.posts = postsResponse.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  addPost(title: string, content: string) {
    const post: Post = { title, content };
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
