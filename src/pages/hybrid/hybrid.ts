import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, Platform } from '@ionic/angular';
import { HybridProvider } from '../../providers/hybrid/hybrid';
import { LoginPage } from '../../pages/login/login';
import { HttpClient } from '@angular/common/http';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { HomePage } from '../home/home';
import * as _ from 'lodash';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { GlobalEventsService } from '../../providers/observables/observable';
import { Swiper } from 'swiper/types';
/**
 * Generated class for the HybridPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-hybrid',
  templateUrl: 'hybrid.html',
})
export class HybridPage {
  @ViewChild('slides') slides: Swiper
  price: any;
  auction_id: any;
  limit: any;
  resumeListener:Subscription=new Subscription();
  constructor(public globalEventsService: GlobalEventsService,public auth: AuthenticationProvider, public navCtrl: NavController, public navParams: NavParams, public hybrid: HybridProvider, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public socket: Socket, public http: HttpClient, public platform: Platform) {
    /* foreground and background toggle functions */
    if (this.platform.is('cordova')){

      //Subscribe on pause i.e. background
      this.platform.pause.subscribe(() => {
        console.log('pause');
      });

      //Subscribe on resume i.e. foreground
      this.resumeListener = this.platform.resume.subscribe(() => {
        console.log('resume');
      });
     }

    this.hybrid.getHybridCount().subscribe(message => {
      this.auction_id = message.auction_id;
      if (message.auction_id == 0) {
        //this.navCtrl.pop();
      }
    });
    this.getUserLimit();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HybridPage');
  }

  ionViewWillLeave() {
    this.resumeListener.unsubscribe();
  }

  getTimer() {
    return this.hybrid.getTimer();
  }
  getBox() {
    return this.hybrid.getBox();
  }
  getSpecification() {
    if (this.getBox().specification == undefined) {
      return [];
    }
    let result: any = [];
    let specification = this.getBox().specification.map(function (item) {
      for (let x in item) {
        return { key: x, value: item[x] };
      }
    });
    specification = _.groupBy(specification, function (spec) {
      return spec.key;
    });
    let features = '';
    for (let spec in specification) {
      for (let val in specification[spec]) {
        features += specification[spec][val].value + `,`;
      }
      result.push({ key: spec, value: features.slice(0, -1) })
      features = '';
    }
    return result;
  }
  getUserLimit() {
    let json;
    json = { "action": "getBidLimit", "userId": this.auth.userId };
    this.http.post('https://khaleejauction.com/newdesign/api/userpermission.php', json).subscribe(
      data => {
        if (data['status'] == "error") {
        }
        else if (data['status'] == "success") {
          this.limit = data['results'].max_bid;
        }
      });
  }
  async bid(id) {
    if (this.auth.userId == -1) {
      this.navCtrl.navigateForward('login',
        {
          state:{prev: true}
        });
      return false;
    }
    let loading = await this.loadingCtrl.create({

    });
    let ress = this.hybrid.credentials();
    let json = {
      id: id.toString(),
      limit: this.limit,
      action: "hybrid",
      bidamount: parseInt(this.auth.bidamount)
    }
    let combined = {
      ...json,
      ...ress
    };
    this.socket.emit('hybridbid', combined);
  }
  async custombid(id) {
    if (this.auth.userId == -1) {
      this.navCtrl.navigateForward('login',
        {
          state:{prev: true}
        });
      return false;
    }
    let currentprice = parseInt(this.getBox().current_bid.replace(/,/g, ''));
    if (this.price == '' || this.price == undefined) {
      this.presentToast('Please enter a bid amount');
      return false;
    }
    if (this.price % parseInt(this.auth.bidamount) != 0) {
      this.presentToast('Please enter multiple of ' + this.auth.bidamount);
      return false;
    }
    if (this.price <= currentprice) {
      this.presentToast('Please enter bid more than the price');
      return false;
    }
    let loading = await this.loadingCtrl.create({

    });
    let ress = this.hybrid.credentials();
    let json = {
      id: id.toString(),
      limit: this.limit,
      action: "hybrid",
      bidamount: this.price-currentprice
    }
    let combined = {
      ...json,
      ...ress
    };
    this.socket.emit('hybridbid', combined);
    this.price = ''
  }
  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
  gotoHome() {
    this.navCtrl.navigateRoot('');
  }
  changeLang(lang) {
    this.auth.language = lang;
    this.globalEventsService.publish('app:languagechanged');
  }
  nextSlide() {
    this.slides.slideNext();
  }
  prevSlide() {
    this.slides.slidePrev();
  }

}
