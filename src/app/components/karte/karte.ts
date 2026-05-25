import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KartaService } from '../../services/karta.service';
import { KoncertService } from '../../services/koncert.service';
import { NotificationService } from '../../services/notification.service';
import { Karta } from '../../models/karta.model';
import { Koncert } from '../../models/koncert.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-karte',
  imports: [CommonModule, FormsModule],
  templateUrl: './karte.html',
  styleUrl: './karte.css'
})
export class KarteComponent implements OnInit {

  karte: Karta[] = [];
  koncerti: Koncert[] = [];
  odabraniKoncertId: number | null = null;
  loading = false;

  kupovina: { imeKupca: string; emailKupca: string } = {
    imeKupca: '',
    emailKupca: ''
  };
  odabranaKartaId: number | null = null;
  kupovinaVidljiva = false;

  constructor(
    private kartaService: KartaService,
    private koncertService: KoncertService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.ucitajKoncerte();
  }

  ucitajKoncerte(): void {
    this.koncertService.findAll().subscribe({
      next: data => {
        this.koncerti = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificationService.error('Greška pri učitavanju koncerata.');
      }
    });
  }

  onKoncertChange(koncertId: string): void {
    this.odabraniKoncertId = +koncertId;
    this.ucitajKarte();
  }

  ucitajKarte(): void {
    if (!this.odabraniKoncertId) return;
    this.loading = true;
    this.kartaService.findByKoncert(this.odabraniKoncertId).subscribe({
      next: data => {
        this.karte = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificationService.error('Greška pri učitavanju karata.');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  prikaziKupovinu(kartaId: number): void {
    this.odabranaKartaId = kartaId;
    this.kupovina = { imeKupca: '', emailKupca: '' };
    this.kupovinaVidljiva = true;
  }

  kupi(): void {
    if (!this.odabranaKartaId) return;
    this.kartaService.kupiKartu(
      this.odabranaKartaId,
      this.kupovina.imeKupca,
      this.kupovina.emailKupca
    ).subscribe({
      next: () => {
        this.notificationService.success('Karta uspešno kupljena!');
        this.kupovinaVidljiva = false;
        this.ucitajKarte();
      },
      error: () => {
        this.notificationService.error('Greška pri kupovini karte.');
      }
    });
  }

  storniraj(id: number): void {
    if (confirm('Da li ste sigurni da želite da stornirate ovu kartu?')) {
      this.kartaService.stornirajKartu(id).subscribe({
        next: () => {
          this.notificationService.success('Karta uspešno stornirana!');
          this.ucitajKarte();
        },
        error: () => {
          this.notificationService.error('Greška pri storniranju karte.');
        }
      });
    }
  }

  statusBoja(status: string): string {
    switch(status) {
      case 'DOSTUPNA': return '#2ecc71';
      case 'REZERVISANA': return '#3498db';
      case 'PRODATA': return '#e74c3c';
      case 'STORNIRANA': return '#95a5a6';
      default: return '#333';
    }
  }
}