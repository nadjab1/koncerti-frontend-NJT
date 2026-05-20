import { Routes } from '@angular/router';
import { GradoviComponent } from './components/gradovi/gradovi';
import { LokacijeComponent } from './components/lokacije/lokacije';
import { KoncertiComponent } from './components/koncerti/koncerti';
import { ZanroviComponent } from './components/zanrovi/zanrovi';
import { IzvodjaciComponent } from './components/izvodjaci/izvodjaci';
import { KarteComponent } from './components/karte/karte';

export const routes: Routes = [
  { path: 'gradovi', component: GradoviComponent },
  { path: 'lokacije', component: LokacijeComponent },
  { path: 'koncerti', component: KoncertiComponent },
  { path: 'zanrovi', component: ZanroviComponent },
  { path: 'izvodjaci', component: IzvodjaciComponent },
  { path: 'karte', component: KarteComponent },
  { path: '', redirectTo: 'gradovi', pathMatch: 'full' }
];