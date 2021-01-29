import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
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

  postForm: FormGroup;

  constructor(
    private postsService: PostsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // initialize the form
    this.postForm = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
    });

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
          this.postForm.setValue({
            title: postData.title,
            content: postData.content,
          });
        });
      } else {
        this.mode = 'create';
        this.post = null;
      }
    });
  }

  onSavePost() {
    if (this.postForm.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.postForm.value.title,
        this.postForm.value.content
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.postForm.value.title,
        this.postForm.value.content
      );
    }
    this.isLoading = false;
    // reset the form
    this.postForm.reset();
  }
}
