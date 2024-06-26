import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, } from '@angular/common/http';
import { CotacaoSimplificada } from '../../model/cotacao';
import { CambioService } from '../../service/cambio.service';
import { Router } from '@angular/router';
import { Subscription} from 'rxjs';

@Component({
  selector: 'app-dolar-canadense',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dolar-canadense.component.html',
  styleUrl: './dolar-canadense.component.css',
  providers:[HttpClient]
})
export class DolarCanadenseComponent implements OnInit, OnDestroy {
  cotacaoDolarCanadense: CotacaoSimplificada | null = null;
  private subscription: Subscription | null = null;
  isLoading = true; 
  hasError = false; 

    constructor(
      private cambioService: CambioService,
      private router: Router 
    ) {}

  ngOnInit(): void {
    this.subscription = this.cambioService.cotacoes$.subscribe({
      next: (cotacoes) => {
        this.isLoading = false;
      if (cotacoes.CADBRL) {
        this.cotacaoDolarCanadense = {
          ask: cotacoes.CADBRL.ask,
          pctChange: cotacoes.CADBRL.pctChange,
          create_date: cotacoes.CADBRL.create_date
        };
        this.hasError = false;
      }else{
        this.hasError = true;
      }
    },
    error: (error) => {
      this.isLoading = false;
      this.hasError = true;
      console.error('Erro ao buscar cotações:', error);
    }
   });
  }

  // Função para recarregar o componente
  recarregarComponent(): void {
    console.log('Recarregando componente');
    this.router.navigateByUrl('/').then(() => {
      console.log('Navegação concluída');
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

  // Formata a hora a partir da data de criação
  formatTime(createDate: string): string {
    const [hora, time] = createDate.split(' ');
    return time;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
