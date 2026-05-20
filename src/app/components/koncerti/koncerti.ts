import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Koncert } from '../../models/koncert.model';
import { Lokacija } from '../../models/lokacija.model';
import { KoncertService } from '../../services/koncert.service';
import { LokacijaService } from '../../services/lokacija.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-koncerti',
  imports: [CommonModule, FormsModule],
  templateUrl: './koncerti.html',
  styleUrl: './koncerti.css'
})
export class KoncertiComponent implements OnInit {

  koncerti: Koncert[] = [];
  lokacije: Lokacija[] = [];
  formaVidljiva = false;
  editMode = false;
  loading = true;

  noviKoncert: Koncert = {
    naziv: '',
    datum: '',
    vremePocetka: '',
    vremeTrajanja: 0,
    status: 'PLANIRAN',
    lokacija: { naziv: '', adresa: '', kapacitet: 0, grad: { naziv: '' } }
  };
  odabraniKoncert: Koncert | null = null;

  statusi = ['PLANIRAN', 'AKTIVAN', 'OTKAZAN', 'ZAVRSEN'];

  constructor(
    private koncertService: KoncertService,
    private lokacijaService: LokacijaService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.ucitajKoncerte();
    this.ucitajLokacije();
  }

  ucitajKoncerte(): void {
    this.loading = true;
    this.koncertService.findAll().subscribe({
      next: data => {
        this.koncerti = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificationService.error('Greška pri učitavanju koncerata. Proverite da li je backend pokrenut.');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ucitajLokacije(): void {
    this.lokacijaService.findAll().subscribe({
      next: data => {
        this.lokacije = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificationService.error('Greška pri učitavanju lokacija.');
      }
    });
  }

  prikaziFormu(): void {
    this.formaVidljiva = true;
    this.editMode = false;
    this.noviKoncert = {
      naziv: '',
      datum: '',
      vremePocetka: '',
      vremeTrajanja: 0,
      status: 'PLANIRAN',
      lokacija: { naziv: '', adresa: '', kapacitet: 0, grad: { naziv: '' } }
    };
  }

  onLokacijaChange(lokacijaId: string): void {
    const lokacija = this.lokacije.find(l => l.id === +lokacijaId);
    if (lokacija) {
      this.noviKoncert.lokacija = lokacija;
    }
  }

  sacuvaj(): void {
    if (this.editMode && this.odabraniKoncert?.id) {
      this.koncertService.update(this.odabraniKoncert.id, this.noviKoncert).subscribe({
        next: () => {
          this.notificationService.success('Koncert uspešno izmenjen!');
          this.ucitajKoncerte();
          this.zatvoriFormu();
        },
        error: () => {
          this.notificationService.error('Greška pri izmeni koncerta.');
        }
      });
    } else {
      this.koncertService.save(this.noviKoncert).subscribe({
        next: () => {
          this.notificationService.success('Koncert uspešno dodat!');
          this.ucitajKoncerte();
          this.zatvoriFormu();
        },
        error: () => {
          this.notificationService.error('Greška pri dodavanju koncerta. Moguće da je termin zauzet.');
        }
      });
    }
  }

  uredi(koncert: Koncert): void {
    this.odabraniKoncert = koncert;
    this.noviKoncert = {
      ...koncert,
      lokacija: { ...koncert.lokacija }
    };
    this.editMode = true;
    this.formaVidljiva = true;
  }

  obrisi(id: number): void {
    if (confirm('Da li ste sigurni da želite da obrišete ovaj koncert?')) {
      this.koncertService.delete(id).subscribe({
        next: () => {
          this.notificationService.success('Koncert uspešno obrisan!');
          this.ucitajKoncerte();
        },
        error: () => {
          this.notificationService.error('Greška pri brisanju koncerta.');
        }
      });
    }
  }

  zatvoriFormu(): void {
    this.formaVidljiva = false;
    this.editMode = false;
    this.odabraniKoncert = null;
    this.noviKoncert = {
      naziv: '',
      datum: '',
      vremePocetka: '',
      vremeTrajanja: 0,
      status: 'PLANIRAN',
      lokacija: { naziv: '', adresa: '', kapacitet: 0, grad: { naziv: '' } }
    };
  }

  statusBoja(status: string): string {
    switch(status) {
      case 'PLANIRAN': return '#3498db';
      case 'AKTIVAN': return '#2ecc71';
      case 'OTKAZAN': return '#e74c3c';
      case 'ZAVRSEN': return '#95a5a6';
      default: return '#333';
    }
  }
}