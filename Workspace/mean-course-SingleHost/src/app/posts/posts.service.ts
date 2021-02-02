import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private http: HttpClient, private router: Router) {}

  BACKEND_URL = environment.apiURL + '/posts/';

  private posts: Post[] = [];

  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; totalPosts: number }>(
        this.BACKEND_URL + queryParams
      )
      .pipe(
        map((postsResponse) => {
          return {
            posts: postsResponse.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                id: post._id, // tranforming "_id" to "id"
                creator: post.creator,
              };
            }),
            totalPosts: postsResponse.totalPosts,
          };
        })
      )
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.totalPosts,
        });
      });
  }

  addPost(title: string, content: string, file: File) {
    // FormData allows us to combine form/text values and blobs
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', file, title); // title - name of the file

    this.http
      .post<{ message: string; post: Post }>(this.BACKEND_URL, postData)
      .subscribe((responseData) => {
        console.log(responseData.message);
        // navigate
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: FormData | Post;
    if (typeof image === 'object') {
      // this means image was updated, so create formdata
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title); // title - name of the file
    } else {
      postData = { id, title, content, imagePath: image, creator: null };
    }

    this.http.put(this.BACKEND_URL + id, postData).subscribe((responseData) => {
      console.log('Post updated!');
      // navigate
      this.router.navigate(['/']);
    });
  }

  getPost(postId: string) {
    // send a copy
    // return { ...this.posts.find((post) => post.id === postId) };
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(this.BACKEND_URL + postId);
  }

  deletePost(postId: string) {
    return this.http.delete(this.BACKEND_URL + postId);
  }
}
