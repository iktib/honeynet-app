import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';

import { Users } from '../../providers/providers';
// import { ProfilePage } from '../pages';
import { JwtHelper } from "angular2-jwt";

export interface Resp {
  token: string
}

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [JwtHelper]

})
export class LoginPage {


  public type = 'password';
  public showPass = false;

  account: {
    email: string,
    password: string
  } = {
      email: '',
      password: ''
    };

  constructor(
    public navCtrl: NavController,
    public user: Users,
    public toastCtrl: ToastController,
    private jwtHelper: JwtHelper,
    public loadingCtrl: LoadingController
  ) {

  }

  public doLogin() {

    console.log('ionViewLoaded ForwardersPage');

    let loader = this.loadingCtrl.create({
      content: 'Подождите...',
    });

    loader.present().then(() => {
      this.user.login(this.account).subscribe((resp: any) => {
        console.log('login', resp)
        if (resp && resp.token) {
          const data = this.jwtHelper.decodeToken(resp.token)

          console.log('data', data)

          localStorage.setItem('token', resp.token);
          localStorage.setItem('userId', data.id);
          localStorage.setItem('role', data.role);
          localStorage.setItem('isActivated', data.isActivated)

          const deviceToken = localStorage.getItem('deviceToken')

          if (deviceToken) {
            this.user.registerToken(this.user.getUserId(), deviceToken).subscribe((resp) => {
              // alert('Token registrated' + resp)
            })
          }


          console.log(' data.isActivated', data.isActivated, typeof (data.isActivated))
          if (JSON.parse(data.isActivated)) {
            this.navCtrl.setRoot('TabsPage');
          } else {
            this.navCtrl.setRoot('TabsPage');
          }

          // this.navCtrl.setRoot('TabsPage');
        }
      }, (err) => {
        console.log('problems', err)

        let toast = this.toastCtrl.create({
          message: err.error.message || 'Возникли проблемы - свяжитесь с администратором',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      });

      loader.dismiss();
    });


  }

  public showPassword() {
    this.showPass = !this.showPass;

    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }
}