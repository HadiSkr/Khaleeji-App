import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomePage } from 'src/pages/home/home';
import { StaticPage } from 'src/pages/static/static';
import { DashPage } from 'src/pages/dash/dash';
import { ListPage } from 'src/pages/list/list';
import { LoginPage } from 'src/pages/login/login';
import { HybridPage } from 'src/pages/hybrid/hybrid';
import { CurrentPage } from 'src/pages/current/current';
import { BatchPage } from 'src/pages/batch/batch';
import { DetailsPage } from 'src/pages/details/details';
import { ProfilePage } from 'src/pages/profile/profile';
import { RegisterPage } from 'src/pages/register/register';
import { PipesModule } from "../pipes/pipes.module";
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/components/components.module';
import { CommonModule } from '@angular/common';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonProvider } from 'src/providers/common/common';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BasePage } from 'src/pages/base/base.component';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';


const config: SocketIoConfig = { url: 'wss://khaleejauction.com:2053', options: {} };

function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
    ],
    declarations: [
        AppComponent,
        HomePage,
        StaticPage,
        DashPage,
        ListPage,
        LoginPage,
        HybridPage,
        CurrentPage,
        BatchPage,
        DetailsPage,
        ProfilePage,
        RegisterPage,
      BasePage
    ],
    providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy}, AuthenticationProvider, CommonProvider, SocialSharing],
    bootstrap: [AppComponent],
    imports: [SocketIoModule.forRoot(config), HttpClientModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule, PipesModule, TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),FormsModule, ComponentsModule, CommonModule]
})
export class AppModule { }
