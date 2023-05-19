import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { BatchPage } from 'src/pages/batch/batch';
import { CurrentPage } from 'src/pages/current/current';
import { DashPage } from 'src/pages/dash/dash';
import { DetailsPage } from 'src/pages/details/details';
import { HomePage } from 'src/pages/home/home';
import { HybridPage } from 'src/pages/hybrid/hybrid';
import { ListPage } from 'src/pages/list/list';
import { LoginPage } from 'src/pages/login/login';
import { ProfilePage } from 'src/pages/profile/profile';
import { RegisterPage } from 'src/pages/register/register';
import { StaticPage } from 'src/pages/static/static';

const routes: Routes = [
  {
    path: '/', component: HomePage
  },
  {
    path: '/batch', component: BatchPage
  },
  {
    path: '/current', component: CurrentPage
  },
  {
    path: '/dash', component: DashPage
  },
  {
    path: '/details', component: DetailsPage
  },
  {
    path: '/hybrid', component: HybridPage
  },
  {
    path: '/list', component: ListPage
  },
  {
    path: '/login', component: LoginPage
  },
  {
    path: '/profile', component: ProfilePage
  },
  {
    path: '/register', component: RegisterPage
  },
  {
    path: '/static', component: StaticPage
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
