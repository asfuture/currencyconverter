import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { of, map } from 'rxjs';
import { PesoArgentinoComponent } from './peso-argentino.component';
import { CambioService } from '../../service/cambio.service';
import { CotacaoSimplificada } from '../../model/cotacao';

describe('PesoArgentinoComponent', () => {
  let component: PesoArgentinoComponent;
  let fixture: ComponentFixture<PesoArgentinoComponent>;
  let cambioService: CambioService;
  let router: Router;
  let cambioServiceSpy: jasmine.SpyObj<CambioService>;

  beforeEach(async () => {
    cambioServiceSpy = jasmine.createSpyObj('CambioService', ['cotacoes$']);
    await TestBed.configureTestingModule({
      imports: [
        PesoArgentinoComponent
      ],
      providers: [
        { provide: CambioService, useValue: cambioServiceSpy },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigateByUrl']) },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PesoArgentinoComponent);
    component = fixture.componentInstance;
    cambioService = TestBed.inject(CambioService) as CambioService;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with isLoading true and hasError false', () => {
    expect(component.isLoading).toBe(true);
    expect(component.hasError).toBe(false);
  });

  it('should reload component and navigate to root', fakeAsync(() => {
    component.recarregarComponent();
    tick();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  }));

  it('should return correct CSS class based on bid value', () => {
    expect(component.getBidClass('0.9')).toBe('red');
    expect(component.getBidClass('3.5')).toBe('green');
    expect(component.getBidClass('5.1')).toBe('blue');
  });

  it('should format time correctly from creation date', () => {
    const formattedTime = component.formatTime('2023-01-01 12:00:00');
    expect(formattedTime).toBe('12:00:00');
  });

  it('should handle successful data retrieval', () => {
    const mockData: CotacaoSimplificada = {
      ask: '4.50',
      pctChange: '0.5',
      create_date: '2024-06-26 10:00:00'
    };

    cambioServiceSpy.cotacoes$.pipe(map(response => {ARSBRL: mockData})
    )

    fixture.detectChanges(); // Trigger ngOnInit()

    expect(component.isLoading).toBe(false);
    expect(component.hasError).toBe(false);
    expect(component.cotacaoPesoArgentino).toEqual(mockData);
  });

  it('should handle error during data retrieval', () => {
    const mockError = new Error('API Error');

    spyOn<any>(cambioService, 'cotacoes').and.returnValue(of(mockError));
    fixture.detectChanges(); // Trigger ngOnInit()

    expect(component.isLoading).toBe(false);
    expect(component.hasError).toBe(true);
    expect(component.cotacaoPesoArgentino).toBeNull();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
