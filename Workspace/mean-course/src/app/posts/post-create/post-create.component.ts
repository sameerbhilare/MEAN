import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  mode: string = 'create';
  post: Post;
  postId: string;
  isLoading: boolean = false;

  constructor(
    private postsService: PostsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      // 'postId' is defined in AppRoutingModule routes
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
          };
          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.post = null;
      }
    });
  }

  onSavePost(postForm: NgForm) {
    if (postForm.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(postForm.value.title, postForm.value.content);
    } else {
      this.postsService.updatePost(
        this.postId,
        postForm.value.title,
        postForm.value.content
      );
    }
    this.isLoading = false;
    // reset the form
    postForm.resetForm();
  }
}
