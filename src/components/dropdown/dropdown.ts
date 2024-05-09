import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { NavController, PopoverController, LoadingController, IonContent, Platform } from '@ionic/angular';


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
  receivedData: any;
  constructor(public modalCtrl: ModalController, public navParams: NavParams,public popoverCtrl: PopoverController) {
    //  this.enddates = this.navParams.get('enddates');
     this.enddates = this.navParams.get('data');
     //console.log(this.receivedData);

    // this.enddates = [100,200,300];

    console.log(this.enddates);
  }
  // filterByDate(date)
  // {
  //   this.modalCtrl.dismiss(date);
  // }
  filterByDate(date) {
    this.popoverCtrl.getTop().then((modal) => {
      if (modal) {
        this.popoverCtrl.dismiss(date);
      }
    });
  }
  

}
