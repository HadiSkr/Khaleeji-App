import { HttpClient } from '@angular/common/http';

import * as CryptoJS from 'crypto-js';


import { AuthenticationProvider } from '../authentication/authentication';
import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { environment } from 'src/environments/environment';


/*
  Generated class for the CommonProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable({ providedIn: 'root' })
export class CommonProvider {
  page = 0;
  deviceId: string = "";
  constructor(public http: HttpClient, public auth: AuthenticationProvider) {
    const self = this;
    Device.getId().then(res => {
      self.deviceId = res.identifier;
    })
  }

  auctions() {
    let data = { action: "getbatchdetails" };
    return this.http.post('/auctions.php', data);
  }
  getItems() {
    let data = { action: "getalltypes", language: "EN" };
    return this.http.post(environment.apiUrl + '/auctionitemtype.php', data);
  }
  getAuctions(data) {
    return this.http.post(environment.apiUrl + '/currentpagemobile.php', data);
  }
  getImage(data) {
    return this.http.post(environment.apiUrl + '/getimagemobile.php', data);
  }
  getImageBase64(data) {
    return this.http.post(environment.apiUrl + '/getimagebase64.php', data);
  }
  feature(data) {
    return this.http.post(environment.apiUrl + '/makefeature.php', data);
  }
  carDetails(id, userid) {
    let data = { auctionId: id, userId: userid, language: this.auth.language.toUpperCase() };
    return this.http.post(environment.apiUrl + '/cardetails.php', data);
  }
  getStatic(data) {
    console.log(data);
    return this.http.post(environment.apiUrl + '/staticpages.php', data);
  }
  dashboard(data) {
    data.deviceID = CryptoJS.AES.encrypt(JSON.stringify(this.deviceId), this.auth.secretKey, { format: this.auth.CryptoJSAesJson }).toString();
    data.userId = CryptoJS.AES.encrypt(JSON.stringify(data.userId), this.auth.secretKey, { format: this.auth.CryptoJSAesJson }).toString();
    data.token = this.auth.token;
    return this.http.post(environment.apiUrl + '/dashboard.php', data);
  }
  searchAuctions(data) {
    return this.http.post(environment.apiUrl + '/currentpagemobile.php', data);
  }
  bid(data) {
    data.deviceID = CryptoJS.AES.encrypt(JSON.stringify(this.deviceId), this.auth.secretKey, { format: this.auth.CryptoJSAesJson }).toString();
    data.userId = CryptoJS.AES.encrypt(JSON.stringify(data.userId), this.auth.secretKey, { format: this.auth.CryptoJSAesJson }).toString();
    data.token = this.auth.token;
    return this.http.post(environment.apiUrl + '/bid.php', data);
  }
  autoBid(data) {
    data.deviceID = CryptoJS.AES.encrypt(JSON.stringify(this.deviceId), this.auth.secretKey, { format: this.auth.CryptoJSAesJson }).toString();
    data.userId = CryptoJS.AES.encrypt(JSON.stringify(data.userId), this.auth.secretKey, { format: this.auth.CryptoJSAesJson }).toString();
    data.token = this.auth.token;
    return this.http.post(environment.apiUrl + '/autobid.php', data);
  }
  autoBidCancel(data) {
    data.deviceID = CryptoJS.AES.encrypt(JSON.stringify(this.deviceId), this.auth.secretKey, { format: this.auth.CryptoJSAesJson }).toString();
    data.userId = CryptoJS.AES.encrypt(JSON.stringify(data.userId), this.auth.secretKey, { format: this.auth.CryptoJSAesJson }).toString();
    data.token = this.auth.token;
    return this.http.post(environment.apiUrl + '/autobid_cancel.php', data);
  }
  getMakes() {
    let data = { "action": "getmake" };
    return this.http.post(environment.apiUrl + '/createmake.php', data);
  }
  getModels(id) {
    let data = { "action": "getmodel", "id": id };
    return this.http.post(environment.apiUrl + '/createmodel.php', data);
  }
  getCategories() {
    let data = { "action": "getmaincategories" };
    return this.http.post(environment.apiUrl + '/active_category.php', data);
  }
  getBodyTypes() {
    let data = { "action": "getactivebodytype" };
    return this.http.post(environment.apiUrl + '/active_bodytype.php', data);
  }
  favorite(data) {
    return this.http.post(environment.apiUrl + '/favourite.php', data);
  }
  getYears() {
    let data = { "action": "getactiveyear" };
    return this.http.post(environment.apiUrl + '/active_category.php', data);
  }
  getYearDropDowns() {
    let data = { "fieldtype": "vehicle", "dropdownname": "year_make" };
    return this.http.post(environment.apiUrl + '/common_function.php', data);
  }
  getSearchables() {
    let data = { "action": "getsearchable" };
    return this.http.post(environment.apiUrl + '/searchable_features.php', data);
  }
  getSearchablesItems(field) {
    let data = { "dropdownname": field, "fieldtype": "vehicle" };
    return this.http.post(environment.apiUrl + '/common_function.php', data);
  }
  initPayment(amount) {
    let json = {
      "send_link": window.location.href,
      "from_mobile" : true,
      "token": this.auth.token,
      "deviceID": CryptoJS.AES.encrypt(JSON.stringify(this.deviceId), this.auth.secretKey, { format: this.auth.CryptoJSAesJson }).toString(),
      "amount": amount,
      "userId": CryptoJS.AES.encrypt(JSON.stringify(this.auth.userId), this.auth.secretKey, { format: this.auth.CryptoJSAesJson }).toString()
    };
    return this.http.post(environment.apiUrl + '/init-payment.php', json);
  }
}
