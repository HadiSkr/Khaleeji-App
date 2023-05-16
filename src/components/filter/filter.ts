import { Component } from '@angular/core';
import { LoadingController, ViewController, PopoverController } from '@ionic/angular';
import { CommonProvider } from '../../providers/common/common';
import { CacheProvider } from '../../providers/cache/cache';
import { MakeComponent } from '../../components/make/make';
import { ModelComponent } from '../../components/model/model';
import { jsonpCallbackContext } from '@angular/common/http/src/module';

/**
 * Generated class for the FilterComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'filter',
  templateUrl: 'filter.html'
})
export class FilterComponent {
  filterType: string;
  searchtab: any={};
  maketab: any={};
  typetab: any={};
  yeartab: any={};
  advancedtab: any={};
  makes: any=[];
  models: any=[];
  categories: any=[];
  types: any=[];
  years: any=[];
  yearsdropdown: any=[];
  advanced: any=[];

  constructor(public popoverCtrl: PopoverController, public viewCtrl: ViewController,public cache: CacheProvider, public loadingCtrl: LoadingController,public common : CommonProvider) {
    console.log('Hello FilterComponent Component');
    this.filterType="search";
    this.getCategories();
    this.getBodyTypes();
    this.getYears();
    this.getYearDropDowns();
    this.getSearchables();
    if(this.cache.getCache('filter')!=undefined)
    {
      this.restoreFromCache();

    }
  }
  restoreFromCache()
  {
    //restore to the last tab
    this.filterType=this.cache.getCache('filterType');
    //restore the tabe by switch case
    let filter = this.cache.getCache('filter');
    console.log(filter);
    switch(this.filterType)
    {
      case 'search' :
        this.searchtab=filter;
        if(this.searchtab.make!=undefined)
          this.getModels();
        break;
      case 'make':
        this.maketab=filter;
        break;
      case 'type':
        this.typetab=filter;
        break;
      case 'year':
        this.yeartab=filter;
        break;
      case 'advanced':
        this.advancedtab=filter;
        break;
      default:
    }
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(MakeComponent, {}, {cssClass: 'make-popover'});
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(order => {
      if(order!=null)
      {
        delete this.searchtab.model;
        delete this.searchtab.modelname;
        this.searchtab.make=order.cat_id;
        this.searchtab.makename=order.cat_name;
        this.getModels();
      }
    });
  }
  getModels()
  {
    if(this.cache.getCache('models-'+this.searchtab.make)!=undefined)
    {
      this.models=this.cache.getCache('models-'+this.searchtab.make);
      return true;
    }
    let loading = await this.loadingCtrl.create({
      message: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div></div>'
    });
    loading.present();
    this.common.getModels(this.searchtab.make).subscribe(
      data => {
        loading.dismiss();
        if(data['status']=="success")
        {
          this.models=data['results'];
          this.cache.setCache('models-'+this.searchtab.make,data['results']);
        }
        else{ this.models=[];
        }

      });


  }
  presentModelPopover(myEvent) {
    let popover = this.popoverCtrl.create(ModelComponent, {models:this.models}, {cssClass: 'make-popover'});
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(order => {
      if(order!=null)
      {
        this.searchtab.model=order.cat_id;
        this.searchtab.modelname=order.cat_name;
      }
    });
  }
  getCategories()
  {
    if(this.cache.getCache('categories')!=undefined)
    {
      this.categories=this.cache.getCache('categories');
      return true;
    }
    this.common.getCategories().subscribe(
      data => {
        if(data['status']=="success")
        {
          this.categories=data['results'];
          this.cache.setCache('categories',data['results'])
        }
        else{ this.categories=[];
        }

      });
  }
  getBodyTypes()
  {
    if(this.cache.getCache('types')!=undefined)
    {
      this.types=this.cache.getCache('types');
      return true;
    }
    this.common.getBodyTypes().subscribe(
      data => {
        if(data['status']=="success")
        {
          this.types=data['results'];
          this.cache.setCache('types',data['results'])

        }
        else{ this.types=[];
        }

      });
  }
  getYears()
  {
    if(this.cache.getCache('years')!=undefined)
    {
      this.years=this.cache.getCache('years');
      return true;
    }
    this.common.getYears().subscribe(
      data => {
        if(data['status']=="success")
        {
          this.years=data['results'];
          this.cache.setCache('years',data['results'])

        }
        else{ this.years=[];
        }

      });
  }
  getYearDropDowns()
  {
    this.common.getYearDropDowns().subscribe(
      data => {
          this.yearsdropdown=data['results'];


      });
  }
  getSearchables()
  {
    if(this.cache.getCache('searchables')!=undefined)
    {
      this.getSearchablesItems(this.cache.getCache('searchables'));
      return true;
    }
    this.common.getSearchables().subscribe(
      data => {
        if(data['results']!=undefined)
        {
          this.getSearchablesItems(data['results'])
          this.cache.setCache('searchables',data['results'])
        }

      });
  }
  getSearchablesItems(searchables)
  {
    for(let feature in searchables)
    {
      let item = searchables[feature];
      if(this.cache.getCache('searchables-'+item.auto)!=undefined)
      {
        this.advanced.push({"title":item.en_name,"value":this.cache.getCache('searchables-'+item.auto)});
      }
      else
      {
        this.common.getSearchablesItems(item.value).subscribe(
          data => {
            if(data['results']!=undefined)
            {
              this.advanced.push({"title":item.en_name,"value":data['results']});
              this.cache.setCache('searchables-'+item.auto,data['results'])
            }

          });
      }

    }
  }
  searchAuction()
  {
    let json:any = {};
    switch(this.filterType)
    {
      case 'search' :
      if(this.searchtab.make!=undefined)
      {
        json.make=[this.searchtab.make];
      }
      if(this.searchtab.model!=undefined)
      {
        json.model=[this.searchtab.model];
      }
      if(this.searchtab.lot_no!=undefined&&this.searchtab.lot_no!="")
      {
        json.lot_no=[this.searchtab.lot_no];
      }
      if(this.searchtab.year_from!=undefined&&this.searchtab.year_from!="")
      {
        json.year_from=this.searchtab.year_from;
      }
      if(this.searchtab.year_to!=undefined&&this.searchtab.year_to!="")
      {
        json.year_to=this.searchtab.year_to;
      }
      this.cache.setCache('filter',this.searchtab);
      break;
      case 'make':
        json.make=[];
        for (const item in this.maketab) {
          if(this.maketab[item]==true)
          {
            json.make.push(item);
          }
        }
        this.cache.setCache('filter',this.maketab);
        break;
      case 'type':
        json.body_type=[];
        for (const type in this.typetab) {
          if(this.typetab[type]==true)
          {
          json.body_type.push(type);
          }
        }
        this.cache.setCache('filter',this.typetab);
        break;
      case 'year':
        json.year=[];
        for (const year in this.yeartab) {
          if(this.yeartab[year]==true)
          {
          json.year.push(year);
          }
        }
        this.cache.setCache('filter',this.yeartab);
        break;
      case 'advanced':
        json.features=[];
        for (const adv in this.advancedtab) {
          json.features.push(adv);
        }
        this.cache.setCache('filter',this.advancedtab);
        break;
      default:
    }
    this.cache.setCache('filterType',this.filterType);
    this.viewCtrl.dismiss(json);
  }
  clearFilter()
  {
    console.log('clear');
    switch(this.filterType)
    {
      case 'search' :
      console.log(this.searchtab.make);
      delete this.searchtab.make;
      delete this.searchtab.model;
      this.searchtab.lot_no="";
      this.searchtab.year_from="";
      this.searchtab.year_to="";
      delete this.searchtab.makename;
      delete this.searchtab.modelname;
      break;
      case 'make':
        for (const item in this.maketab) {
          this.maketab[item]=false;

        }
        break;
      case 'type':
        for (const type in this.typetab) {
          this.typetab[type]=false;
        }
        break;
      case 'year':
        for (const year in this.yeartab) {
          this.yeartab[year]=false;
        }
        break;
      case 'advanced':
      for (const item in this.advancedtab) {
        this.advancedtab[item]=false;
      }
      this.advancedtab=[];
      break;
      default:

    }
  }

}
