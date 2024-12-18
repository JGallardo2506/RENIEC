import { ListDniComponent } from './components/list-dni/list-dni.component';
import { ConsultDniComponent } from './components/consult-dni/consult-dni.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: ConsultDniComponent },
  { path: 'list', component: ListDniComponent },
];
