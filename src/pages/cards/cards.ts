import { HoneypotProvider } from './../../providers/honeypot/honeypot';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html'
})

export class CardsPage {
  cardItems: any[];

  constructor(
    public navCtrl: NavController,
    public honeypots: HoneypotProvider
  ) {

  }

  ionViewDidLoad() {
    const userId = localStorage.getItem('userId')

    this.honeypots.getUserHoneyPots(userId).subscribe(

      (data: any) => {
        console.log('data cards', data.data)
        this.cardItems = data.data
      })
  }

}
