import { Component, Input } from '@angular/core';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
})
export class PostListComponent {
  // posts = [
  //   { title: 'First Post', content: 'This is the first post content.' },
  //   { title: 'Second Post', content: 'This is the second post content.' },
  //   { title: 'Third Post', content: 'This is the third post content.' },
  // ];
  @Input() posts: Post[] = [];
}
