import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, } from '@angular/common/http';

import { CotacaoSimplificada } from '../../model/cotacao';
import { Router } from '@angular/router';
import { CambioServiceService } from '../../service/cambio-service.service';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-peso-argentino',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './peso-argentino.component.html',
  styleUrl: './peso-argentino.component.css',
  providers:[HttpClient]
})
export class PesoArgentinoComponent implements OnInit, OnDestroy {
  valorPeso: CotacaoSimplificada[] = [];

  private unsubscribe = new Subject<void>();
  private subscription!:Subscription;
  private localStorageKey = 'pesoArgentino';

    constructor(
      private cambioServiceService:CambioServiceService,
      private route:Router  
    ) {}
    ngOnInit(): void {
      this.setupLocalStorage();
        this.getValor()
  
        setInterval(() => {
          this.setupLocalStorage();
          this.getValor();
          //this.route.navigateByUrl('');
          console.log('Chamando a função getvalor a cada 3 minutos')
        }, 180000) // 3 minutos
    }
      // valida
    private setupLocalStorage(): void {
      console.log('verificar localStorage');
      const cachedData = localStorage.getItem(this.localStorageKey);
        if (!cachedData) {
        const initialValue: CotacaoSimplificada = {
          ask: '',
          pctChange: '',
          create_date: ''
        };
        localStorage.setItem('pesoArgentino', JSON.stringify(initialValue));
      }
    }
    
    getValor() {
      if(this.subscription){
        this.subscription.unsubscribe();
      }
  
      this.subscription = this.cambioServiceService.getPesoArgentino().pipe(
        takeUntil(this.unsubscribe)
      ).subscribe({
          next: (response: CotacaoSimplificada) => {
            this.valorPeso = [response];
            //console.log(this.valorPeso)
            localStorage.setItem(this.localStorageKey, JSON.stringify(response));
          },
          error:(error) => {
            console.log("Erro ao fezer requisição dos valores ", error)
          }
        })
    }
  
    bidClass(bid:string):string {
      const bidValor = parseFloat(bid.replace(',','.'));
      if(bidValor <= 1.0) {
        return 'red';
      } else if (bidValor > 1.00 && bidValor <= 5.00){
        return 'green';
      } else {
        return 'blue';
      }
    }
  
    ngOnDestroy(): void {
      console.log('O componente está sendo destruído!')
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
