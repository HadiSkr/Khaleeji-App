import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the TwelveHourPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'twelvehour',
})
export class TwelveHourPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args: any[]) {
    var timeString = value;
    var H = +timeString.substr(0, 2);
    var h = (H % 12) || 12;
    var ampm = H < 12 ? "am" : "pm";
    timeString = h + timeString.substr(2, 3) +" "+ampm;
    return timeString;
  }
}
