import { Routes } from '@angular/router';
import { GradoviComponent } from './components/gradovi/gradovi';
import { LokacijeComponent } from './components/lokacije/lokacije';
import { KoncertiComponent } from './components/koncerti/koncerti';

export const routes: Routes = [
  { path: 'gradovi', component: GradoviComponent },
  { path: 'lokacije', component: LokacijeComponent },
  { path: 'koncerti', component: KoncertiComponent },
  { path: '', redirectTo: 'gradovi', pathMatch: 'full' }
];