import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest, RegistracijaRequest } from '../services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  rezim: 'login' | 'registracija' = 'login';

  loginPodaci: LoginRequest = { email: '', password: '' };
  regPodaci: RegistracijaRequest = { ime: '', prezime: '', email: '', password: '' };

  loading = false;
  greska: string = '';
  lozinkaPrikazana = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {
    if (this.authService.ulogovan()) {
      this.router.navigate(['/']);
    }
  }

  prijavi(): void {
    if (!this.loginPodaci.email || !this.loginPodaci.password) {
      this.greska = 'Unesite email i lozinku.';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.greska = '';

    this.authService.login(this.loginPodaci).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.greska = err.status === 401 ? 'Pogrešan email ili lozinka.' : 'Greška pri prijavi.';
        this.cdr.detectChanges();
      }
    });
  }

  registruj(): void {
    if (!this.regPodaci.ime || !this.regPodaci.prezime || !this.regPodaci.email || !this.regPodaci.password) {
      this.greska = 'Sva polja su obavezna.';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.greska = '';

    this.authService.registracija(this.regPodaci).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.greska = err.status === 400 ? 'Email je već zauzet.' : 'Greška pri registraciji.';
        this.cdr.detectChanges();
      }
    });
  }

  toggleLozinka(): void {
    this.lozinkaPrikazana = !this.lozinkaPrikazana;
  }

  prebaci(r: 'login' | 'registracija'): void {
    this.rezim = r;
    this.greska = '';
  }
}