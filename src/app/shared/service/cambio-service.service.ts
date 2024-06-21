import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Cotacao, CotacaoSimplificada } from '../model/cotacao';
import { Observable, tap, map, timer, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CambioServiceService {

  private readonly apiUrl:string = environment.apiUrl;
  private readonly intervalTime:number = 175000;
  private geral$: Observable<{CADBRL:Cotacao,GBPBRL:Cotacao,ARSBRL:Cotacao}>;

  constructor( private http:HttpClient ) {
    this.geral$ = timer(0,this.intervalTime).pipe(
      switchMap(() => this.getGeral()),
      //tap(response => console.log('Dados Gerais 1', response))
      )
   }
  
  getGeral():Observable<{CADBRL:Cotacao,GBPBRL:Cotacao,ARSBRL:Cotacao}>{
  return this.http.get<{CADBRL:Cotacao,GBPBRL:Cotacao,ARSBRL:Cotacao}>(`${this.apiUrl}/CAD-BRL,GBP-BRL,ARS-BRL`)
      // .pipe(
      //   //tap(response => console.log('Dados Gerais 2', response))
      // )
  }

  getDolarCanadense(): Observable<CotacaoSimplificada> {
    return this.geral$.pipe(
     tap(response => console.log('Dolar', response)),
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
    return this.geral$.pipe(
     tap(response => console.log('Libra', response)),
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
    return this.geral$.pipe(
     tap(response => console.log('Peso', response)),
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
