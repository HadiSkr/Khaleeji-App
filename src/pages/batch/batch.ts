import { ThrowStmt } from '@angular/compiler';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from '@ionic/angular';
import { CommonProvider } from '../../providers/common/common';
import { CurrentPage } from '../current/current';

/**
 * Generated class for the BatchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-batch',
  templateUrl: 'batch.html',
})
export class BatchPage {
  pet: any='today';
  upcoming:any=[];
  today:any=[];
  remaing:any='';
  constructor(public loadingCtrl: LoadingController,public common : CommonProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.getEndDates();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BatchPage');
  }
  showBatch(duration){
    this.navCtrl.push(CurrentPage,{
      duration:duration
      });
  }
  getEndDates() {
    let loading = await this.loadingCtrl.create({
      message: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div></div>'
    });
    loading.present();
    this.common.auctions().subscribe(
      data => {

        loading.dismiss();
        if(data['status']=="success")
        {
          let auctionitemdates = [];
          for(let item of data['results'])
          {
            var duplicate = auctionitemdates.filter(function(a){
              return item.enddate==a.date;
            });
            if(duplicate.length>0)
            {
              auctionitemdates.map(function(a){
                if(item.enddate==a.date){
                  a.count = parseInt(a.count)+parseInt(item.count);
                  a.duration.push(item.id);
                }
              });
            }
            else
            {
              auctionitemdates.push({duration:[item.id],batchNumber:item.batchNumber,description:item.description,date:item.enddate,endtime:item.endtime,count:item.count});
            }
            let self = this;
            auctionitemdates.map(function(a){
              a.remaining = self.calculateExamRemainingTime(a.date+' '+a.endtime);
            });
          }
          for(let batch of auctionitemdates)
          {
            let today = new Date().toISOString().slice(0, 10)
            if(batch.date == today)
            {
              this.today.push(batch);
            }
            else
            {
              this.upcoming.push(batch);
            }
          }
        }

      });
  }
  calculateExamRemainingTime(exam_end_at) {



    let exam_ending_at    = new Date(exam_end_at).getTime() / 1000;
    let current_time      = new Date().getTime() / 1000;

    const totalSeconds     = Math.floor((exam_ending_at - (current_time)));;
    const totalMinutes     = Math.floor(totalSeconds/60);
    const totalHours       = Math.floor(totalMinutes/60);
    const totalDays        = Math.floor(totalHours/24);

    const hours   = totalHours - ( totalDays * 24 );
    const minutes = totalMinutes - ( totalDays * 24 * 60 ) - ( hours * 60 );
    const seconds = totalSeconds - ( totalDays * 24 * 60 * 60 ) - ( hours * 60 * 60 ) - ( minutes * 60 );
    let res = "";
    if(totalDays!=0)
    {
      res+=totalDays+" Days ";
    }
    if(hours!=0)
    {
      res+=hours.toString()+" Hours "
    }
    return res+minutes.toString()+" Minutes";

}

}
