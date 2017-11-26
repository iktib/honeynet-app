import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '../providers';

@Injectable()
export class HoneypotProvider {

  constructor(
    public api: Api
  ) {
    console.log('Hello HoneypotProvider Provider');
  }

  public sendPush(push) {

    let seq = this.api.post(`fcm/send`, push).share();
    seq.subscribe(
      (res: any) => {
        if (res.status == 'success') {
          // this._loggedIn(res);
        }
      }, (err: any) => {
        console.error('ERROR', err);
      });
    return seq;
  }

  public getUserHoneyPots(userId) {

    let seq = this.api.get(`honeyNotes/filter?clientId=${userId}`).share();
    seq.subscribe(
      (res: any) => {
        if (res.status == 'success') {
          // this._loggedIn(res);
        }
      }, (err: any) => {
        console.error('ERROR', err);
      });
    return seq;
  }


}
