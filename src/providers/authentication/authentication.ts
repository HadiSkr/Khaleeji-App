import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { Device } from '@capacitor/device';
import { GlobalEventsService } from '../observables/observable';
import { Injectable } from '@angular/core';

/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable({providedIn: 'root'})
export class AuthenticationProvider {
  userId:number=-1;
  userName:any="Guest";
  language:string="en";
  secretKey:string="";
  bidlimit:number=0;
  deviceId: string = "";
  token:any;
  bidamount:any;
  waitingtime:any;
  hybridtime:any;
  convertionrate:any;
  CryptoJSAesJson;
  constructor(public http: HttpClient, private globalEventsService: GlobalEventsService) {

    const self = this;
    Device.getId().then(res => {
      self.deviceId = res.identifier;
    })
    this.CryptoJSAesJson= {
        stringify: function (cipherParams) {
            let j;
            j = {ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)};
            if (cipherParams.iv) j.iv = cipherParams.iv.toString();
            if (cipherParams.salt) j.s = cipherParams.salt.toString();
            return JSON.stringify(j).replace(/\s/g, '');
        },
        parse: function (jsonStr) {
            var j = JSON.parse(jsonStr);
            var cipherParams = CryptoJS.lib.CipherParams.create({ciphertext: CryptoJS.enc.Base64.parse(j.ct)});
            if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
            if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
            return cipherParams;
        }
    }
  }
  isLogin()
  {
    if(localStorage.getItem('userId')!=undefined&&localStorage.getItem('token')!=undefined)
    {
      this.userId = parseInt(localStorage.getItem('userId') ?? '');
      this.token = localStorage.getItem('token');
      this.globalEventsService.publish("user:loggedin");
      this.setUser(this.userId);
    }
  }
  register(data)
  {
    return this.http.post('https://staging.khaleejauction.com/newdesign/api/register.php', data);
  }
  login(data)
  {
    data.username=CryptoJS.AES.encrypt(JSON.stringify(data.username), this.secretKey, {format: this.CryptoJSAesJson}).toString();
    data.password=CryptoJS.AES.encrypt(JSON.stringify(data.password), this.secretKey, {format: this.CryptoJSAesJson}).toString();
    data.deviceID=CryptoJS.AES.encrypt(JSON.stringify(this.deviceId), this.secretKey, {format: this.CryptoJSAesJson}).toString();
    return this.http.post('https://staging.khaleejauction.com/newdesign/api/user_login.php', data);
  }
  setUser(userId){
    this.userId = userId;
    let json = {"action" : "getUserInfo","userId" : userId };
    this.http.post('https://staging.khaleejauction.com/newdesign/api/users.php', json).subscribe(
      data => {
        console.log(data);
        if(data['status']=="error")
        {

        }
        else if(data['status']=="success")
        {
          this.userName=data['results'].realname;
          this.globalEventsService.publish('user:profileupdated');
        }
      });
  }
  logout()
  {
    this.userId=-1;
    this.userName="Guest";
  }
  setSecretKey()
  {
    let json = {"action" : "getkey"};
    this.http.post('https://staging.khaleejauction.com/newdesign/api/get_initial.php', json).subscribe(
      data => {
        if(data['status']=="success"){
          this.secretKey=data['unifi_key'];
        }
        else{
          this.secretKey="";
        }
      });
  }
  setSettings()
  {
    let json = {"action" : "getsettings"};
    this.http.post('https://staging.khaleejauction.com/newdesign/api/commonsettings.php', json).subscribe(
      data => {
        if(data['status']=="success"){
          this.waitingtime=data['waitingtime'];
          this.bidamount=data['bidamount'];
          this.hybridtime=data['hybridtime']-data['waitingtime']-data['preauctiontime'];
          this.convertionrate=data['convertionrate'];
        }
        else{
          this.waitingtime=0;
          this.bidamount=0;
          this.hybridtime=0;
          this.convertionrate=0;
        }
      });
  }
  setToken(token)
  {
    this.token=token;
  }
  saveAuth(userId,token)
  {
    localStorage.setItem('userId',userId);
    localStorage.setItem('token',token);
  }
}

