import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, } from '@angular/common/http';
import { CotacaoSimplificada } from '../../model/cotacao';
import { CambioService } from '../../service/cambio.service';
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
  cotacaoDolarCanadense: CotacaoSimplificada[] = []; 

  isLoading = true; 
  hasError = false; 

  private destroy$ = new Subject<void>(); 
  private cotacaoSubscription?: Subscription; 
  private readonly storageKey = 'dolarCanadense'; 

  constructor(
    private cambioService: CambioService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.inicializaLocalStorage();
    this.getCotacao();

    // Chamando a função a cada 3 minutos (180000 ms)
    setInterval(() => {
      this.inicializaLocalStorage();
      this.getCotacao();
      //console.log('Atualizando cotação a cada 3 minutos');
    }, 180000);
  }

  // Função para recarregar o componente
  recarregarComponent(): void {
    this.inicializaLocalStorage();
    this.getCotacao();
    console.log('Recarregando componente');
    this.router.navigateByUrl('/').then(() => {
      console.log('Navegação concluída');
    });
  }

  // Inicializa o localStorage com um valor padrão, se necessário
  private inicializaLocalStorage(): void {
    //console.log('Verificando localStorage');
    const cachedData = localStorage.getItem(this.storageKey);
    if (!cachedData) {
      const defaultValue: CotacaoSimplificada = {
        ask: '',
        pctChange: '',
        create_date: ''
      };
      localStorage.setItem(this.storageKey, JSON.stringify(defaultValue));
    }
  }

  // Obtém a cotação do serviço
  getCotacao(): void {
    this.cotacaoSubscription?.unsubscribe();

    this.cotacaoSubscription = this.cambioService.getDolarCanadense().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (cotacao: CotacaoSimplificada) => {
        this.cotacaoDolarCanadense = [cotacao];
        localStorage.setItem(this.storageKey, JSON.stringify(cotacao));
      },
      error: (error) => {
        this.isLoading = false;
        this.hasError = true;
        console.error("Erro ao obter cotação", error);
      }
    });
  }

  // Determina a classe CSS baseada no valor do bid
  getBidClass(bid: string): string {
    const bidValue = parseFloat(bid.replace(',', '.'));
    if (bidValue <= 1.0) {
      return 'red';
    } else if (bidValue > 1.0 && bidValue <= 5.0) {
      return 'green';
    } else {
      return 'blue';
    }
  }

  ngOnDestroy(): void {
    //console.log('Destruindo componente');
    this.destroy$.next();
    this.destroy$.complete();
    this.cotacaoSubscription?.unsubscribe();
  }

  // Formata a hora a partir da data de criação
  formatTime(createDate: string): string {
    const [, time] = createDate.split(' ');
    return time;
  }
}
