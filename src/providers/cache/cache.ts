import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


/*
  Generated class for the CacheProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable({providedIn: 'root'})
export class CacheProvider {
  cache:any={};
  constructor(public http: HttpClient) {
  }
  setCache(name,result)
  {
    this.cache[name]=result;
  }
  getCache(name)
  {
    return this.cache[name];
  }

}
