import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../services/auth.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  podaci: LoginRequest = {
    username: '',
    password: ''
  };

  loading = false;
  greska: string | null = null;
  lozinkaPrikazana = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {
    if (this.authService.ulogovan()) {
      this.router.navigate(['/']);
    }
  }
  prijavi(): void {
    if (!this.podaci.username || !this.podaci.password) {
      this.greska = 'Unesite korisničko ime i lozinku.';
      return;
    }

    this.loading = true;
    this.greska = null;

    this.authService.login(this.podaci).subscribe({
      next: () => {
        this.location.back();
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.greska = 'Pogrešno korisničko ime ili lozinka.';
        } else if (err.status === 0) {
          this.greska = 'Ne može se povezati sa serverom. Proverite da li je backend pokrenut.';
        } else {
          this.greska = 'Greška pri prijavi. Pokušajte ponovo.';
        }
      }
    });
  }

  toggleLozinka(): void {
    this.lozinkaPrikazana = !this.lozinkaPrikazana;
  }
}
