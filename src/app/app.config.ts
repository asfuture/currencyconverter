import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

// Configuração da aplicação
export const appConfig: ApplicationConfig = {
  // Configuração para detecção de mudanças na zona
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  // Configuração do roteador com as rotas da aplicação
  provideRouter(routes), 
  // Configuração do cliente HTTP
  provideHttpClient() 
  ], 
};
