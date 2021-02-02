import { NgModule } from '@angular/core';

import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PostCreateComponent, PostListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AngularMaterialModule,
  ],
  // dont put the services here in the providers array.
  // it is better to mark the services with @Injectable and providedIn: 'root',
  // this will avoid problems related to multiple instances of the Services.
})
export class PostsModule {}
