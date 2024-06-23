import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Cotacao, CotacaoSimplificada } from '../model/cotacao';
import { Observable, map, timer, switchMap, catchError, EMPTY } from 'rxjs';

//Serviço para buscar e fornecer dados de taxa de câmbio em tempo real para moedas CAD, GBP e ARS.

@Injectable({
  providedIn: 'root'
})
export class CambioService {

  private readonly apiUrl:string = environment.apiUrl;
  private readonly intervaloAtualizacao:number = 175_000; // 2 minutos e 55 segundos 
  private cotacoesObservavel$: Observable<{ CADBRL: Cotacao; GBPBRL: Cotacao; ARSBRL: Cotacao }>;

  constructor( private http: HttpClient ) {
    this.cotacoesObservavel$ = timer(0, this.intervaloAtualizacao).pipe(
      switchMap(() => this.buscarCotacoes()),
    );
   }
  
  //Busca as últimas taxas de câmbio para CAD, GBP e ARS da API.
   private buscarCotacoes(): Observable<{ CADBRL: Cotacao; GBPBRL: Cotacao; ARSBRL:Cotacao }> {
    const url = `${this.apiUrl}/CAD-BRL,GBP-BRL,ARS-BRL`;
    return this.http.get<{ CADBRL:Cotacao; GBPBRL:Cotacao; ARSBRL:Cotacao }>(url).pipe(
    );
  }

  // Recupera as informações de taxa de câmbio atual para o Dólar Canadense (CAD).
  getDolarCanadense(): Observable<CotacaoSimplificada> {
    return this.cotacoesObservavel$.pipe(
     map(response => {
      const dolar = response.CADBRL;
      return {
                ask: dolar.ask, //Taxa de Venda
                pctChange: dolar.pctChange, //Porcentagem de Variação
                create_date: dolar.create_date // Data de Criação
          };
       })
    );
  }

  //Recupera as informações de taxa de câmbio atual para a Libra Esterlina (GBP).
  getLibraEsterlina(): Observable<CotacaoSimplificada> {
    return this.cotacoesObservavel$.pipe(
     map(response => {
      const libra = response.GBPBRL;
      return {
                ask: libra.ask, //Taxa de Venda
                pctChange: libra.pctChange, //Porcentagem de Variação
                create_date:libra.create_date // Data de Criação
          };
       })
    );
  }

  //Recupera as informações de taxa de câmbio atual para o Peso Argentino (ARS).
  getPesoArgentino(): Observable<CotacaoSimplificada> {
    return this.cotacoesObservavel$.pipe(
     map(response => {
      const peso = response.ARSBRL;
      return {
                ask: peso.ask, //Taxa de Venda
                pctChange: peso.pctChange, //Porcentagem de Variação
                create_date:peso.create_date // Data de Criação
          };
       })
    );
  }
}
