import { HttpClient } from '@angular/common/http';


/*
  Generated class for the CacheProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

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
