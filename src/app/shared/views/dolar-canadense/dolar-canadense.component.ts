import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, } from '@angular/common/http';

import { CotacaoSimplificada } from '../../model/cotacao';
import { CambioServiceService } from '../../service/cambio-service.service';
import { Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';


@Component({
  selector: 'app-dolar-canadense',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dolar-canadense.component.html',
  styleUrl: './dolar-canadense.component.css',
  providers:[HttpClient]
})
export class DolarCanadenseComponent implements OnInit, OnDestroy {
  valorDolar: CotacaoSimplificada[] = [];

  private unsubscribe = new Subject<void>();
  private subscription!: Subscription;
  private localStorageKey = 'dolarCanadense';

  constructor(
    private cambioServiceService: CambioServiceService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.setupLocalStorage(); // Verifica e cria a chave no localStorage, se necessário
    this.getValor(); // Inicia o processo de obtenção dos valores
    setInterval(() => {
      this.setupLocalStorage();
      this.getValor();
      console.log('Chamando a função getValor a cada 3 minutos');
    }, 180000); // 180000 ms = 3 minutos
  }

  private setupLocalStorage(): void {
    console.log('verificar localStorage');
    const cachedData = localStorage.getItem(this.localStorageKey);
    if (!cachedData) {
      const initialValue: CotacaoSimplificada = {
        ask: '',
        pctChange: '',
        create_date: ''
      };
      localStorage.setItem('dolarCanadense', JSON.stringify(initialValue));
    }
  }

  getValor(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.cambioServiceService.getDolarCanadense().pipe(
      takeUntil(this.unsubscribe)
    ).subscribe({
      next: (response: CotacaoSimplificada) => {
        this.valorDolar = [response];
        //console.log(this.valorDolar)
        localStorage.setItem('dolarCanadense', JSON.stringify(response)); // Atualiza o localStorage com os novos dados
      },
      error: (error) => {
        console.log("Erro ao fazer requisição dos valores ", error);
      }
    });
  }

  bidClass(bid: string): string {
    const bidValor = parseFloat(bid.replace(',', '.'));
    if (bidValor <= 1.0) {
      return 'red';
    } else if (bidValor > 1.0 && bidValor <= 5.0) {
      return 'green';
    } else {
      return 'blue';
    }
  }

  ngOnDestroy(): void {
    console.log('O componente está sendo destruído!');
    this.unsubscribe.next();
    this.unsubscribe.complete();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  formatHora(create_date: string): string {
    const [date, time] = create_date.split(' ');
    return time;
  }
}
