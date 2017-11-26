import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import 'rxjs/add/operator/map';

@Injectable()
export class PushProvider {
  constructor(public api: Api) { }

  public sendPush(push) {

    const puqsh = {
      "userId": "47d08170-c597-11e7-b7ca-3b6029b03f1e",
      "title": "1 Заголовок",
      "message": "1 Сообщение",
      "orderId": ""
    }

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

}