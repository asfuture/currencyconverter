import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './shared/views/header/header.component';
import { DolarCanadenseComponent } from './shared/views/dolar-canadense/dolar-canadense.component';
import { PesoArgentinoComponent } from './shared/views/peso-argentino/peso-argentino.component';
import { LibraEsterlinaComponent } from './shared/views/libra-esterlina/libra-esterlina.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent, DolarCanadenseComponent, PesoArgentinoComponent, LibraEsterlinaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'currencyconverter';
}
