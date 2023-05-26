import { HomePage } from '../home/home';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from '@ionic/angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

import { RegisterPage } from '../register/register';
import { GlobalEventsService } from '../../providers/observables/observable';
import { Router } from '@angular/router';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginPage {
  prev:any;
  login: { username?: string, password?: string } = {};
  constructor(public globalEventsService: GlobalEventsService, public loadingCtrl: LoadingController, public navCtrl: NavController, public router: Router, public auth : AuthenticationProvider, public toastCtrl: ToastController) {
    this.prev=router.getCurrentNavigation()?.extras.state?.['prev'];
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

  }
  // go to home page
  async submit(loginForm) {
    let loading = await this.loadingCtrl.create({

    });
    loading.present();
    this.auth.login(loginForm.value).subscribe(
      data => {
      loading.dismiss();
        console.log(data);
        if(data['status']=="error")
        {
          this.presentToast(data['msg'])
        }
        else if(data['status']=="success")
        {
          this.auth.setUser(data['userid']);
          this.auth.setToken(data['token']);
          this.auth.saveAuth(data['userid'],data['token']);
          /* this.navCtrl.push(HomePage, {
            item: '2'
          }); */
          this.globalEventsService.publish('user:loggedin');
          if(this.prev==true)
          {
            this.navCtrl.pop();
          }
          else
          {
            this.navCtrl.navigateRoot('', {replaceUrl: true});
          }
        }
      })
  }
  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
  register()
  {
    this.navCtrl.navigateForward('register');
  }

  changeLang(lang) {
    this.auth.language = lang;
    this.globalEventsService.publish('app:languagechanged');
  }
}


// message: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div></div>'
