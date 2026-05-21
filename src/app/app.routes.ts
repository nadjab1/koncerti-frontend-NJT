import { Routes } from '@angular/router';
import { GradoviComponent } from './components/gradovi/gradovi';
import { LokacijeComponent } from './components/lokacije/lokacije';
import { KoncertiComponent } from './components/koncerti/koncerti';
import { ZanroviComponent } from './components/zanrovi/zanrovi';
import { IzvodjaciComponent } from './components/izvodjaci/izvodjaci';
import { KarteComponent } from './components/karte/karte';
import { LoginComponent } from './login/login';
import { HomeComponent } from './components/home/home';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'gradovi', component: GradoviComponent },
  { path: 'lokacije', component: LokacijeComponent },
  { path: 'koncerti', component: KoncertiComponent },
  { path: 'zanrovi', component: ZanroviComponent },
  { path: 'izvodjaci', component: IzvodjaciComponent },
  { path: 'karte', component: KarteComponent },
  { path: '', component: HomeComponent }
];