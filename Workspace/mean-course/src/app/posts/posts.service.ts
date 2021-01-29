import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
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
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postsResponse) => {
          return postsResponse.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id, // tranforming "_id" to "id"
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title, content };

    this.http
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((responseData) => {
        console.log(responseData.message);
        post.id = responseData.postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content };
    this.http
      .put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(() => {
        console.log('Post updated!');
      });
  }

  getPost(postId: string) {
    // send a copy
    return { ...this.posts.find((post) => post.id === postId) };
  }

  deletePost(postId: string) {
    this.http
      .delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        console.log(`Post with ID ${postId} Deleted!`);
        // filter the deleted post
        const updatedPosts = this.posts.filter((post) => {
          return post.id !== postId;
        });
        this.posts = updatedPosts;
        // broadcast
        this.postsUpdated.next([...this.posts]);
      });
  }
}
