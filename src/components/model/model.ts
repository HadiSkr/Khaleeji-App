import { Component } from '@angular/core';
import { ViewController, NavParams } from '@ionic/angular';
/**
 * Generated class for the ModelComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'model',
  templateUrl: 'model.html'
})
export class ModelComponent {
  models: any=[];
  initial: any=[];

  constructor(public viewCtrl: ViewController,public navParams: NavParams) {
    this.models = this.navParams.get('models');
    this.initial = this.navParams.get('models');
  }
  initializeItems() {
    this.models = this.initial;
  }
  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.models = this.models.filter((item) => {
        return (item.cat_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  selectModel(model)
  {
    this.viewCtrl.dismiss(model);
  }

}
