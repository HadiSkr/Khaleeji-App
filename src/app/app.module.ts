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
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/components/components.module';
import { CommonModule } from '@angular/common';

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
        RegisterPage
    ],
    providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
    bootstrap: [AppComponent],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, PipesModule, TranslateModule, FormsModule, ComponentsModule, CommonModule]
})
export class AppModule { }
