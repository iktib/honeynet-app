import { HoneypotProvider } from './../../providers/honeypot/honeypot';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-notif-detail',
  templateUrl: 'notif-detail.html',
})
export class NotifDetailPage {
  honeypot: any;
  honeypotId: any;
  hackerIp: any;

  public message = ''

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public honeypots: HoneypotProvider
  ) {

    this.hackerIp = navParams.get('hackerIp')
    this.honeypotId = navParams.get('honeypotId')

    this.honeypots.getHoneypotById(this.honeypotId).subscribe(
      (data: any) => {
        this.honeypot = data.data
        console.log('honeypot', this.honeypot)
      }
    )
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotifDetailPage');


  }

}
