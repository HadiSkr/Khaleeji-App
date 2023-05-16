import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GlobalEventsService {

    private globalEvent = new Subject<any>();

    publish(data: any) {
        this.globalEvent.next(data);
    }

    getObservable(): Subject<any> {
        return this.globalEvent;
    }
}
