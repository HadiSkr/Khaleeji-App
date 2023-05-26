import { Component, ViewEncapsulation } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { CommonProvider } from '../../providers/common/common';
import { HomePage } from '../home/home';
import { GlobalEventsService } from '../../providers/observables/observable';
import { Router } from '@angular/router';

/**
 * Generated class for the StaticPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-static',
  templateUrl: 'static.html',
  styleUrls: ['./static.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StaticPage {
  page: any;
  content: any;
  constructor(public loadingCtrl: LoadingController, public globalEventsService: GlobalEventsService, public navCtrl: NavController, public router: Router, public common: CommonProvider, public auth: AuthenticationProvider) {
    this.page = router.getCurrentNavigation()?.extras.state?.['page'];
    console.log('page', this.page);
    this.loadingCtrl.create({

    }).then(loading => {
      loading.present();
    let json = {};
    switch (this.page) {
      case 'about':
        json = {
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
        json = {
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
    }
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StaticPage');
  }
  gotoHome() {
    this.navCtrl.navigateRoot('');
  }
  changeLang(lang) {
    this.auth.language = lang;
    this.globalEventsService.publish('app:languagechanged');
  }

}
