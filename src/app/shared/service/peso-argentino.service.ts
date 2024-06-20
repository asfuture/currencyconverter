import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Cotacao, CotacaoSimplificada } from '../model/cotacao';
import { Observable, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PesoArgentinoService {

  private readonly apiUrl:string = environment.apiUrl;

  constructor( private http:HttpClient ) { }

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
