import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, } from '@angular/common/http';

import { CotacaoSimplificada } from '../../model/cotacao';
import { Router } from '@angular/router';
import { CambioService } from '../../service/cambio.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-libra-esterlina',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './libra-esterlina.component.html',
  styleUrl: './libra-esterlina.component.css',
  providers:[HttpClient]
})

export class LibraEsterlinaComponent implements OnInit, OnDestroy {
cotacaoLibraEsterlina: CotacaoSimplificada | null = null;
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
      if (cotacoes.GBPBRL) {
        this.cotacaoLibraEsterlina = {
          ask: cotacoes.GBPBRL.ask,
          pctChange: cotacoes.GBPBRL.pctChange,
          create_date: cotacoes.GBPBRL.create_date
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
