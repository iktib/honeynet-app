import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  item: any;

  constructor(
    public navCtrl: NavController,
    navParams: NavParams
  ) {
    this.item = navParams.get('item');
  }

}
