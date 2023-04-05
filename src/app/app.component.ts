import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
declare var paymentReload: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'cash-app-payment';
  amount: any;
  constructor() {}

  ngOnInit() {
}

  reloadeJs(e: any) {
    const amount = e.target.value;
    paymentReload(amount);
  }
}
