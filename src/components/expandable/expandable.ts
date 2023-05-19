import { Component, AfterViewInit, Input, ViewChild,  ElementRef, Renderer2 } from "@angular/core";
import { CommonProvider } from '../../providers/common/common';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { NavController } from '@ionic/angular';
import { DetailsPage } from '../../pages/details/details';
import { Observable } from 'rxjs';
import { Socket } from 'ng-socket-io';

/**
 * Generated class for the ExpandableComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'expandable',
  templateUrl: 'expandable.html'
})
export class ExpandableComponent  implements AfterViewInit {
  @ViewChild("expandWrapper", { read: ElementRef }) expandWrapper: ElementRef;
  @Input() item:any;
  auctions: any[];
  summary: any=[];
  purchases: any=[];
  unsold: any=[];
  invoice: any=[];
  payment: any=[];
  newauctions:any=[];

  constructor(public navCtrl: NavController, public renderer: Renderer2,public common : CommonProvider, public auth:AuthenticationProvider, public socket: Socket) {
    this.getUpdates().subscribe(message => {
      let data = message.view;
      let userId = this.auth.userId
      for(let id in data)
      {
        if(this.auctions!=undefined)
        {
          this.auctions.map(function (auc) {
            if(auc.id==id)
            {
              auc.ends=data[id][6];
              auc.current_bid=data[id][2];
              auc.num_bids=data[id][3];
              auc.highestbidder=(data[id][0]==userId)?true:false;
            }
            return auc
          });

        }
      }
    });
  }
  getUpdates(): Observable<any> {
    let observable = new Observable(observer => {
      this.socket.on('updates', (data) => {
        observer.next(JSON.parse(data));
      });
    })
    return observable;
  }
  loadImageOntheGo()
  {
    let ids:any=[];
    for(let item of this.auctions)
    {
      ids.push(item.id);
    }
    this.loadImage(ids);
  }
  loadImage(newauctions)
  {
    let data = {auctionId:newauctions}
    this.common.getImage(data).subscribe(
      data => {
        if(data['status']=="success")
        {
          //this.auctions[index].image=data["images"];
          for(let i of data['results'])
          {
            this.auctions.map((item) => {
              if(item.id==i.id)
              {
                item.image=i.images[0]
              }
            });
          }
        }
        else{
        }

      });
  }
  ngOnInit() {
    switch(this.item.tab)
    {
      case 'summary':
          this.getSummary();
      break;
      case 'mybids':
          this.getMybids();
      break;
      case 'favorite':
          this.getFavorites();
      break;
      case 'purchases':
          this.getPurchases();
      break;
      case 'unsold':
          this.getUnsold();
      break;
      case 'invoice':
          this.getInvoice();
      break;
      case 'payment':
          this.getPayment();
      break;
      default:
        break;
    }
  }
  ngAfterViewInit() {
    this.renderer.setStyle(this.expandWrapper.nativeElement, "max-height", "unset");
  }
  getSummary()
  {
    let json = {action: "getsummary", userId: this.auth.userId};
      this.common.dashboard(json).subscribe(
        data => {
          if(data['status']=="success")
          {
            for(let i in data)
            {
              this.summary.push(data[i]);
            }
            this.summary=this.summary.filter((item) => {
              return (item!=''&&item!="success");
            });
            console.log(this.summary);
          }
          else{
            this.summary=[];
          }

        });
  }
  getMybids() {
    this.newauctions=[];
    let json = {action: "getbidlist", userId: this.auth.userId};
    this.common.dashboard(json).subscribe(
      data => {
        if(data['status']=="success")
        {
          let myBids:any=[];
          for(let i in data["results"])
          {
            myBids.push(data["results"][i].id);
          }
          this.getAuctions(myBids);
        }
        else{
        }

      });
  }
  getFavorites() {
    this.newauctions=[];
    let json = {action: "getfavorites", userId: this.auth.userId};
    this.common.dashboard(json).subscribe(
      data => {
        if(data['status']=="success")
        {
          let favorites:any=[];
          for(let i in data["results"])
          {
            favorites.push(data["results"][i].id);
          }
          this.getAuctions(favorites);
        }
        else{
        }

      });
  }
  getPurchases() {
    let json = {action: "getpurchaselist", userId: this.auth.userId};
    this.common.dashboard(json).subscribe(
      data => {
        if(data['results']!=undefined)
        {
          this.purchases=data['results'];
        }
        else{
          this.purchases=[];
        }

      });
  }

  getUnsold() {
    let json = {action: "getunsoldvehiclelist", userId: this.auth.userId};
    this.common.dashboard(json).subscribe(
      data => {
        if(data['results']!=undefined)
        {
          this.unsold=data['results'];
        }
        else{
          this.unsold=[];
        }

      });
  }
  getInvoice() {
    let json = {action: "getinvoicelist", userId: this.auth.userId};
    this.common.dashboard(json).subscribe(
      data => {
        if(data['results']!=undefined)
        {
          this.invoice=data['results'];
        }
        else{
          this.invoice=[];
        }

      });
  }
  getPayment() {
    let json = {action: "getpaymentlist", userId: this.auth.userId};
    this.common.dashboard(json).subscribe(
      data => {
        if(data['results']!=undefined)
        {
          this.payment=data['results'];
        }
        else{
          this.payment=[];
        }

      });
  }
  getAuctions(auctions)
  {
    let json = {action: "getauctions",language: "EN",page: 1,perpage: 10,userId: this.auth.userId,lot_no:auctions};
    this.common.searchAuctions(json).subscribe(
      data => {
        if(data['status']=="success")
        {
          this.auctions=data["results"];
          this.auctions.map((item) => {
            item.preimage="assets/imgs/loading.gif";
          });
          this.loadImageOntheGo();
        }
        else{
          this.auctions=[];
        }

      });
  }
  gotoAuction(id)
  {
    this.navCtrl.navigateForward('/details',{
      state:{id:id}
      });
  }

}
