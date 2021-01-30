import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private http: HttpClient, private router: Router) {}

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
              imagePath: post.imagePath,
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

  addPost(title: string, content: string, file: File) {
    // FormData allows us to combine form/text values and blobs
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', file, title); // title - name of the file

    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((responseData) => {
        console.log(responseData.message);
        const post = {
          id: responseData.post.id,
          title,
          content,
          imagePath: responseData.post.imagePath,
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        // navigate
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content, imagePath: null };
    this.http
      .put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(() => {
        console.log('Post updated!');
        // update the post at client (Not required if on your current page, we are not showing posts)
        const updatedPosts = [...this.posts];
        const updatedPostIndex = updatedPosts.findIndex(
          (p) => p.id === post.id
        );
        updatedPosts[updatedPostIndex] = post;
        this.posts = updatedPosts;
        // broadcast
        this.postsUpdated.next([...this.posts]);
        // navigate
        this.router.navigate(['/']);
      });
  }

  getPost(postId: string) {
    // send a copy
    // return { ...this.posts.find((post) => post.id === postId) };
    return this.http.get<{ _id: string; title: string; content: string }>(
      'http://localhost:3000/api/posts/' + postId
    );
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
