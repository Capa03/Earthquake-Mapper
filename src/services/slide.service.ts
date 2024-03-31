import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SlideService {

  constructor() { }

   private _checked = new BehaviorSubject<boolean>(true);

   setChecked(checked: boolean) {
      this._checked.next(checked);
    }

    getChecked(): Observable<boolean> {
      return this._checked.asObservable();
    }
}
