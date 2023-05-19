import { Component, Inject } from '@angular/core';
import { MenuController, NavController, Platform, ToastController } from '@ionic/angular';
import { Network } from '@capacitor/network';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationProvider } from 'src/providers/authentication/authentication';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { HomePage } from 'src/pages/home/home';
import { StaticPage } from 'src/pages/static/static';
import { DashPage } from 'src/pages/dash/dash';
import { ProfilePage } from 'src/pages/profile/profile';
import { GlobalEventsService } from '../providers/observables/observable';
import { DOCUMENT } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { LoginPage } from 'src/pages/login/login';

register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  rootPage: any = HomePage;
  userName: any;
  param: any;
  side: any;

  pages: Array<{ title: string, component: any, page: string }>;

  constructor(
    @Inject(DOCUMENT) private doc,
    public navCtrl: NavController,
    public globalEventsService: GlobalEventsService,
    public toastCtrl: ToastController, public translate: TranslateService, public menuCtrl: MenuController, public platform: Platform, public auth: AuthenticationProvider
  ) {
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.translate.setDefaultLang(this.auth.language);
    this.setDirection();
    this.auth.setSecretKey();
    this.auth.setSettings();
    this.userName = this.auth.userName;
    this.param = { value: this.userName }
    this.pages = [
      { title: '', component: HomePage, page: "home" },
      { title: '', component: StaticPage, page: "about" },
      { title: '', component: StaticPage, page: "terms" },
      { title: '', component: StaticPage, page: "privacy" },
      { title: '', component: StaticPage, page: "disclaimer" },
      { title: '', component: StaticPage, page: "faq" },
      { title: '', component: StaticPage, page: "contact" }
    ];
    this.applyLanMenu();
    const _this = this;
    globalEventsService.getObservable().subscribe({
      next(position) {
        switch (position) {
          case 'user:loggedin':
            _this.pages = [
              { title: '', component: HomePage, page: "home" },
              { title: '', component: DashPage, page: "dashboard" },
              { title: '', component: ProfilePage, page: "profile" },
              { title: '', component: StaticPage, page: "about" },
              { title: '', component: StaticPage, page: "terms" },
              { title: '', component: StaticPage, page: "privacy" },
              { title: '', component: StaticPage, page: "disclaimer" },
              { title: '', component: StaticPage, page: "faq" },
              { title: '', component: StaticPage, page: "contact" },
              { title: '', component: "logout", page: "logout" }
            ];
            break;
          case 'user:loggedout':
            _this.pages = [
              { title: '', component: HomePage, page: "home" },
              { title: '', component: StaticPage, page: "about" },
              { title: '', component: StaticPage, page: "terms" },
              { title: '', component: StaticPage, page: "privacy" },
              { title: '', component: StaticPage, page: "disclaimer" },
              { title: '', component: StaticPage, page: "faq" },
              { title: '', component: LoginPage, page: "contact" }
            ];
            break;
          case 'user:profileupdated':
            _this.userName = _this.auth.userName;
            _this.param = { value: _this.userName };
            break;
          case 'app:languagechanged':
            _this.translate.setDefaultLang(_this.auth.language);
            _this.setDirection();

        }
        _this.applyLanMenu();
      },
      error(msg) {
        console.log('Error Getting Location: ', msg);
      }
    });

    this.auth.isLogin();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.setBackgroundColor({ color: '#005495' });
      SplashScreen.hide();
      // watch network for a disconnection

      Network.addListener("networkStatusChange", async (e) => {
        if (!e.connected) {
          await this.presentToast('No network connection');

        }
      });
    });
  }
  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
  setDirection() {
    if (this.auth.language == 'en') {
      this.side = "left";
      this.doc.dir = 'ltr';
    }
    else {
      this.doc.dir = 'rtl';
      this.side = "right";
    }
  }
  applyLanMenu() {
    this.translate.get('menus.home').subscribe(value => { this.pages.map(item => { if (item.page == 'home') { item.title = value } }) })
    this.translate.get('menus.about').subscribe(value => { this.pages.map(item => { if (item.page == 'about') { item.title = value } }) })
    this.translate.get('menus.terms').subscribe(value => { this.pages.map(item => { if (item.page == 'terms') { item.title = value } }) })
    this.translate.get('menus.privacy').subscribe(value => { this.pages.map(item => { if (item.page == 'privacy') { item.title = value } }) })
    this.translate.get('menus.disclaimer').subscribe(value => { this.pages.map(item => { if (item.page == 'disclaimer') { item.title = value } }) })
    this.translate.get('menus.share').subscribe(value => { this.pages.map(item => { if (item.page == 'share') { item.title = value } }) })
    this.translate.get('menus.contact').subscribe(value => { this.pages.map(item => { if (item.page == 'contact') { item.title = value } }) })
    this.translate.get('menus.faq').subscribe(value => { this.pages.map(item => { if (item.page == 'faq') { item.title = value } }) })
    this.translate.get('menus.dashboard').subscribe(value => { this.pages.map(item => { if (item.page == 'dashboard') { item.title = value } }) })
    this.translate.get('menus.profile').subscribe(value => { this.pages.map(item => { if (item.page == 'profile') { item.title = value } }) })
    this.translate.get('menus.logout').subscribe(value => { this.pages.map(item => { if (item.page == 'logout') { item.title = value } }) })
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component == "logout") {
      this.auth.logout();
      this.globalEventsService.publish('user:loggedout');
      this.globalEventsService.publish('user:profileupdated');
      localStorage.clear();
      this.navCtrl.navigateRoot('/');
    }
    else if (page.page != null) {
      this.navCtrl.navigateForward(page.link, {
        state: {
          page: page.page
        }
      });
    }
    else {
      this.navCtrl.navigateForward(page.link);
    }
  }
  openLoginPage() {
    this.navCtrl.navigateRoot('/login');
    this.menuCtrl.close();
  }
}
