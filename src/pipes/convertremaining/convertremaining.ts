import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the ConvertremainingPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'convertremaining',
})
export class ConvertremainingPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number, ...args: any[]) {
    if(value!=undefined)
    {
      let t = (value * 1000);
      //days

      //days
      let days = Math.floor(t / (1000 * 60 * 60 * 24));
      let hours = Math.floor((t%(1000 * 60 * 60 * 24))/(1000 * 60 * 60));
      let minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((t % (1000 * 60)) / 1000);

      // Will display time in 10:30:23 format

      // Will display time in 10:30:23 format
      let formattedTime = days +' D '+ hours +' H '+ minutes +' M '+ seconds +' S ';
      return formattedTime;
    }

  }
}
