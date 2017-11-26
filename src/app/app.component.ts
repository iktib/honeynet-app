import { PushOptions, PushObject, Push } from '@ionic-native/push';
import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Config, Nav, Platform, Events, AlertController, ToastController } from 'ionic-angular';
import { Settings, Users } from '../providers/providers';
import { JwtHelper } from "angular2-jwt";

import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: './app.component.html',
  providers: [JwtHelper]
})

export class MyApp {
  public pushObject: PushObject;
  alert: any;
  public rootPage: any;
  @ViewChild(Nav) nav: Nav;

  constructor(
    public platform: Platform,
    settings: Settings,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private jwtHelper: JwtHelper,
    public events: Events,
    public push: Push,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public users: Users,
    private translate: TranslateService,
    private config: Config
  ) {

    this.initTranslate();

    this.platform.ready().then(() => {
      const token = localStorage.getItem('token')

      this.statusBar.styleDefault();
      this.splashScreen.hide()
      this.initPushNotification();


      if (token) {
        console.log('if token - la la la ')
        const data = this.jwtHelper.decodeToken(token)

        // localStorage.setItem('userId', data.id)
        // localStorage.setItem('role', data.role)
        const isActivated = JSON.parse(localStorage.getItem('isActivated'))

        console.log('User data', data)
        // this.events.publish('myapp:init');
        if (isActivated) {
          this.rootPage = 'TabsPage';
        } else {
          this.rootPage = 'TabsPage';
        }
        // this.initializeApp();
      } else {
        this.rootPage = 'WelcomePage';
      }

      platform.registerBackButtonAction(() => {
        if (this.nav.canGoBack()) {
          this.nav.pop({});
        } else {
          if (this.alert) {
            this.alert.dismiss();
            this.alert = null;
          } else {
            this.showAlert();
          }
        }
      });

      this.events.subscribe('user:logout', () => {

        const deviceToken = localStorage.getItem('deviceToken')

        if (deviceToken) {
          this.users.deleteTokenFromUser(deviceToken).subscribe((resp) => {
            // alert('Token registrated' + resp)
          })
        }

        console.log('event logout')
        this.rootPage = 'WelcomePage';
        this.nav.setRoot('WelcomePage')

        /*         this.pushObject.unregister()
                  .then(() => console.log('unregister success'))
                  .catch(() => console.log('unregister error '))
         */

      })

      this.events.subscribe('user:signup', () => {
        console.log('event signup')
        const isActivated = JSON.parse(localStorage.getItem('isActivated'))
        // this.events.publish('myapp:init');
        if (isActivated) {
          // this.rootPage = 'TabsPage';
          this.rootPage = 'TabsPage';
          this.nav.setRoot('TabsPage')
        } else {
          this.rootPage = 'TabsPage';
          this.nav.setRoot('TabsPage')
        }
      })
    });
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  showAlert() {
    this.alert = this.alertCtrl.create({
      title: 'Выйти?',
      message: 'Вы действительно хотите выйти из приложения?',
      buttons: [
        {
          text: 'Отмена',
          handler: () => {
            this.alert = null;
          }
        },
        {
          text: 'Выйти',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    this.alert.present();
  }

  public initPushNotification() {

    if (!this.platform.is('cordova')) {

      console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
      return;
    }

    this.push.hasPermission()
      .then((res: any) => {
        console.log('hasPermission', res)
        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We do not have permission to send push notifications');
        }

      });

    const options: PushOptions = {
      android: {},
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true'
      },
      windows: {}
    };

    this.pushObject = this.push.init(options);


    this.pushObject.on('registration').subscribe((data: any) => {
      console.log('device token -> ', data.registrationId);


      localStorage.setItem('deviceToken', data.registrationId)

      // this.users.registerToken(this.users.getUserId(), data.registrationId).subscribe((resp) => {
      // alert('Token registrated' + resp)
      // })
    });

    this.pushObject.on('notification').subscribe((data: any) => {
      console.log('data -> ', data);
      console.log('message -> ', data.message);
      console.log('additionalData.orderId -> ', data.additionalData.orderId);
      console.log('additionalData -> ', data.additionalData);


      this.events.publish('orders:update')

      if (data.additionalData.foreground) {
        // if application open, show popup
        let confirmAlert = this.alertCtrl.create({
          title: 'Новое уведомление',
          message: data.message,
          buttons: [{
            text: 'Закрыть',
            role: 'cancel'
          }, {
            text: 'Посмотреть',
            handler: () => {
              // TODO: Your logic here
              this.nav.push('OrderDetailPage', { orderId: data.additionalData.orderId });
            }
          }]
        });
        confirmAlert.present();
      } else {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        this.nav.push('OrderDetailPage', { orderId: data.additionalData.orderId });
        console.log('Push notification clicked');
      }
    });

    this.pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
  }
}