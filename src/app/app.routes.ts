import { Routes } from '@angular/router';
import { DolarCanadenseComponent } from './shared/views/dolar-canadense/dolar-canadense.component';
import { PesoArgentinoComponent } from './shared/views/peso-argentino/peso-argentino.component';
import { LibraEsterlinaComponent } from './shared/views/libra-esterlina/libra-esterlina.component';

export const routes: Routes = [
    {
        path:'', component: DolarCanadenseComponent
    },
    {
        path:'', component: PesoArgentinoComponent
    },
    {
        path:'', component: LibraEsterlinaComponent
    }
];
