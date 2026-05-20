import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IzvodjacService, Izvodjac } from '../../services/izvodjac.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-izvodjaci',
  imports: [CommonModule, FormsModule],
  templateUrl: './izvodjaci.html',
  styleUrl: './izvodjaci.css'
})
export class IzvodjaciComponent implements OnInit {

  izvodjaci: Izvodjac[] = [];
  formaVidljiva = false;
  loading = true;
  odabraniTip: 'MUZICAR' | 'BEND' = 'MUZICAR';

  noviIzvodjac: Izvodjac = {
    kontaktEmail: '',
    tip: 'MUZICAR'
  };

  constructor(
    private izvodjacService: IzvodjacService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.ucitajIzvodjace();
  }

  ucitajIzvodjace(): void {
    this.loading = true;
    this.izvodjacService.findAll().subscribe({
      next: data => {
        this.izvodjaci = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificationService.error('Greška pri učitavanju izvođača.');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  prikaziFormu(tip: 'MUZICAR' | 'BEND'): void {
    this.odabraniTip = tip;
    this.formaVidljiva = true;
    this.noviIzvodjac = { kontaktEmail: '', tip };
  }

  sacuvaj(): void {
    const zahtev = this.odabraniTip === 'MUZICAR'
      ? this.izvodjacService.sacuvajMuzicara(this.noviIzvodjac)
      : this.izvodjacService.sacuvajBend(this.noviIzvodjac);

    zahtev.subscribe({
      next: () => {
        this.notificationService.success('Izvođač uspešno dodat!');
        this.ucitajIzvodjace();
        this.zatvoriFormu();
      },
      error: () => {
        this.notificationService.error('Greška pri dodavanju izvođača.');
      }
    });
  }

  obrisi(id: number): void {
    if (confirm('Da li ste sigurni da želite da obrišete ovog izvođača?')) {
      this.izvodjacService.delete(id).subscribe({
        next: () => {
          this.notificationService.success('Izvođač uspešno obrisan!');
          this.ucitajIzvodjace();
        },
        error: () => {
          this.notificationService.error('Greška pri brisanju izvođača.');
        }
      });
    }
  }

  zatvoriFormu(): void {
    this.formaVidljiva = false;
    this.noviIzvodjac = { kontaktEmail: '', tip: 'MUZICAR' };
  }
}