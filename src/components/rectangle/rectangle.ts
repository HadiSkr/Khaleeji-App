import { Component,Input } from '@angular/core';
import { CommonProvider } from '../../providers/common/common';
import { DetailsPage } from '../../pages/details/details';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import {LoadingController, ToastController, NavController, AlertController} from '@ionic/angular';

/**
 * Generated class for the RectangleComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'rectangle',
  templateUrl: 'rectangle.html'
})
export class RectangleComponent {

  auction: any={};
  price: any;
  @Input() step: any;
  constructor(public navCtrl: NavController,public loadingCtrl: LoadingController, public toastCtrl: ToastController,public alertCtrl: AlertController,public auth:AuthenticationProvider,public common : CommonProvider) {

  }
  ngOnInit() {
    this.auction = this.step;
  }
  async bid(id)
  {
    if(this.auth.userId==-1)
    {
      this.navCtrl.navigateForward('/login');
      return false;
    }
    let loading = await this.loadingCtrl.create({
      message: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div></div>'
    });
    loading.present();
    let json = {"userId" : this.auth.userId,"bidamount" : 500,"limit":this.auth.bidlimit, "id": id.toString(),"cst":"new","action":"bid"};
    this.common.bid(json).subscribe(
      data => {
        loading.dismiss();
        if(data['status']=="success")
        {
            console.log(this.auction);
          this.presentToast('You bid was success.');
        }
        else{
          this.presentToast('You cannot bid any further. Your security deposit has been consumed.');
        }

      });
  }
  favorite(auc) {
      if(this.auth.userId==-1)
      {
          this.navCtrl.navigateForward('/login');
          return false;
      }
      /*let loading = await this.loadingCtrl.create({
          message: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div></div>'
      });

      loading.present();*/
      let json;
      if (auc.favourite == false) {
          json = { action: "addFavourite", auctionId: auc.id.toString(), userId: this.auth.userId };
          this.auction['favourite'] = true;
      }
      else {
          json = { action: "deleteFavourite",auctionId: auc.id.toString(), userId: this.auth.userId  };
          this.auction['favourite'] = false;
      }
      this.common.favorite(json).subscribe(
          data => {
              //loading.dismiss();
              if (data["status"] == "success") {

              }
          });
  }
    async showAutoBidPrompt(auc) {
        if (this.auth.userId == -1) {
            this.navCtrl.navigateForward('/login',
                {
                    state:{prev: true}
                });
            return false;
        }
        if(this.auction.autobidder){
            this.showAutoBidCancelConfirm();
        }else{
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
                            //console.log('Cancel clicked');
                        }
                    },
                    {
                        text: 'Submit',
                        handler: data => {
                            this.autoBid(data.amount,auc);
                        }
                    }
                ]
            });
            prompt.present();
        }

    }
    autoBid(amount,auc) {

        /*let loading = await this.loadingCtrl.create({
            message: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div></div>'
        });
        loading.present();*/
        this.presentToast('Auto Bid has been activated');
        let json = { "maxBid": amount, "userId": this.auth.userId, "id": auc.id.toString() };
        this.common.autoBid(json).subscribe(
            data => {
                //loading.dismiss();
                if (data['status'] == "success") {
                    //this.presentToast(data['msg']);
                    if (this.auction.highestbidder == false) {
                        this.bid(this.auction.id);
                    }
                }
                else {
                    this.presentToast(data['msg']);
                }

            });
    }
    async showAutoBidCancelConfirm() {
      //console.log(this.auction);
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
    autoBidCancel() {
        //this.presentToast(data['msg']);
        //console.log(this.auction);
        /*let loading = await this.loadingCtrl.create({
            message: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div></div>'
        });
        loading.present();*/
        this.presentToast('Auto Bid was cancelled');
        let json = { "userId": this.auth.userId, "id": this.auction.id.toString() };
        this.common.autoBidCancel(json).subscribe(
            data => {
                //loading.dismiss();
                if (data['status'] == "success") {
                    //this.presentToast(data['msg']);

                }
                else {
                    this.presentToast(data['msg']);
                }

            });
    }
  async custombid(id)
  {
    if(this.auth.userId==-1)
    {
      this.navCtrl.navigateForward('/login');
      return false;
    }
    let currentprice= parseInt(this.auction.current_bid.replace(/,/g, ''));
    if(this.price==''||this.price==undefined)
    {
      this.presentToast('Please enter a bid amount');
      return false;
    }
    if(this.price%500!=0)
    {
      this.presentToast('Please enter multiple of 500');
      return false;
    }
    if(this.price<=currentprice)
    {
      this.presentToast('Please enter bid more than the price');
      return false;
    }
    let loading = await this.loadingCtrl.create({
      message: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div></div>'
    });
    loading.present();
    let json = {"userId" : this.auth.userId,"bidamount" : this.price-currentprice,"limit":this.auth.bidlimit, "id": id.toString(),"cst":"new","action":"bid"};
     this.common.bid(json).subscribe(
      data => {
        loading.dismiss();
        if(data['status']=="success")
        {
          this.presentToast('You bid was success.');
          this.price='';
        }
        else{
          this.presentToast('You cannot bid any further. Your security deposit has been consumed.');
        }

      });
  }
  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
  gotoDetails(id)
  {
    this.navCtrl.navigateForward('/details',{
      state:{id:id}
      });
  }

}
