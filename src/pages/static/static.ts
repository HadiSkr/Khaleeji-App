import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from '@ionic/angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { CommonProvider } from '../../providers/common/common';
import { HomePage } from '../home/home';
import { GlobalEventsService } from '../../providers/observables/observable';

/**
 * Generated class for the StaticPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-static',
  templateUrl: 'static.html',
})
export class StaticPage {
  page: any;
  content: any;
  constructor(public loadingCtrl: LoadingController, public globalEventsService: GlobalEventsService, public navCtrl: NavController, public navParams: NavParams, public common: CommonProvider, public auth: AuthenticationProvider) {
    this.page = navParams.get('page');
    this.loadingCtrl.create({
      message: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div></div>'
    }).then(loading => {
      loading.present();
    switch (this.page) {
      case 'about':
        let json = {
          action: "getaboutus",
          language: this.auth.language.toUpperCase()
        }
        this.common.getStatic(json).subscribe(
          data => {
            loading.dismiss();
            if (data['status'] == "success") {
              this.content = data["html"];
            }

          });
        break;
      case 'terms':
        json = {
          action: "getauctionguide",
          language: this.auth.language.toUpperCase()
        }
        this.common.getStatic(json).subscribe(
          data => {
            loading.dismiss();
            if (data['status'] == "success") {
              this.content = data["html"];
            }

          });
        break;
      case 'privacy':
        json = {
          action: "getprivacy",
          language: this.auth.language.toUpperCase()
        }
        this.common.getStatic(json).subscribe(
          data => {
            loading.dismiss();
            if (data['status'] == "success") {
              this.content = data["html"];
            }

          });
        break;
      case 'disclaimer':
        json = {
          action: "getdisclaimer",
          language: this.auth.language.toUpperCase()
        }
        this.common.getStatic(json).subscribe(
          data => {
            loading.dismiss();
            if (data['status'] == "success") {
              this.content = data["html"];
            }

          });
        break;
      case 'faq':
        json = {
          action: "getfaq",
          language: this.auth.language.toUpperCase()
        }
        this.common.getStatic(json).subscribe(
          data => {
            loading.dismiss();
            if (data['status'] == "success") {
              this.content = data["html"];
            }

          });
        break;
      case 'contact':
        json = {
          action: "getcontactus",
          language: this.auth.language.toUpperCase()
        }
        this.common.getStatic(json).subscribe(
          data => {
            loading.dismiss();
            if (data['status'] == "success") {
              this.content = data["html"];
            }

          });
        break;
      default:
        break;
    }
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StaticPage');
  }
  gotoHome() {
    this.navCtrl.navigateRoot('/');
  }
  changeLang(lang) {
    this.auth.language = lang;
    this.globalEventsService.publish('app:languagechanged');
  }

}
