import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(
        public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        public network: Network,
        public alertCtrl: AlertController
      )
       {
      platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
        this.network.onDisconnect().subscribe(() => {
          this.alertFn('Network is disconnected..!')
        });
    });
  }

  alertFn(msg: string) {
    let alt = this.alertCtrl.create({
      title: 'Alert',
      message: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    alt.present();
  }
}

