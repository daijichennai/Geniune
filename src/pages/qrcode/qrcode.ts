import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Sim } from '@ionic-native/sim';
import { Device } from '@ionic-native/device';
import { Geolocation } from '@ionic-native/geolocation';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { CommfunProvider } from '../../providers/commfun/commfun';
import { Diagnostic } from '@ionic-native/diagnostic';

@IonicPage()
@Component({
  selector: 'page-qrcode',
  templateUrl: 'qrcode.html',
})
export class QrcodePage {
  public scanData: any;
  public splitted: any;
  public MobileNumber: any;
  public MobileModel: any;
  public MobileSerial: any;
  public UniqueId: any;
  public lat: any;
  public long: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public sim: Sim,
    public device: Device,
    public barcodeScanner: BarcodeScanner,
    public geolocation: Geolocation,
    public alertCtrl: AlertController,
    public uniqueDeviceID: UniqueDeviceID,
    private iab: InAppBrowser,
    public OpenNative: OpenNativeSettings,
    public app: App,
    public myFunc: CommfunProvider,
    private diagnostic: Diagnostic
  ) {
  }

  ionViewDidLoad() {
    this.simInfo();
    this.diagnostic.isLocationEnabled().then((enable)=>{
      alert(enable);
      if (!enable) {
        this.OpenNative.open("location").then(val => {
          //alert("location");
        }).catch(err => {
          alert(JSON.stringify(err));
        })
      }
    });
  }

  simInfo() {
    this.sim.getSimInfo().then(
      (info) => this.MobileNumber = info.phoneNumber,
      (err) => console.log(JSON.stringify(err))
    );
    this.sim.hasReadPermission().then(
      (info) => console.log(info)
    );
    this.sim.requestReadPermission().then(
      () => console.log('Permission granted'),
      () => console.log('Permission denied')
    );
    this.uniqueDeviceID.get()
      .then((uuid: any) => this.UniqueId = uuid)
      .catch((error: any) => console.log(error));
  }

  barcodeScan() {
    let options = {
      resultDisplayDuration: 0,
      showTorchButton: true,
      prompt: "Scanning Your QR Code"
    };

    this.barcodeScanner.scan(options).then(barcodeData => {
      this.scanData = barcodeData.text;

      this.splitted = this.scanData.split("&@");

      let data: Observable<any>;
      data = this.http.get(this.myFunc.domainURL + 'WarrantyAppAPI/GetQRDetails.php?InvMasterId=' + this.splitted[1] + '&InvDetailsId=' + this.splitted[2]);
      data.subscribe(result => {
        console.log(result.length);
        this.MobileModel = this.device.model;
        this.MobileSerial = this.device.serial;
        let optionsGPS = {
          timeout: 2000,
          enableHighAccuracy: true
        };
        this.geolocation.getCurrentPosition(optionsGPS).then((resp) => {

          this.lat = resp.coords.latitude;
          this.long = resp.coords.longitude;

          var linkLog = this.myFunc.domainURL + 'WarrantyAppAPI/Genuine_log_API.php';
          var LogmyData = JSON.stringify({
            InvMasterId: this.splitted[1],
            InvDetailsId: this.splitted[2],
            MobileNumber: this.MobileNumber,
            MobileModel: this.MobileModel,
            MobileSerial: this.MobileSerial,
            Latitude: this.lat,
            Longitude: this.long,
            UniqueId: this.UniqueId
          });

          this.http.post(linkLog, LogmyData, { responseType: 'text' }).subscribe(data => {
            //alert(JSON.stringify(data));
          }, error => {
            //alert(JSON.stringify(error));
          });
          if (result.length == 0) {
            var link = this.myFunc.domainURL + 'WarrantyAppAPI/Geniune_API.php';
            var myData = JSON.stringify({
              InvMasterId: this.splitted[1],
              InvDetailsId: this.splitted[2],
              MobileNumber: this.MobileNumber,
              MobileModel: this.MobileModel,
              MobileSerial: this.MobileSerial,
              Latitude: this.lat,
              Longitude: this.long
            });

            this.http.post(link, myData, { responseType: 'text' }).subscribe(data => {
              //alert(JSON.stringify(data));
            }, error => {
              //alert(JSON.stringify(error));
            });
          }
        }).catch((error) => {
          let altsuccess = this.alertCtrl.create({
            title: 'Alert',
            message: 'Enable Location And Scan..!',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'OK',
                handler: () => {
                  // this.OpenNative.open("location").then(val => {
                  //   //alert("location");
                  // }).catch(err => {
                  //   alert(JSON.stringify(err));
                  // })
                }
              }
            ]
          });
          altsuccess.present();
          return false;
        });

        const browser = this.iab.create(this.scanData, '_self', { location: 'no', zoom: 'no' });
        browser.on('exit').subscribe(() => {
          this.app.getRootNavs()[0].setRoot('HomePage');
        }, err => {
          this.app.getRootNavs()[0].setRoot('HomePage');
        });
      }, (error) => {
        console.log(error);
        const browser = this.iab.create(this.scanData, '_self', { location: 'no', zoom: 'no' });
        browser.on('exit').subscribe(() => {
          this.app.getRootNavs()[0].setRoot('HomePage');
        }, err => {
          this.app.getRootNavs()[0].setRoot('HomePage');
        });
      });

    });
  }
}
