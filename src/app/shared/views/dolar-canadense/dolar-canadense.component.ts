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
  valorDolar: CotacaoSimplificada[] = []; // Armazena os valores do dólar canadense
  loading: boolean = true;
  erro: boolean = false; 
  
  private unsubscribe = new Subject<void>();
  private subscription!: Subscription; // Ajuste para tornar opcional
  private localStorageKey = 'dolarCanadense'; // Tornar constante readonly

  constructor(
    private cambioServiceService: CambioServiceService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.setupLocalStorage(); // Verifica e cria a chave no localStorage, se necessário
    this.getValor(); // Inicia o processo de obtenção dos valores
    setInterval( () => {
      this.setupLocalStorage();
      this.getValor();
      console.log('Chamando a função getValor a cada 3 minutos');
    }, 180_000); // 180_000 ms = 3 minutos
  }

  recarregarComponent():void {
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
      localStorage.setItem('dolarCanadense', JSON.stringify(initialValue));
    }
  }

  private getValor(): void {
    // Cancela qualquer assinatura anterior
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    // Realizar nova requisição
    this.subscription = this.cambioServiceService.getDolarCanadense().pipe(
      takeUntil(this.unsubscribe)
    ).subscribe({
      next: (response: CotacaoSimplificada) => {
        this.valorDolar = [response];
        // Atualiza o localStorage com os novos dados
        localStorage.setItem('dolarCanadense', JSON.stringify(response)); // Usar a constante
      },
      error: (error) => {
        this.loading = false;
        this.erro   = true;
        console.log("Erro ao fazer requisição dos valores ", error);
      }
    });
  }

  bidClass(bid: string): string {
    const bidValor = parseFloat(bid.replace(',', '.'));
    if (bidValor <= 1.0) {
      return 'red';
    } else if (bidValor > 1.0 && bidValor <= 5.0) { // Removido bidValor > 1.0, pois já é coberto pelo primeiro if
      return 'green';
    } else {
      return 'blue';
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(); // Emite valor para cancelar assinaturas
    this.unsubscribe.complete();// Completa o subject para liberar recursos

    // Cancela assinatura ativa, se houver
    if (this.subscription) { 
      this.subscription.unsubscribe();
    }
  }

  // Extrai o horário do tempo da string de data
  formatHora(create_date: string): string {
    const [date, time] = create_date.split(' '); 
    return time;
  }
}
