import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotifDetailPage } from './notif-detail';

@NgModule({
  declarations: [
    NotifDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(NotifDetailPage),
  ],
})
export class NotifDetailPageModule {}
