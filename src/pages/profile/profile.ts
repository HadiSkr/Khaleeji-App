import { Component } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { CommonProvider } from '../../providers/common/common';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { HomePage } from '../home/home';
import { GlobalEventsService } from '../../providers/observables/observable';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  profile:any={};
  constructor(public globalEventsService: GlobalEventsService, public navCtrl: NavController, public navParams: NavParams,public common : CommonProvider, public auth:AuthenticationProvider) {
    this.getMydata();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
  getMydata() {
    let json = {action: "getprofile", userId: this.auth.userId};
    this.common.dashboard(json).subscribe(
      data => {
        if(data['results']!=undefined)
        {
          this.profile=data['results'];
          console.log(this.profile.realname);
          this.profile.realname = data['results'].realname;
          this.profile.username=data['results'].username
          this.profile.email=data['results'].email
          this.profile.dob=data['results'].dob
          this.profile.address=data['results'].address
          this.profile.city=data['results'].city
          this.profile.prov=data['results'].prov
          this.profile.country=data['results'].country
          this.profile.zip=data['results'].zip
          this.profile.phone=data['results'].phone
          this.profile.emiratesid=data['results'].emiratesid
        }
        else{
          this.profile={};
        }

      });
  }
  changeLang(lang)
  {
    this.auth.language=lang;
    this.globalEventsService.publish('app:languagechanged');
  }
  gotoHome()
  {
    this.navCtrl.navigateRoot('');
  }
}
