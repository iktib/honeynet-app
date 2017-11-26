import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/share';

import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';

import { Api } from '../api/api';
import { Push, PushObject } from '@ionic-native/push';

@Injectable()
export class Users {
  _user: any;

  constructor(
    public api: Api,
    public push: Push,

  ) { }

  public login(accountInfo: any) {
    let seq = this.api.post('users/signin', accountInfo).share();

    seq.subscribe((res: any) => {
      if (res.status == 'success') {
        this._loggedIn(res);
        console.log('login', res)
      } else {
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }


  public signup(accountInfo: any) {
    let seq = this.api.post('users/signup', accountInfo).share();

    seq.subscribe((res: any) => {
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  public updateUser(user: any) {
    console.log('updateUser', user

    )
    let seq = this.api.put(`users/${user._id}`, user).share();

    seq.subscribe((res: any) => {
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  public changePassword(userId, currentPassword, newPassword) {

    const data = {
      currentPassword,
      newPassword
    }

    let seq = this.api.post(`users/${userId}/changePassword`, data).share();

    seq.subscribe((res: any) => {
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  public resetPassword(userId, newPassword) {
    const data = { newPassword }

    let seq = this.api.post(`users/${userId}/resetPassword`, data).share();

    seq.subscribe((res: any) => {
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  public createUser(accountInfo: any) {
    let seq = this.api.post('users/createUser', accountInfo).share();

    seq.subscribe((res: any) => {
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  public logout() {
    this._user = null;

    // localStorage.clear()
    localStorage.removeItem('userId')
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('isActivated')

    console.log('loguot')

    // window.location.reload();
  }

  public _loggedIn(resp) {
    this._user = resp.user;
  }

  public getUsers() {
    let seq = this.api.get('users').share();
    seq.subscribe((res: any) => {
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  public getClients(isActivated = null) {
    let seq = this.api.get(`users?role=client&isActivated=${isActivated}`).share();
    seq.subscribe((res: any) => {
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }

  public getForwarders(isActivated = null) {
    let seq = this.api.get(`users?role=forwarder&isActivated=${isActivated}`).share();
    seq.subscribe((res: any) => {
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }

  public getNewForwarders() {
    let seq = this.api.get('users?role=forwarder&type=new').share();
    seq.subscribe((res: any) => {
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }


  public getClientById(clientId) {
    let seq = this.api.get('users/' + clientId).share();

    seq.subscribe((res: any) => {
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  public getOrders() {
    const userId = this.getUserId()

    let seq = this.api.get(`users/${userId}/orders?skip=0&size=999999&filter=none`).share();
    seq.subscribe((res: any) => {
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  public getOrdersByDate(date) {
    const userId = this.getUserId()
    let seq = this.api.get(`users/${userId}/orders?skip=0&size=999999&filter=${date}`).share();
    seq.subscribe((res: any) => {
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  public getUserId() {
    return localStorage.getItem('userId')
  }

  public getUserById(userid) {
    let seq = this.api.get(`users/${userid}`).share();

    seq.subscribe((res: any) => {
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  public deleteUserById(userid) {
    let seq = this.api.delete(`users/${userid}`).share();

    seq.subscribe((res: any) => {
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  public static authenticated() {
    return tokenNotExpired('/_ionickv/token');
  }


  /* Firebase Cloude Masseging */

  public registerToken(userId, token) {

    const data = {
      userId,
      registrationId: token
    }

    let seq = this.api.post(`fcm/devices`, data).share();

    seq.subscribe((res: any) => {
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }


  public deleteTokenFromUser(token) {

    let seq = this.api.delete(`fcm/devices/${token}`).share();

    seq.subscribe((res: any) => {
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  public sendPush(push) {
    let seq = this.api.post(`send`, push).share();

    seq.subscribe((res: any) => {
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

}