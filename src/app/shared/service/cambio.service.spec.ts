import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { CotacaoSimplificada } from './../model/cotacao';
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

  it('should fetch exchange rates', () => {
    // Testa se as cotações são buscadas corretamente
    cambioService['buscarCotacoes']().subscribe((data) => {
      expect(data).toEqual(mockResponseApi);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/CAD-BRL,GBP-BRL,ARS-BRL`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponseApi);
  });

  it('should get Dolar Canadense', () => {
    spyOn<any>(cambioService, 'buscarCotacoes').and.returnValue(of(mockResponseApi));

    cambioService.getDolarCanadense().subscribe((CADBRL: CotacaoSimplificada) => {
      expect(CADBRL).toEqual({
        ask: '1.25',
        pctChange: '0.5',
        create_date: '2023-06-23'
      });
    });
  });

  it('should get Libra Esterlina', () => {
    spyOn<any>(cambioService, 'buscarCotacoes').and.returnValue(of(mockResponseApi));

    cambioService.getLibraEsterlina().subscribe((GBPBRL: CotacaoSimplificada) => {
      expect(GBPBRL).toEqual({
        ask: '1.25',
        pctChange: '0.5',
        create_date: '2023-06-23'
      });
    });
  });

  it('should get Peso Argentino', () => {
    spyOn<any>(cambioService, 'buscarCotacoes').and.returnValue(of(mockResponseApi));

    cambioService.getPesoArgentino().subscribe((ARSBRL: CotacaoSimplificada) => {
      expect(ARSBRL).toEqual({
        ask: '1.25',
        pctChange: '0.5',
        create_date: '2023-06-23'
      });
    });
  });

});
