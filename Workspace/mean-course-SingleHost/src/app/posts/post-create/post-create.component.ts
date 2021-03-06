import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  mode: string = 'create';
  post: Post;
  postId: string;
  isLoading: boolean = false;
  imagePreview: string;
  authStatusSub: Subscription;

  postForm: FormGroup;

  constructor(
    private postsService: PostsService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getAuthStatusListener().subscribe((isAuth) => {
      this.isLoading = false;
    });
    // initialize the form
    this.postForm = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
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
            imagePath: postData.imagePath,
            creator: postData.creator,
          };
          this.isLoading = false;
          this.postForm.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
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
        this.postForm.value.content,
        this.postForm.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.postForm.value.title,
        this.postForm.value.content,
        this.postForm.value.image
      );
    }
    this.isLoading = false;
    // reset the form
    this.postForm.reset();
  }

  onImagePickup(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({ image: file });
    this.postForm.updateValueAndValidity();

    // image preview
    const reader = new FileReader(); // https://developer.mozilla.org/en-US/docs/Web/API/FileReader
    // 'onload' will be called once it is done reading the file
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy() {
    if (this.authStatusSub) {
      this.authStatusSub.unsubscribe();
    }
  }
}
