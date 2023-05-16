import { HomePage } from '../home/home';
import { Component, ViewChild } from '@angular/core';
import { Nav, NavController, NavParams, ToastController, LoadingController,Events } from '@ionic/angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

import { RegisterPage } from '../register/register';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  prev:any;
  login: { username?: string, password?: string } = {};
  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public auth : AuthenticationProvider, public toastCtrl: ToastController,public events: Events) {
    this.prev=this.navParams.get('prev');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

  }
  // go to home page
  submit(loginForm) {
    let loading = await this.loadingCtrl.create({
      message: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div></div>'
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
          this.events.publish('user:loggedin');
          if(this.prev==true)
          {
            this.navCtrl.pop();
          }
          else
          {
            this.navCtrl.setRoot(HomePage);
          }
        }
      })
  }
  presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
  register()
  {
    this.navCtrl.push(RegisterPage);
  }

}
