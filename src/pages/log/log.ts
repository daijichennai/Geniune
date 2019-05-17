import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Device } from '@ionic-native/device';
import { HttpClient } from '@angular/common/http';
import { CommfunProvider } from '../../providers/commfun/commfun';
import { Observable } from 'rxjs/Observable';
@IonicPage()
@Component({
  selector: 'page-log',
  templateUrl: 'log.html',
})
export class LogPage {
  public logJson: any;
  constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public http: HttpClient,
        public device: Device,
        public alertCtrl: AlertController,
        public uniqueDeviceID: UniqueDeviceID,
        public myFunc: CommfunProvider,
        private loadingCtrl: LoadingController,

      ) {
  }

  ionViewDidLoad() {
    this.uniqueDeviceID.get().then((UniqueId: any) => {
      this.creditDetList(UniqueId);
      })
      .catch((error: any) => {
        alert("Load = " + JSON.stringify(error));
        console.log(error);
      }); 
  }

  creditDetList(UniqueId) {
    let data: Observable<any>;
    let url = this.myFunc.domainURL + "WarrantyAppAPI/Get_Genuine_Log_API.php?UUid=" + UniqueId;
    let loader = this.loadingCtrl.create({
      content: 'Fetching Data From Server...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        this.logJson = result;
        loader.dismiss();
      }, error => {
        loader.dismiss();
        console.log(error);
        //alert(JSON.stringify(error));
      });
    });
 
  }

}
