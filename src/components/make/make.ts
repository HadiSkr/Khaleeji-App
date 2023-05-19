import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonProvider } from '../../providers/common/common';
import { CacheProvider } from '../../providers/cache/cache';

/**
 * Generated class for the MakeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'make',
  templateUrl: 'make.html'
})
export class MakeComponent {

  makes: any=[];
  initial: any=[];

  constructor(public modalCtrl: ModalController, public cache: CacheProvider,public common : CommonProvider) {
    this.getMakes();
  }
  getMakes()
  {
    if(this.cache.getCache('makes')!=undefined)
    {
      this.makes=this.cache.getCache('makes');
      this.initial=this.cache.getCache('makes');
      return true;
    }
    this.common.getMakes().subscribe(
      data => {
        if(data['status']=="success")
        {
          this.makes=data['results'];
          this.initial=data['results'];
          this.cache.setCache('makes',data['results'])
        }
        else{ this.makes=[];
        }

      });


  }
  initializeItems() {
    this.makes = this.initial;
  }
  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.makes = this.makes.filter((item) => {
        return (item.cat_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  selectMake(make)
  {
    this.modalCtrl.dismiss(make);
  }

}
