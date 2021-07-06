import { NewsDetailComponent } from './pages/news/news-detail/news-detail.component';
import { NewsComponent } from './pages/news/news/news.component';
import { AuthGuard } from './auth.guard';
import { Package1DetailComponent } from './pages/causes/package1-detail/package1-detail.component';
import { DefaultLayoutComponent } from './block/default-layout/default-layout.component';
import { CreateCausesComponent } from './pages/causes/create-causes/create-causes.component';
import { CausesComponent } from './pages/causes/causes/causes.component';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Package2DetailComponent } from './pages/causes/package2-detail/package2-detail.component';
import { CausesDetailComponent } from './pages/causes/causes-detail/causes-detail.component';

const routes: Routes = [
  {path:'',component:DefaultLayoutComponent,
  children:[
    {
      path:'',
      redirectTo:'/home',
      pathMatch:'full'
    },
    {
      path:'home',
      component:HomeComponent,
     // canActivate: [AuthGuard],

    },

    {
      path:'createCauses',
     // canActivate:[AuthGuard],
      component:CreateCausesComponent
    },
    {
      path:'causes',
      component:CausesComponent,
    },
    {
      path:'causes/package1/:id',
      component:Package1DetailComponent
    },
    {
      path:'causes/package2/:id',
      component:Package2DetailComponent
    },
    {
      path:'home/package1/:id',
      component:Package1DetailComponent
    },
    {
      path:'news',
      component:NewsComponent
    },
    {
      path:'news/:id',
      component:NewsDetailComponent
    },
    {
      path:'donate/:idpost',
      component:CausesDetailComponent
    }
  ]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }
