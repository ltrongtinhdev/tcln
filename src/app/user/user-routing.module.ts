import { AnonymousGuard } from './../anynomous.guard';
import { AuthGuard } from './../auth.guard';
import { Router, RouterModule, Routes, CanActivate } from '@angular/router';
import { UserComponent } from './user.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const userRoutes: Routes = [
  {path:'user', component:UserComponent,

    children:[
      {path:'login', component:LoginComponent,
      // canActivate:[AnonymousGuard],
    },
      {path:'register',component:RegisterComponent},

  ]
}
];
@NgModule({
    imports:[RouterModule.forChild(userRoutes)],
    exports:[RouterModule],
    providers:[AnonymousGuard,AuthGuard]
})
export class UserRoutingModule { }
