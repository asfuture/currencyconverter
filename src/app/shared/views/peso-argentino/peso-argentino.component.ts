import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription} from 'rxjs';


import { CotacaoSimplificada } from '../../model/cotacao';
import { CambioService } from '../../service/cambio.service';

@Component({
  selector: 'app-peso-argentino',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './peso-argentino.component.html',
  styleUrls: ['./peso-argentino.component.css'],
  providers: [HttpClient]
})
export class PesoArgentinoComponent implements OnInit, OnDestroy {
  cotacaoPesoArgentino: CotacaoSimplificada | null = null;
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
      if (cotacoes.ARSBRL) {
        this.cotacaoPesoArgentino = {
          ask: cotacoes.ARSBRL.ask,
          pctChange: cotacoes.ARSBRL.pctChange,
          create_date: cotacoes.ARSBRL.create_date
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
