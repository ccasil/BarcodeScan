import { Component } from '@angular/core';
import { NgxBarcodeScannerService } from '@eisberg-labs/ngx-barcode-scanner';
import * as Tesseract from 'tesseract.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  success: string | undefined; // Status code '000'
  imagesubmit: any;
  error: string | undefined;
  error1: string | undefined;
  serialnumber: string | undefined;

  constructor(
    service: NgxBarcodeScannerService
  ){}

 barcodeButton(event: any): void {
  this.success = 'Scanning Image';
  this.error = '';
  this.error1 = '';
  // console.log(event);
  if (event.target.files && event.target.files[0]) {
    const reader = new FileReader();

    reader.readAsDataURL(event.target.files[0]); // read file as data url

    reader.onload = (event) => { // called once readAsDataURL is completed

      // console.log(event);
      // this.imagesubmit = event['target']['result'];
      // this.quagga = Quagga.decodeSingle({
      //   decoder: {
      //       readers: ['code_128_reader'] // List of active readers
      //   },
      //     locate: true, // try to locate the barcode in the image
      //     src: this.imagesubmit // or 'data:image/jpg;base64,' + data
      //   }, (result: any) => {
      //   // console.log(result.codeResult);
      //   if (result.codeResult) {
      //       console.log('result', result.codeResult.code);
      //       this.success = result.codeResult.code;
      //       this.serialnumber = result.codeResult.code;
      //   } else {
      //       console.log('Barcode not detected');
      //       this.error = 'Barcode not detected';
      //       this.picButton();
      //   }
      // });
    };
  }
  // if (this.quagga !== false) {
  //   this.success = this.quagga;
  //   this.serialnumber = this.quagga;
  // } else {
  //   this.picButton();
  // }
 }

 picButton(): void {
  this.success = 'Scanning Image';
  // console.log(event);
  // if (event.target.files && event.target.files[0]) {
  //   const reader = new FileReader();

  //   reader.readAsDataURL(event.target.files[0]); // read file as data url

  //   reader.onload = (event) => { // called once readAsDataURL is completed

  //     console.log(event);
  //     this.imagesubmit = event['target']['result'];
  Tesseract.recognize(this.imagesubmit).then((result) => {
    if (result) {
      console.log(result.data.confidence);
      console.log(result.data.text);
      const rgx = new RegExp('[TV][A-Z0-9][A-Z0-9][A-Z][A-Z0-9][A-Z0-9][A-Z][A-Z][0-9][0-9][0-9][0-9][0-9][0-9]');
      const arr = rgx.exec(result.data.text);
      console.log(arr);
      if (arr) {
        let str = arr[0].substring(0, 4);
        if (arr[0][4] === 'O') {
          str += '0';
        } else if (arr[0][4] === 'I') {
          str += '1';
        } else {
          str += arr[0][4];
        }
        if (arr[0][5] === 'O') {
          str += '0';
        } else if (arr[0][5] === 'I') {
          str += '1';
        } else {
          str += arr[0][5];
        }
        str += arr[0].substring(6, 14);
        console.log(str);

        this.success = 'Confidence level: ' + result.data.confidence + '%<br>' + str;
        this.serialnumber = str;
      } else {
        this.success = '';
        this.error1 = '<span class=\'font-weight-bold\'>S/N not readable, please keep text as horizontal as possible</span><br>';
        this.error1 += result.data.text;
      }
    }
  });
    // };
  // }
  // Tesseract.recognize('../../assets/test/screen1.png').then((result) => {
  //   if (result) {
  //     console.log(result);
  //     console.log(result.data.text);
  //     this.success = result.data.text;
  //   }
  // });
  // console.log(this.imagesubmit);
 }
  onStartButtonPress() {
    this.service.start(this.quaggaConfig, 0.1)
  }

  onValueChanges(detectedValue: string) {
    console.log("Found this: " + detectedValue)
  }

  onStopButtonPress() {
    this.service.stop()
  }

 resetButton(): void {
  this.error = '';
  this.error1 = '';
  this.serialnumber = '';
  this.success = '';
 }
}
