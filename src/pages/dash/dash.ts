import { Component } from '@angular/core';
import { MenuController, NavController, NavParams } from '@ionic/angular';
import { HomePage } from '../home/home';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { TranslateService } from '@ngx-translate/core';
import { GlobalEventsService } from '../../providers/observables/observable';
import { Router } from '@angular/router';


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
  constructor(public globalEventsService: GlobalEventsService,public translate: TranslateService, public menuCtrl: MenuController,public navCtrl: NavController, public router: Router, public auth:AuthenticationProvider) {
    let navState = router.getCurrentNavigation()?.extras.state ?? {};
    this.items = [
      { title:'',expanded: false, tab:"mybids" },
      { title:'',expanded: false, tab:"favorite" },
      { title:'',expanded: false, tab:"purchases" },
      { title:'',expanded: false, tab:"unsold"  },
      { title:'',expanded: false, tab:"invoice"  },
      { title:'',expanded: false, tab:"payment"  }
    ];
    if(navState['tab'])
    {
      this.dropTab(navState['tab']);
    }
    this.applyLanguage();
    const _this = this;
    globalEventsService.getObservable().subscribe({
      next(position) {
        if(position == 'app:languagechanged'){
          _this.translate.setDefaultLang(_this.auth.language);
          _this.applyLanguage();
        }
      },
      error(msg) {
        console.log('Error Getting Location: ', msg);
      }
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
  toggleMenu(){
    this.menuCtrl.toggle();
  }
  gotoHome()
  {
    this.navCtrl.navigateRoot('');
  }
  changeLang(lang)
  {
    this.auth.language=lang;
    this.globalEventsService.publish('app:languagechanged');
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
