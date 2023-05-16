import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, Events, AlertController } from '@ionic/angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { CommonProvider } from '../../providers/common/common';
import { HttpClient } from '@angular/common/http';
import { HomePage } from '../home/home';
import { LoginPage } from '../../pages/login/login';
import { HybridPage } from '../hybrid/hybrid';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';

import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';


/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
  @ViewChild('slides') slides: ElementRef;
  id: any;
  price: any;
  auction: any = {};
  specification: any = [];
  link: any;
  hybridclosed: any = false;
  description: any = '';
  supendPriceUpdate: any = false;
  constructor(public socialSharing: SocialSharing, public sanitizer: DomSanitizer, public navCtrl: NavController, public auth: AuthenticationProvider, public common: CommonProvider, public navParams: NavParams, public socket: Socket, public nav: Nav, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public events: Events, public alertCtrl: AlertController, public http: HttpClient) {
    this.id = this.navParams.get('id');
    this.getDetails(this.id);
    this.getUpdates().subscribe(message => {
      let data = message.view;
      let temp: any = [];
      for (let item in data) {
        temp.push(item);
      }
      this.hybridclosed = (temp.includes(this.id)) ? false : true;
      let userId = this.auth.userId
      for (let id in data) {
        if (this.auction != undefined) {
          if (this.auction.id == id) {
            this.auction.ends = data[id][6];
            if (!this.supendPriceUpdate) {
              this.auction.current_bid = data[id][2];
              this.auction.highestbidder = (data[id][0] == userId) ? true : false;
            }
            this.auction.num_bids = data[id][3];
            this.auction.autobid_amount = data[id][7];
            this.auction.autobid_id = data[id][4];
          }

        }
      }
    });
    events.subscribe('app:languagechanged', () => {
      this.getDetails(this.id);
    });
  }
  checkHybridActive() {
    if (this.auction.ends <= 0) {
      if (this.hybridclosed == false) {
        //got ot hybrid page
        this.navCtrl.push(HybridPage);
        return true;
      }
      else {
        //alert bid closed
        this.presentToast('This auction is closed');
        return false;
      }
    }
    else {
      return false;
    }
  }
  favorite() {
    let json;
    if (this.auth.userId == -1) {
      this.navCtrl.push(LoginPage,
        {
          prev: true
        });
      return false;
    }
    if (this.auction.favourite == false) {
      json = { action: "addFavourite", auctionId: this.id, userId: this.auth.userId };
    }
    else {
      json = { action: "deleteFavourite", auctionId: this.id, userId: this.auth.userId };
    }
    this.common.favorite(json).subscribe(
      data => {
        if (data["status"] == "success") {
          this.auction.favourite = !this.auction.favourite;
        }
      });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsPage');
  }
  async getDetails(id) {
    let loading = await this.loadingCtrl.create({
      message: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div></div>'
    });
    loading.present();
    this.common.carDetails(id, this.auth.userId).subscribe(
      data => {
        loading.dismiss();
        this.auction = data["results"];
        this.loadMap(this.auction);
        this.loadSpecification();
      });
  }
  loadSpecification() {
    this.specification = [];
    this.description = "";
    let specification = this.auction.specification.map(function (item) {
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
        this.description += specification[spec][val].value + `,`;
      }
      this.specification.push({ key: spec, value: features.slice(0, -1) })
      this.description = this.description.slice(0, -1)
      features = '';
    }
  }
  getUpdates(): Observable<any> {
    let observable = new Observable(observer => {
      this.socket.on('updates', (data) => {
        observer.next(JSON.parse(data));
      });
    })
    return observable;
  }
  shareMe() {
    console.log(this.getUrl(this.auction.title,this.auction.year,this.id));
    let options = {
      message: this.auction.title,
      url: this.getUrl(this.auction.title,this.auction.year,this.id)
    };
    this.socialSharing.shareWithOptions(options);
  }
  getUrl(title: any, year: any, id: any) {
    var title = title.replace(/\s+/g, '-');
    title = title.replace(".", "-");
    title = title + "-" + year;
    return `https://khaleejauction.com/cars/` + title + `/` + id + `/`;
  }
  loadMap(details) {
    this.link = this.sanitizer.bypassSecurityTrustResourceUrl('https://maps.google.com/maps?q=' + details.latitude + ', ' + details.longitude + '&z=15&output=embed');
  }
  gotoHome() {
    this.nav.setRoot(HomePage);
  }
  nextSlide() {
    this.slides.nativeElement.slideNext();
  }
  prevSlide() {
    this.slides.nativeElement.slidePrev();
  }
  bid() {
    let json;
    if (this.auth.userId == -1) {
      this.navCtrl.push(LoginPage,
        {
          prev: true
        });
      return false;
    }
    if (this.checkHybridActive() == false) {
      let json;
      let bidlimit;
      /* suspend price update till the api returns */
      this.supendPriceUpdate = true;
      /* set this user as highest bidder */
      this.auction.highestbidder = true;
      /* update the current price with the bidamount before the api calls for faster experience */
      this.auction.current_bid = parseFloat(this.auction.current_bid.replace(/,/g, '')) + parseFloat(this.auth.bidamount)

            json = { "userId": this.auth.userId, "bidamount": parseInt(this.auth.bidamount), "id": this.id.toString(), "cst": "new", "action": "bid" };
            this.common.bid(json).subscribe(
              data => {
                /* removing the suspension of updating price */
                this.supendPriceUpdate = false;
                if (data['status'] == "success") {
                  //this.presentToast('You bid was success.');
                }
                else {
                  this.presentToast('You cannot bid any further. Your security deposit has been consumed.');
                }

              });

    }

  }
  custombid() {
    if (this.auth.userId == -1) {
      this.navCtrl.push(LoginPage,
        {
          prev: true
        });
      return false;
    }

    if (this.checkHybridActive() == false) {

      let currentprice = parseInt(this.auction.current_bid.replace(/,/g, ''));
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

      let json;
      let bidlimit;
      json = { "action": "getBidLimit", "userId": this.auth.userId };
      this.http.post('https://khaleejauction.com/newdesign/api/userpermission.php', json).subscribe(
        data => {
          if (data['status'] == "error") {

          }
          else if (data['status'] == "success") {
            bidlimit = data['results'].max_bid;

            /* suspend price update till the api returns */
            this.supendPriceUpdate = true;
            /* set this user as highest bidder */
            this.auction.highestbidder = true;
            /* update the current price with the bidamount before the api calls for faster experience */
            this.auction.current_bid = parseFloat(this.auction.current_bid.replace(/,/g, '')) + parseFloat(this.auth.bidamount)
            json = { "userId": this.auth.userId, "bidamount": this.price - currentprice, "limit": bidlimit, "id": this.id.toString(), "cst": "new", "action": "bid" };
            this.common.bid(json).subscribe(
              data => {
                /* removing the suspension of updating price */
                this.supendPriceUpdate = false;
                if (data['status'] == "success") {
                  this.presentToast('You bid was success.');
                  this.price = '';
                }
                else {
                  this.presentToast('You cannot bid any further. Your security deposit has been consumed.');
                }

              });


          }
        });



    }
  }
  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
  async showAutoBidPrompt() {
    if (this.auth.userId == -1) {
      this.navCtrl.push(LoginPage,
        {
          prev: true
        });
      return false;
    }
    const prompt = await this.alertCtrl.create({
      header: 'Auto Bid',
      message: "Enter maximum bid",
      inputs: [
        {
          name: 'amount',
          placeholder: 'Bid amount'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit',
          handler: data => {
            console.log(data);
            this.autoBid(data.amount);
          }
        }
      ]
    });
    prompt.present();
  }
  async autoBid(amount) {

    let loading = await this.loadingCtrl.create({
      message: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div></div>'
    });
    loading.present();
    let json = { "maxBid": amount, "userId": this.auth.userId, "id": this.id.toString() };
    this.common.autoBid(json).subscribe(
      data => {
        loading.dismiss();
        if (data['status'] == "success") {
          this.presentToast(data['msg']);
          if (this.auction.highestbidder == false) {
            this.bid();
          }
        }
        else {
          this.presentToast(data['msg']);
        }

      });
  }
  async showAutoBidCancelConfirm() {
    const confirm = await this.alertCtrl.create({
      header: 'Cancel Auto Bid.',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.autoBidCancel();
          }
        }
      ]
    });
    confirm.present();
  }
  async autoBidCancel() {

    let loading = await this.loadingCtrl.create({
      message: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div></div>'
    });
    loading.present();
    let json = { "userId": this.auth.userId, "id": this.id.toString() };
    this.common.autoBidCancel(json).subscribe(
      data => {
        loading.dismiss();
        if (data['status'] == "success") {
          this.presentToast(data['msg']);

        }
        else {
          this.presentToast(data['msg']);
        }

      });
  }
  changeLang(lang) {
    this.auth.language = lang;
    this.events.publish('app:languagechanged');
  }

}
