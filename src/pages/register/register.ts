import { Component, ViewEncapsulation } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from '@ionic/angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LoginPage } from '../login/login';
import { NgForm } from '@angular/forms';

import { GlobalEventsService } from '../../providers/observables/observable';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  styleUrls: ['./register.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterPage {
  countries: any
  timezones: any
  todo: any = {};
  type: any = 'i';
  constructor(public globalEventsService: GlobalEventsService, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public auth: AuthenticationProvider, public navCtrl: NavController) {
    // fetch('./assets/countries.ts').then(res => res.json())
    // .then(json => {
    //   console.log(json)
    //   this.countries = json;
    //   this.todo.country='United Arab Emirates';
    // });
    // fetch('./assets/timezone.ts').then(res => res.json())
    // .then(json => {
    //   this.timezones = json;
    //   this.todo.timezone='4';
    // });
    this.todo['type'] = 'individual';
  }

  ionViewDidLoad() {
  }

  async logForm(data) {
    let inputs = data.value;
    inputs.newsletter = 0;
    inputs.language = 'EN';
    inputs.action = 'register';
    let loading = await this.loadingCtrl.create({

    });
    loading.present();
    this.auth.register(inputs).subscribe(
      data => {
        loading.dismiss();
        console.log(data);
        if (data['status'] == "error") {
          this.presentToast(data['msg'])
        }
        else if (data['status'] == "success") {
          this.presentToast(data['msg'])
          this.navCtrl.navigateForward('login');
        }
      })
  }
  onChangeType(type: string) {
    this.type = type == 'individual' ? 'i' : 'o';
  }
  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
  changeLang(lang) {
    this.auth.language = lang;
    this.globalEventsService.publish('app:languagechanged');
  }

}
