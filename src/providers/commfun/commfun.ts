import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';


@Injectable()
export class CommfunProvider {

  public domainURL: string = "http://simpsonwms.arkaautomaations.com/";
  constructor(
          public http: HttpClient,
          public alertCtrl: AlertController,
    ) {

  }

  convertINR(amt) {
    return amt.toLocaleString("en-IN", { currency: "INR" })
  }
  
  alertFnMsg(msg:string){
    let altsuccess = this.alertCtrl.create({
      title: 'Alert',
      message: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {            
          }
        }
      ]
    });
    altsuccess.present();
  }

}
