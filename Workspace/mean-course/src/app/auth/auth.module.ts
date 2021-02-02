import { NgModule } from '@angular/core';

import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    AuthRoutingModule,
  ],
  // dont put the services here in the providers array.
  // it is better to mark the services with @Injectable and providedIn: 'root',
  // this will avoid problems related to multiple instances of the Services.
})
export class AuthModule {}
