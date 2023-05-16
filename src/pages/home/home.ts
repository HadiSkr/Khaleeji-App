import { Component } from '@angular/core';
import { NavController,Events } from '@ionic/angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { CommonProvider } from '../../providers/common/common';
import { HybridProvider } from '../../providers/hybrid/hybrid';
import { CurrentPage } from '../current/current';
import { HybridPage } from '../hybrid/hybrid';
import { ProfilePage } from '../profile/profile';
import { RegisterPage } from '../register/register';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items: any[];
  active: any=false;
  loggedin:any=false;
  constructor(public navCtrl: NavController,public auth : AuthenticationProvider,public common : CommonProvider, public hybrid: HybridProvider,public events: Events) {
    this.getItems();
    this.hybrid.getHybridCount().subscribe(message => {
      if(message.auction_id!=0)
      {
        this.active=true;
      }
      else{
        this.active=false;
      }
    });
    if(localStorage.getItem('userId')!=undefined&&localStorage.getItem('token')!=undefined)
    {
      this.loggedin=true;
    }
  }
  ionViewDidLoad()
  {
    console.log('ionViewWillEnter');
  }
  ionViewWillEnter() {
    console.log('ionViewWillEnter');
  }
  getItems() {
    this.common.getItems().subscribe(
      data => {
        if(data['status']=="success")
        {
          this.items=data["results"];
        }

      });
  }
  next()
  {
    this.items.pop();
  }
  current(item)
  {
    this.navCtrl.push(CurrentPage,{
      item:item
      });
  }
  hybridpage()
  {
    this.navCtrl.push(HybridPage);
  }
  changeLang(lang)
  {
    this.auth.language=lang;
    this.events.publish('app:languagechanged');
  }
  gotoProfile()
  {
    this.navCtrl.push(ProfilePage);
  }
  login()
  {
    this.navCtrl.push(LoginPage);
  }
  register()
  {
    this.navCtrl.push(RegisterPage);
  }
}
