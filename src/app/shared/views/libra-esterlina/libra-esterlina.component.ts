import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, } from '@angular/common/http';

import { CotacaoSimplificada } from '../../model/cotacao';
import { Router } from '@angular/router';
import { CambioServiceService } from '../../service/cambio-service.service';
import { Subject, takeUntil } from 'rxjs';

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

  private unsubscribe = new Subject<void>();

  constructor( 
    private cambioServiceService:CambioServiceService,
    private route:Router
  ) {}
  ngOnInit(): void {
      this.getValor()

      setInterval(() => {
        this.getValor();
        //this.route.navigateByUrl('');
        console.log('Chamando a função getvalor a cada 3 minutos')
      }, 180000) 
  }

  getValor() {
    this.cambioServiceService.getLibraEsterlina().pipe(
      takeUntil(this.unsubscribe)
    ).subscribe({
        next: (response: CotacaoSimplificada) => {
          //console.log(response);
          this.valorLibra = [response];
          //console.log('teste', this.valorLibra)
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
    }
   
     formatTimestamp(timestamp: string): string {
       const date = new Date(parseInt(timestamp, 10) * 1000);
       return date.toLocaleTimeString('pt-BR');
     }
}
