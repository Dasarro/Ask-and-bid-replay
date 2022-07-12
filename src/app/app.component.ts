import { Component, OnInit } from '@angular/core';
import { StockPrice } from 'src/models/stockPrice';
import { stockPricesData } from 'src/assets/stockPrices';
import { of } from 'rxjs';
import { delay, concatWith } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentStockPrice: StockPrice | null = null;

  private getStockPrices(): void {
    const delays = stockPricesData
      .map(stockPrice => stockPrice.datetime)
      .map((datetime, i, array) => {
        if (i === 0) return 0;
        return datetime - array[i-1];
      });

    const observables = stockPricesData.map((stockPrice, i) => of(stockPrice).pipe(delay(delays[i])));
    const observable = observables[0].pipe(concatWith(...observables.slice(1)));
    observable.subscribe(stockPrice => this.currentStockPrice = stockPrice);
  }

  formatDate(datetime: number): string {
    return moment(datetime).format('YYYY-MM-DD HH:mm:ss.SSS');
  }

  ngOnInit(): void {
    this.getStockPrices();
  }
}
