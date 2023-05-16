import { Component } from '@angular/core';
import { ViewController, NavParams } from '@ionic/angular';

/**
 * Generated class for the DropdownComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'dropdown',
  templateUrl: 'dropdown.html'
})
export class DropdownComponent {

  enddates: any=[];

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.enddates = this.navParams.get('enddates');
  }
  filterByDate(date)
  {
    this.viewCtrl.dismiss(date);
  }

}
