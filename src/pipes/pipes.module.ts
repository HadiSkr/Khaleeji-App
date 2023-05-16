import { NgModule } from '@angular/core';
import { ConvertremainingPipe } from './convertremaining/convertremaining';
import { CurrentpricePipe } from './currentprice/currentprice';
import { BidpricePipe } from './bidprice/bidprice';
import { TimerPipe } from './timer/timer';
import { TwelveHourPipe } from './twelvehour/twelvehour';
@NgModule({
	declarations: [ConvertremainingPipe,
    TwelveHourPipe,    
    CurrentpricePipe,
    BidpricePipe,
    TimerPipe],
	imports: [],
	exports: [ConvertremainingPipe,
    TwelveHourPipe,
    CurrentpricePipe,
    BidpricePipe,
    TimerPipe]
})
export class PipesModule {}
