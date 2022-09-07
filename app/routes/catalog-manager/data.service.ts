import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { SettingService } from 'src/app/services/setting-management/setting.service';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private _dataSubject1: BehaviorSubject<string> = new BehaviorSubject<string>('');
  timeRefreshPage : Observable<string> = this._dataSubject1.asObservable();
  private _dataSubject2: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  listVM : Observable<[]> = this._dataSubject2.asObservable();


  constructor() { }
  setTimeRefreshPage(text: string) {
    this._dataSubject1.next(text)
  }

  setListVM(data: any) {
    this._dataSubject2.next(data)
  }
}
