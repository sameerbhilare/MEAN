import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  @Output() postCreated = new EventEmitter<Post>();

  onAddPost(postForm: NgForm) {
    if (postForm.invalid) {
      return;
    }

    // crate post object
    const post: Post = {
      title: postForm.value.title,
      content: postForm.value.content,
    };
    // emit event
    this.postCreated.emit(post);
  }
}
