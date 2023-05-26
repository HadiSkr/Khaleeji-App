import { Component, ViewChild } from '@angular/core';
import { NavController, PopoverController, LoadingController, IonContent, Platform } from '@ionic/angular';
import { CommonProvider } from '../../providers/common/common';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { HomePage } from '../home/home';
import { FilterComponent } from '../../components/filter/filter';
import { DropdownComponent } from '../../components/dropdown/dropdown';
import { Socket } from 'ngx-socket-io';
import { Subject, Subscription } from 'rxjs';
import { ProfilePage } from '../profile/profile';
import { LoginPage } from '../../pages/login/login';
import { DashPage } from '../../pages/dash/dash';
import { HybridPage } from '../../pages/hybrid/hybrid';
import { GlobalEventsService } from '../../providers/observables/observable';
import { Router } from '@angular/router';

/**
 * Generated class for the CurrentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-current',
  templateUrl: 'current.html',
  styleUrls: ['./current.scss']
})
export class CurrentPage {
  @ViewChild(IonContent) content: IonContent;
  auctions: any[] = [];
  enddates: any = [];
  newauctions: any = [];
  itemType: number;
  totalauctions: number;
  view: any = "list";
  instagram: any = false;
  resumeListener:Subscription=new Subscription();
  data: any = { action: "getauctions", language: "EN", page: 1, perpage: 50, userId: this.auth.userId };
  constructor(public globalEventsService: GlobalEventsService, public loadingCtrl: LoadingController, public popoverCtrl: PopoverController, public auth: AuthenticationProvider, public navCtrl: NavController, public router: Router, public common: CommonProvider, public socket: Socket, public platform: Platform) {
    let navParams = router.getCurrentNavigation()?.extras.state;
    /* foreground and background toggle functions */
    if (this.platform.is('cordova')) {

      //Subscribe on pause i.e. background
      this.platform.pause.subscribe(() => {
        console.log('pause');
      });

      //Subscribe on resume i.e. foreground
      this.resumeListener = this.platform.resume.subscribe(() => {
        this.getAuctions();
        this.getEndDates();
      });
    }
    this.data.itemType = navParams?.['item']?.id;
    this.totalauctions = navParams?.['item']?.count;
    this.getAuctions();
    this.getEndDates();
    this.getUpdates().subscribe((message:any) => {
      let data = message.view;
      let userId = this.auth.userId
      for (let id in data) {
        if (this.auctions != undefined) {
          let self = this;
          this.auctions.map(function (auc) {
            if (auc.id == id) {
              auc.ends = data[id][6];
              auc.current_bid = data[id][2];
              auc.num_bids = data[id][3];
              auc.highestbidder = (data[id][0] == userId) ? true : false;
              auc.autobidder = (data[id][4] == userId) ? true : false;
              auc.instagram = self.instagram;
            }
            return auc
          });

        }
      }
    });
  }
  contentResize() {
    let self = this;
    setTimeout(function () { self.content.fullscreen }, 250);

  }
  logScrolling(event) {
    //this.loadImageOntheGo(event.scrollTop);
  }
  changeInsta() {
    this.instagram = !this.instagram;
  }
  loadImageOntheGo(position) {
    let height!: number, col!: number, item!: number, current!: number, newauctions: any = [];

    if (this.view == 'grid') {
      height = 185;
      col = 2;
      item = 30;
    }
    else if (this.view == 'list') {
      height = 145;
      col = 1;
      item = 30;
    }
    current = (Math.trunc(position / height) * col) + 1;
    for (let i = 0; i < current + item; i++) {
      if (this.auctions[i] != undefined) {
        if (this.newauctions.indexOf(this.auctions[i].id) === -1) {
          newauctions.push(this.auctions[i].id);
          this.newauctions.push(this.auctions[i].id);
        }
      }
    }
    if (newauctions.length > 0)
      this.loadImage(newauctions);
  }
  loadImage(newauctions) {
    /* changing arry structure */
    let newa: any[] = [];
    newauctions.map(function (a) {
      newa.push(a.id);
    })
    let data = { auctionId: newa }
    this.common.getImage(data).subscribe(
      data => {
        console.log(data['results']);
        if (data['status'] == "success") {
          //this.auctions[index].image=data["images"];
          for (let i of data['results']) {
            this.auctions.map((item) => {
              if (item.id == i.id) {
                item.image = i.images[0]
              }
            });
          }
        }
        else {
        }

      });
  }
  changeView() {
    if (this.view == 'grid')
      this.view = 'list'
    else
      this.view = 'grid'
  }
  goto(page) {
    if (this.auth.userId == -1) {
      this.navCtrl.navigateForward('login',
        {
          state:{prev: true}
        });
      return false;
    }
    this.navCtrl.navigateForward('dash', {state: { tab: page }});

  }
  gotoHybrid() {
    this.navCtrl.navigateForward('hybrid');
  }
  gotoProfile() {
    this.navCtrl.navigateForward('profile');
  }
  async getAuctions() {
    this.newauctions = [];

    let loading = await this.loadingCtrl.create({

    });
    if(this.auctions.length == 0)
    {
      loading.present();
    }
    this.common.getAuctions(this.data).subscribe(
      data => {
        loading.dismiss();
        if (data['status'] == "success") {
          if (data["results"] != undefined) {
            let auctions = data["results"];
            this.auctions = [...this.auctions, ...auctions];
            //this.loadImageOntheGo(0);
            //this.loadImage(this.auctions);
            this.data.page++;
            if (this.auctions.length < this.totalauctions) {
              this.getAuctions();
            }
          }
        }
        else {
          this.auctions = [];
        }

      });
  }
  ionViewWillLeave() {
    this.resumeListener.unsubscribe();
  }
  async searchAuctions(json) {
    this.newauctions = [];
    this.data = { action: "getauctions", language: "EN", page: 1, perpage: 50, userId: this.auth.userId };
    let loading = await this.loadingCtrl.create({

    });
    loading.present();
    this.data = {
      ...json,
      ...this.data
    };
    this.common.searchAuctions(this.data).subscribe(
      data => {
        loading.dismiss();
        if (data['status'] == "success") {
          if (data["results"] != undefined) {
            this.auctions = data["results"];
            this.auctions.map((item) => {
              item.preimage = "assets/imgs/loading.gif";
            });
            //this.loadImageOntheGo(0);
            this.loadImage(this.auctions);
            this.data.page++;
          }
        }
        else {
          this.auctions = [];
        }

      });
  }
  getEndDates() {
    this.common.getItems().subscribe(
      data => {
        if (data['status'] == "success") {

          for (let item in data['results']) {
            if (data['results'][item].id == this.data.itemType && data["results"][item].sub != "") {
              this.enddates = data["results"][item].sub;
              this.enddates.push({ enddate: "All", totitems: data["results"][item].count, active: true });
            }
          }
        }

      });
  }
  end() {
    return this.enddates.filter((item) => {
      return (item.active == true);
    });
  }
  getUpdates(){
    let observable = new Subject();
      this.socket.on('updates', (data) => {
        observable.next(JSON.parse(data));
      });
    return observable;
  }
  async presentPopover(myEvent) {
    let popover = await this.popoverCtrl.create({
      component: FilterComponent,
      cssClass: 'filter-popover'});
    popover.present(myEvent);
    popover.onDidDismiss().then(order => {
      if (order != null) {
        console.log(order);
        this.searchAuctions(order);
      }
    });
  }
  async presentEndPopover(myEvent) {
    let popover = await this.popoverCtrl.create({
      component: DropdownComponent,
      cssClass: 'dropdown-popover'});
    popover.present(myEvent);
    popover.onDidDismiss().then(order => {
      if (order != null) {
        this.enddates.map((item) => {
          if (item.enddate == order.data.enddate) {
            item.active = true;
          }
          else {
            item.active = false;
          }
        });
        this.searchAuctions({ auctionenddate: order.data.duration });
      }
    });
  }

  doInfinite(infiniteScroll) {

    this.common.getAuctions(this.data).subscribe(
      data => {
        if (data['status'] == "success") {
          if (data["results"] != undefined) {
            this.auctions = this.auctions.concat(data["results"]);
            this.data.page++;
          }
        }
        else {

        }
        infiniteScroll.complete();

      });
  }
  gotoHome() {
    this.navCtrl.navigateRoot('');
  }
  changeLang(lang) {
    this.auth.language = lang;
    this.globalEventsService.publish('app:languagechanged');
  }

}
