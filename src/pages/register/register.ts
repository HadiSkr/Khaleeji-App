import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from '@ionic/angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LoginPage } from '../login/login';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  countries: any
  timezones: any
  todo:any={};
  type:any='i';
  constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController, public auth : AuthenticationProvider, public navCtrl: NavController, public navParams: NavParams) {
    fetch('./assets/countries.ts').then(res => res.json())
    .then(json => {
      console.log(json)
      this.countries = json;
      this.todo.country='United Arab Emirates';
    });
    fetch('./assets/timezone.ts').then(res => res.json())
    .then(json => {
      this.timezones = json;
      this.todo.timezone='4';
    });
    this.todo.type='individual';
  }

  ionViewDidLoad() {
  }

  logForm(data) {
    let inputs = data.value;
    inputs.newsletter=0;
    inputs.language='EN';
    inputs.action = 'register';
    let loading = await this.loadingCtrl.create({
      message: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div></div>'
    });
    loading.present();
    this.auth.register(inputs).subscribe(
      data => {
      loading.dismiss();
        console.log(data);
        if(data['status']=="error")
        {
          this.presentToast(data['msg'])
        }
        else if(data['status']=="success")
        {
          this.presentToast(data['msg'])
          this.navCtrl.push(LoginPage);
        }
      })
  }
  onChangeType()
  {
    this.type=(this.todo.type=='individual')?'i':'o';
  }
  presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

}
