import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, } from '@angular/common/http';

import { CotacaoSimplificada } from '../../model/cotacao';
import { Router } from '@angular/router';
import { CambioServiceService } from '../../service/cambio-service.service';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-libra-esterlina',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './libra-esterlina.component.html',
  styleUrl: './libra-esterlina.component.css',
  providers:[HttpClient]
})
export class LibraEsterlinaComponent implements OnInit, OnDestroy {
  valorLibra: CotacaoSimplificada[] = [];
  loading: boolean = true;
  erro: boolean = false;

  private unsubscribe = new Subject<void>();
  private subscription!:Subscription;
  private localStorageKey = 'libraEsterlina';
  constructor( 
    private cambioServiceService:CambioServiceService,
    private route:Router
  ) {}
  ngOnInit(): void {
    this.setupLocalStorage();
      this.getValor()

      setInterval(() => {
        this.setupLocalStorage()
        this.getValor();
        //this.route.navigateByUrl('');
        console.log('Chamando a função getvalor a cada 3 minutos')
      }, 180000) 
  }
  recarregarComponent() {
        this.setupLocalStorage();
        this.getValor();
        console.log('Recarregar novamente');
        this.route.navigateByUrl('/').then(() =>{
          console.log('Navegação ok');
        })
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
      localStorage.setItem('libraEsterlina', JSON.stringify(initialValue));
    }
  }

  getValor() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }

    this.subscription = this.cambioServiceService.getLibraEsterlina().pipe(
      takeUntil(this.unsubscribe)
    ).subscribe({
        next: (response: CotacaoSimplificada) => {
          this.valorLibra = [response];
          //console.log( this.valorLibra)
          localStorage.setItem(this.localStorageKey, JSON.stringify(response));
        },
        error:(error) => {
          this.loading = false;
          this.erro   = true;
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
      console.log('O componente está sendo destruído!')
    }
    }
    
     formatHora(create_date: string): string {
      const [date, time] = create_date.split(' ');
      return time;
    }
}
