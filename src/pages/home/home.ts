import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { CommonProvider } from '../../providers/common/common';
import { HybridProvider } from '../../providers/hybrid/hybrid';
import { GlobalEventsService } from '../../providers/observables/observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items: any[];
  active: any=false;
  loggedin:any=false;
  constructor(public globalEventsService: GlobalEventsService, public navCtrl: NavController,public auth : AuthenticationProvider,public common : CommonProvider, public hybrid: HybridProvider) {
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
    this.navCtrl.navigateForward('/current',{
      state:{item:item}
      });
  }
  hybridpage()
  {
    this.navCtrl.navigateForward('/hybrid');
  }
  changeLang(lang)
  {
    this.auth.language=lang;
    this.globalEventsService.publish('app:languagechanged');
  }
  gotoProfile()
  {
    this.navCtrl.navigateForward('/profile');
  }
  login()
  {
    this.navCtrl.navigateForward('/login');
  }
  register()
  {
    this.navCtrl.navigateForward('/register');
  }
}
