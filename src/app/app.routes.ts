import { Routes } from '@angular/router';
import { GradoviComponent } from './components/gradovi/gradovi';
import { LokacijeComponent } from './components/lokacije/lokacije';
import { KoncertiComponent } from './components/koncerti/koncerti';
import { ZanroviComponent } from './components/zanrovi/zanrovi';
import { IzvodjaciComponent } from './components/izvodjaci/izvodjaci';
import { KarteComponent } from './components/karte/karte';
import { LoginComponent } from './login/login';
import { HomeComponent } from './components/home/home';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'gradovi', component: GradoviComponent, canActivate: [authGuard] },
  { path: 'lokacije', component: LokacijeComponent, canActivate: [authGuard] },
  { path: 'koncerti', component: KoncertiComponent, canActivate: [authGuard] },
  { path: 'zanrovi', component: ZanroviComponent, canActivate: [authGuard] },
  { path: 'izvodjaci', component: IzvodjaciComponent, canActivate: [authGuard] },
  { path: 'karte', component: KarteComponent, canActivate: [authGuard] },
];