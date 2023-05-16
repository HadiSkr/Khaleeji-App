import { Component } from '@angular/core';
import { NavController, NavParams, Nav, Events } from '@ionic/angular';
import { HomePage } from '../home/home';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { TranslateService } from '@ngx-translate/core';


/**
 * Generated class for the DashPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-dash',
  templateUrl: 'dash.html',
})
export class DashPage {
  items: any = [];
  constructor(public translate: TranslateService,public navCtrl: NavController, public navParams: NavParams, public nav:Nav, public auth:AuthenticationProvider, public events: Events) {

    this.items = [
      { title:'',expanded: false, tab:"mybids" },
      { title:'',expanded: false, tab:"favorite" },
      { title:'',expanded: false, tab:"purchases" },
      { title:'',expanded: false, tab:"unsold"  },
      { title:'',expanded: false, tab:"invoice"  },
      { title:'',expanded: false, tab:"payment"  }
    ];
    if(this.navParams.get('tab'))
    {
      this.dropTab(this.navParams.get('tab'));
    }
    this.applyLanguage();
    events.subscribe('app:languagechanged',()=>{
      this.translate.setDefaultLang(this.auth.language);
      this.applyLanguage();
    });
  }
  dropTab(tab)
  {
    this.items.map((item) => {
      if(item.tab==tab)
      {
        item.expanded=true;
      }
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DashPage');
  }
  expandItem(item): void {
    if (item.expanded) {
      item.expanded = false;
    } else {
      this.items.map(listItem => {
        if (item == listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
        }
        return listItem;
      });
    }
  }
  gotoHome()
  {
    this.nav.setRoot(HomePage);
  }
  changeLang(lang)
  {
    this.auth.language=lang;
    this.events.publish('app:languagechanged');
  }
  applyLanguage()
  {
    this.translate.get('dash.mybids').subscribe( value => { this.items.map(item => { if(item.tab=='mybids'){ item.title = value } }) })
    this.translate.get('dash.favorite').subscribe( value => { this.items.map(item => { if(item.tab=='favorite'){ item.title = value } }) })
    this.translate.get('dash.purchases').subscribe( value => { this.items.map(item => { if(item.tab=='purchases'){ item.title = value } }) })
    this.translate.get('dash.unsold').subscribe( value => { this.items.map(item => { if(item.tab=='unsold'){ item.title = value } }) })
    this.translate.get('dash.invoice').subscribe( value => { this.items.map(item => { if(item.tab=='invoice'){ item.title = value } }) })
    this.translate.get('dash.payment').subscribe( value => { this.items.map(item => { if(item.tab=='payment'){ item.title = value } }) })

  }

}
