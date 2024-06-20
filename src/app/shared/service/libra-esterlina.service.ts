import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Cotacao, CotacaoSimplificada } from '../model/cotacao';
import { Observable, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibraEsterlinaService {

  private readonly apiUrl:string = environment.apiUrl;

  constructor( private http:HttpClient ) { }

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

}
