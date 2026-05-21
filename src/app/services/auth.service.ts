import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Korisnik {
  id?: number;
  username: string;
  ime?: string;
  prezime?: string;
  email?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  korisnik: Korisnik;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly STORAGE_KEY = 'ulogovani_korisnik';
  private readonly TOKEN_KEY = 'auth_token';
  private apiUrl = 'http://localhost:9000/api/auth';

  private _korisnik = signal<Korisnik | null>(this.ucitajKorisnikaIzStorage());

  korisnik = this._korisnik.asReadonly();
  ulogovan = computed(() => this._korisnik() !== null);

  constructor(private http: HttpClient) {}

  login(podaci: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, podaci).pipe(
      tap(odgovor => {
        this.sacuvajKorisnika(odgovor.korisnik, odgovor.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    this._korisnik.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private sacuvajKorisnika(korisnik: Korisnik, token: string): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(korisnik));
    localStorage.setItem(this.TOKEN_KEY, token);
    this._korisnik.set(korisnik);
  }

  private ucitajKorisnikaIzStorage(): Korisnik | null {
    const sacuvan = localStorage.getItem(this.STORAGE_KEY);
    if (!sacuvan) return null;
    try {
      return JSON.parse(sacuvan) as Korisnik;
    } catch {
      return null;
    }
  }
}
