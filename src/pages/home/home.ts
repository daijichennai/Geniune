import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  goToQRCode(){
    this.navCtrl.push('QrcodePage');
  }

  goToLog(){
    this.navCtrl.push('LogPage');
  }

}
