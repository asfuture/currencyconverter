import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { LibraEsterlinaComponent } from './libra-esterlina.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CambioService } from '../../service/cambio.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CotacaoSimplificada } from '../../model/cotacao';

describe('LibraEsterlinaComponent', () => {
  let component: LibraEsterlinaComponent;
  let fixture: ComponentFixture<LibraEsterlinaComponent>;
  let cambioServiceSpy: jasmine.SpyObj<CambioService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const cambioServiceMock = jasmine.createSpyObj('CambioService', ['getLibraEsterlina']);
    const routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      // Importando o componente standalone
      imports: [
        LibraEsterlinaComponent
      ],
      providers: [
        { provide: CambioService, useValue: cambioServiceMock },
        { provide: Router, useValue: routerMock },
        provideHttpClientTesting(),
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LibraEsterlinaComponent);
    component = fixture.componentInstance;
    cambioServiceSpy = TestBed.inject(CambioService) as jasmine.SpyObj<CambioService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize localStorage on init if not set', () => {
    localStorage.removeItem(component['storageKey']);
    component.ngOnInit();
    const cachedData = localStorage.getItem(component['storageKey']);
    expect(cachedData).toBeTruthy();
    expect(JSON.parse(cachedData || '')).toEqual({
      ask:'0.006',
      create_date:'22:54:15',
      pctChange: '0'
    });
  });

  it('should get cotacao on init', () => {
    const mockCotacao: CotacaoSimplificada = { ask: '1.23', pctChange: '0.1', create_date: '2023-01-01 12:00:00' };
    cambioServiceSpy.getLibraEsterlina.and.returnValue(of(mockCotacao));
    component.ngOnInit();
    expect(component.cotacaoLibraEsterlina).toEqual([mockCotacao]);
  });

  it('should handle error on getCotacao', () => {
    cambioServiceSpy.getLibraEsterlina.and.returnValue(throwError('error'));
    component.getCotacao();
    expect(component.isLoading).toBeFalse();
    expect(component.hasError).toBeTrue();
  });

  it('should set the correct class for bid value', () => {
    expect(component.getBidClass('0.9')).toBe('red');
    expect(component.getBidClass('3.5')).toBe('green');
    expect(component.getBidClass('5.1')).toBe('blue');
  });

  it('should format time correctly', () => {
    const formattedTime = component.formatTime('2023-01-01 12:00:00');
    expect(formattedTime).toBe('12:00:00');
  });

  it('should reload component and navigate to root', fakeAsync(() => {
    component.recarregarComponent();
    tick();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
  }));

  it('should unsubscribe and complete destroy$ on destroy', () => {
    const completeSpy = spyOn(component['destroy$'], 'complete').and.callThrough();
    const nextSpy = spyOn(component['destroy$'], 'next').and.callThrough();

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
