import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Cotacao } from '../model/cotacao';
import { Observable, BehaviorSubject, timer, of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CambioService {
  private readonly apiUrl: string = environment.apiUrl;
  private readonly intervaloAtualizacao: number = 175_000; // 2 minutos e 55 segundos
  private readonly cacheDuration: number = 3 * 60 * 1000; // 3 minutos em milissegundos

  private cotacoesSubject = new BehaviorSubject<{ CADBRL: Cotacao | null; GBPBRL: Cotacao | null; ARSBRL: Cotacao | null }>({
    CADBRL: null,
    GBPBRL: null,
    ARSBRL: null
  });

  constructor(private http: HttpClient) {
    timer(0, this.intervaloAtualizacao).pipe(
      switchMap(() => this.buscarCotacoes())
    ).subscribe(cotacoes => this.cotacoesSubject.next(cotacoes));
  }

  // Busca as últimas taxas de câmbio para CAD, GBP e ARS da API.
  private buscarCotacoes(): Observable<{ CADBRL: Cotacao | null; GBPBRL: Cotacao | null; ARSBRL: Cotacao | null }> {
    const url = `${this.apiUrl}/CAD-BRL,GBP-BRL,ARS-BRL`;
    return this.http.get<{ CADBRL: Cotacao; GBPBRL: Cotacao; ARSBRL: Cotacao }>(url).pipe(
      map(response => {
        this.setCachedData('CADBRL', response.CADBRL);
        this.setCachedData('GBPBRL', response.GBPBRL);
        this.setCachedData('ARSBRL', response.ARSBRL);
        return response;
      }),
      catchError(() => {
        const cachedData = {
          CADBRL: this.getCachedData('CADBRL'),
          GBPBRL: this.getCachedData('GBPBRL'),
          ARSBRL: this.getCachedData('ARSBRL')
        };
        return of(cachedData);
      })
    );
  }

  // Observables para os componentes se inscreverem
  get cotacoes$(): Observable<{ CADBRL: Cotacao | null; GBPBRL: Cotacao | null; ARSBRL: Cotacao | null }> {
    return this.cotacoesSubject.asObservable().pipe(
    );
  }

  // Armazena os dados no localStorage com timestamp
  private setCachedData(currency: string, data: Cotacao): void {
    const cachedData = {
      timestamp: new Date().getTime(),
      data
    };
    localStorage.setItem(currency, JSON.stringify(cachedData));
  }

  // Obtém os dados do cache, se válido
  private getCachedData(currency: string): Cotacao | null {
    const cachedData = localStorage.getItem(currency);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const currentTime = new Date().getTime();
      if (currentTime - parsedData.timestamp < this.cacheDuration) {
        return parsedData.data;
      }
    }
    return null;
  }
}
