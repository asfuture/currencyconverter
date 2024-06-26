import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { Cotacao, CotacaoSimplificada } from './../model/cotacao';
import { TestBed } from '@angular/core/testing';
import { CambioService } from './cambio.service';
import { of } from 'rxjs';

describe('CambioService', () => {
  let cambioService: CambioService;
  let httpTestingController: HttpTestingController;

  const mockResponseApi = {
    CADBRL: {
      code: 'CAD',
      codein: 'BRL',
      name: 'Canadian Dollar/Real Brasileiro',
      high: '1.27',
      low: '1.24',
      varBid: '0.01',
      pctChange: '0.5',
      bid: '1.24',
      ask: '1.25',
      timestamp: '1624243245',
      create_date: '2023-06-23'
    },
    GBPBRL: {
      code: 'GBP',
      codein: 'BRL',
      name: 'Pound Sterling/Real Brasileiro',
      high: '1.37',
      low: '1.34',
      varBid: '0.02',
      pctChange: '0.5',
      bid: '1.34',
      ask: '1.25',
      timestamp: '1624243245',
      create_date: '2023-06-23'
    },
    ARSBRL: {
      code: 'ARS',
      codein: 'BRL',
      name: 'Argentine Peso/Real Brasileiro',
      high: '1.47',
      low: '1.44',
      varBid: '0.03',
      pctChange: '0.5',
      bid: '1.44',
      ask: '1.25',
      timestamp: '1624243245',
      create_date: '2023-06-23'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(),
        provideHttpClient(),
        CambioService
      ]
    });

    cambioService = TestBed.inject(CambioService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica se não há requisições pendentes
    httpTestingController.verify();
  });

  it('should be created', () => {
    // Verifica se o serviço foi criado com sucesso
    expect(cambioService).toBeTruthy();
  });

  // Teste 2: Deve buscar cotações da API
  it('should fetch quotes from the API', () => {
    cambioService['buscarCotacoes']().subscribe(cotacoes => {
      expect(cotacoes.CADBRL).toEqual({
        code: 'CAD',
        codein: 'BRL',
        name: 'Canadian Dollar/Real Brasileiro',
        high: '1.27',
        low: '1.24',
        varBid: '0.01',
        pctChange: '0.5',
        bid: '1.24',
        ask: '1.25',
        timestamp: '1624243245',
        create_date: '2023-06-23'
      });
      expect(cotacoes.GBPBRL).toEqual({
        code: 'GBP',
        codein: 'BRL',
        name: 'Pound Sterling/Real Brasileiro',
        high: '1.37',
        low: '1.34',
        varBid: '0.02',
        pctChange: '0.5',
        bid: '1.34',
        ask: '1.25',
        timestamp: '1624243245',
        create_date: '2023-06-23'
      });
      expect(cotacoes.ARSBRL).toEqual({
        code: 'ARS',
        codein: 'BRL',
        name: 'Argentine Peso/Real Brasileiro',
        high: '1.47',
        low: '1.44',
        varBid: '0.03',
        pctChange: '0.5',
        bid: '1.44',
        ask: '1.25',
        timestamp: '1624243245',
        create_date: '2023-06-23'
      });
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/CAD-BRL,GBP-BRL,ARS-BRL`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponseApi);
  
});
 
  // Teste 3: Deve lidar com erro da API e retornar dados do cache
  it('should handle API error and return cached data', () => {
    const dummyCachedData = {
      CADBRL: { code: 'CAD', codein: 'BRL', name: 'Canadian Dollar/Real Brasileiro', high: '1.27', low: '1.24', varBid: '0.01', pctChange: '0.5', bid: '1.24', ask: '1.25', timestamp: '1624243245', create_date: '2023-06-23' },
      GBPBRL: { code: 'GBP', codein: 'BRL', name: 'Pound Sterling/Real Brasileiro', high: '1.37', low: '1.34', varBid: '0.02', pctChange: '0.5', bid: '1.34', ask: '1.25', timestamp: '1624243245', create_date: '2023-06-23' },
      ARSBRL: { code: 'ARS', codein: 'BRL', name: 'Argentine Peso/Real Brasileiro', high: '1.47', low: '1.44', varBid: '0.03', pctChange: '0.5', bid: '1.44', ask: '1.25', timestamp: '1624243245', create_date: '2023-06-23' }
    };

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      const cache = {
        timestamp: new Date().getTime(),
        data: dummyCachedData[key as keyof typeof dummyCachedData]
      };
      return JSON.stringify(cache);
    });

    cambioService['buscarCotacoes']().subscribe(cotacoes => {
      expect(cotacoes.CADBRL).toEqual(dummyCachedData.CADBRL);
      expect(cotacoes.GBPBRL).toEqual(dummyCachedData.GBPBRL);
      expect(cotacoes.ARSBRL).toEqual(dummyCachedData.ARSBRL);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/CAD-BRL,GBP-BRL,ARS-BRL`);
    req.error(new ErrorEvent('Network error'));
  });

});
