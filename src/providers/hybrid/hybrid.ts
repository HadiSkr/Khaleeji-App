import { HttpClient } from '@angular/common/http';

import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { AuthenticationProvider } from '../authentication/authentication';
import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';



/*
  Generated class for the HybridProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable({providedIn: 'root'})
export class HybridProvider {
  hybridfeed: any = {};
  hybridUpdates: any = {};
  auction: any = {};
  deviceId: string = "";
  constructor(public http: HttpClient, public socket: Socket, public auth: AuthenticationProvider) {
    const self = this;
    Device.getId().then(res => {
      self.deviceId = res.identifier;
    })
    this.getHybridCount().subscribe(message => {
      this.hybridfeed = message;
      if (this.hybridfeed.auction_id != 0) {
        if (this.hybridfeed.count < 0) {
          if (this.hybridfeed.next != 0 && this.auction.id != this.hybridfeed.next) {
            this.auction.id = this.hybridfeed.next;
            this.getDetails(this.hybridfeed.next);
          }
        }
        else {
          if (this.auction.id == undefined || this.auction.id != this.hybridfeed.auction_id) {
            this.auction.id = this.hybridfeed.auction_id;
            this.getDetails(this.auction.id);
          }
        }
      }


    });
    this.getHybridUpdates().subscribe(message => {
      let data = message.view;
      if (data && data[this.hybridfeed.auction_id]) {

        for (let id in data) {


          if (this.auction.id == id) {
            this.auction.ends = data[id][6];
            this.auction.current_bid = data[id][2];
            this.auction.num_bids = data[id][3];
            this.auction.highestbidder = (data[id][0] == this.auth.userId) ? true : false;
          }



        }

      }
    });

  }
  getDetails(auctionId) {
    this.auction=[];
    let data = { action: "getauctions", userId: this.auth.userId, lot_no: auctionId };
    this.http.post('https://staging.khaleejauction.com/newdesign/api/hybridauction.php', data).subscribe(
      data => {
        if (data['status'] == "success") {
          this.auction = data["results"][0];
        }
      });
  }
  getHybridCount(): Observable<any> {
    let observable = new Observable(observer => {
      this.socket.on('hybridcounter', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
  getHybridUpdates(): Observable<any> {
    let observable = new Observable(observer => {
      this.socket.on('updates', (data) => {
        observer.next(JSON.parse(data));
      });
    })
    return observable;
  }
  getTimer() {
    let percentage = Math.round((this.hybridfeed.count / parseInt(this.auth.hybridtime)) * 100);
    let timer: any = {};
    timer.class = 'pie-wrapper pie-wrapper--solid progress-' + percentage;
    timer.second = this.hybridfeed.count;
    return timer;
  }
  getBox() {
    return this.auction;
  }
  credentials() {
    let data = {
      deviceID: CryptoJS.AES.encrypt(JSON.stringify(this.deviceId), this.auth.secretKey, { format: this.auth.CryptoJSAesJson }).toString(),
      userId: CryptoJS.AES.encrypt(JSON.stringify(this.auth.userId), this.auth.secretKey, { format: this.auth.CryptoJSAesJson }).toString(),
      token: this.auth.token
    }
    return data;
  }

}
