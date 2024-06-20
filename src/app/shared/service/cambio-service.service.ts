import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Cotacao, CotacaoSimplificada } from '../model/cotacao';
import { Observable, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CambioServiceService {

  private readonly apiUrl:string = environment.apiUrl;

  constructor( private http:HttpClient ) { }

  getDolarCanadense(): Observable<CotacaoSimplificada> {
    return this.http.get<{CADBRL:Cotacao}>(`${this.apiUrl}/CAD-BRL`)
    .pipe(
     //tap(response => console.log('Valor api', response)),
     map(response => {
      const dolar = response.CADBRL;
      return {
                ask: dolar.ask,
                pctChange: dolar.pctChange,
                timestamp: dolar.timestamp
          };
       })
    );
  }

  getLibraEsterlina(): Observable<CotacaoSimplificada> {
    return this.http.get<{GBPBRL:Cotacao}>(`${this.apiUrl}/GBP-BRL`)
    .pipe(
     //tap(response => console.log('Valor api', response)),
     map(response => {
      const libra = response.GBPBRL;
      return {
                ask: libra.ask,
                pctChange: libra.pctChange,
                timestamp: libra.timestamp
          };
       })
    );
  }

  getPesoArgentino(): Observable<CotacaoSimplificada> {
    return this.http.get<{ARSBRL:Cotacao}>(`${this.apiUrl}/ARS-BRL`)
    .pipe(
     //tap(response => console.log('Valor api', response)),
     map(response => {
      const peso = response.ARSBRL;
      return {
                ask: peso.ask,
                pctChange: peso.pctChange,
                timestamp: peso.timestamp
          };
       })
    );
  }
}
