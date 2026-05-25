import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Koncert } from '../../models/koncert.model';
import { Lokacija } from '../../models/lokacija.model';
import { Izvodjac } from '../../models/izvodjac.model';
import { KoncertService } from '../../services/koncert.service';
import { LokacijaService } from '../../services/lokacija.service';
import { IzvodjacService } from '../../services/izvodjac.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-koncerti',
  imports: [CommonModule, FormsModule],
  templateUrl: './koncerti.html',
  styleUrl: './koncerti.css'
})
export class KoncertiComponent implements OnInit {

  koncerti: Koncert[] = [];
  lokacije: Lokacija[] = [];
  izvodjaci: Izvodjac[] = [];
  formaVidljiva = false;
  editMode = false;
  loading = true;
  dropdownOtvoren = false;
  generisanjeVidljivo = false;
  odabraniKoncertZaKarte: Koncert | null = null;
  cenaKarata: number = 0;

  noviKoncert: Koncert = {
    naziv: '',
    datum: '',
    vremePocetka: '',
    vremeTrajanja: 0,
    status: 'PLANIRAN',
    lokacija: { naziv: '', adresa: '', kapacitet: 0, grad: { naziv: '' } },
    izvodjaci: []
  };
  odabraniKoncert: Koncert | null = null;
  odabraniIzvodjacIds: number[] = [];

  statusi = ['PLANIRAN', 'AKTIVAN', 'OTKAZAN', 'ZAVRSEN'];

  constructor(
    private koncertService: KoncertService,
    private lokacijaService: LokacijaService,
    private izvodjacService: IzvodjacService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.ucitajKoncerte();
    this.ucitajLokacije();
    this.ucitajIzvodjace();
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
        this.notificationService.error('Greška pri učitavanju koncerata.');
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

  ucitajIzvodjace(): void {
    this.izvodjacService.findAll().subscribe({
      next: data => {
        this.izvodjaci = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificationService.error('Greška pri učitavanju izvođača.');
      }
    });
  }

  prikaziFormu(): void {
    this.formaVidljiva = true;
    this.editMode = false;
    this.dropdownOtvoren = false;
    this.odabraniIzvodjacIds = [];
    this.noviKoncert = {
      naziv: '',
      datum: '',
      vremePocetka: '',
      vremeTrajanja: 0,
      status: 'PLANIRAN',
      lokacija: { naziv: '', adresa: '', kapacitet: 0, grad: { naziv: '' } },
      izvodjaci: []
    };
  }

  onLokacijaChange(lokacijaId: string): void {
    const lokacija = this.lokacije.find(l => l.id === +lokacijaId);
    if (lokacija) {
      this.noviKoncert.lokacija = lokacija;
    }
  }

  onIzvodjacToggle(id: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.odabraniIzvodjacIds = [...this.odabraniIzvodjacIds, id];
    } else {
      this.odabraniIzvodjacIds = this.odabraniIzvodjacIds.filter(i => i !== id);
    }
  }

  jeOdabran(id: number): boolean {
    return this.odabraniIzvodjacIds.includes(id);
  }

  sacuvaj(): void {
    if (this.editMode && this.odabraniKoncert?.id) {
      this.koncertService.update(this.odabraniKoncert.id, this.noviKoncert).subscribe({
        next: (sacuvan) => {
          if (this.odabraniIzvodjacIds.length > 0) {
            this.koncertService.updateIzvodjaci(sacuvan.id!, this.odabraniIzvodjacIds).subscribe({
              next: () => {
                this.notificationService.success('Koncert uspešno izmenjen!');
                this.ucitajKoncerte();
                this.zatvoriFormu();
              }
            });
          } else {
            this.notificationService.success('Koncert uspešno izmenjen!');
            this.ucitajKoncerte();
            this.zatvoriFormu();
          }
        },
        error: () => {
          this.notificationService.error('Greška pri izmeni koncerta.');
        }
      });
    } else {
      this.koncertService.save(this.noviKoncert).subscribe({
        next: (sacuvan) => {
          if (this.odabraniIzvodjacIds.length > 0) {
            this.koncertService.updateIzvodjaci(sacuvan.id!, this.odabraniIzvodjacIds).subscribe({
              next: () => {
                this.notificationService.success('Koncert uspešno dodat!');
                this.ucitajKoncerte();
                this.zatvoriFormu();
              }
            });
          } else {
            this.notificationService.success('Koncert uspešno dodat!');
            this.ucitajKoncerte();
            this.zatvoriFormu();
          }
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
    this.odabraniIzvodjacIds = koncert.izvodjaci?.map(i => i.id!) || [];
    this.editMode = true;
    this.formaVidljiva = true;
    this.dropdownOtvoren = false;
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
    this.odabraniIzvodjacIds = [];
    this.dropdownOtvoren = false;
    this.noviKoncert = {
      naziv: '',
      datum: '',
      vremePocetka: '',
      vremeTrajanja: 0,
      status: 'PLANIRAN',
      lokacija: { naziv: '', adresa: '', kapacitet: 0, grad: { naziv: '' } },
      izvodjaci: []
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

  izvodjacNaziv(izvodjac: Izvodjac): string {
    if (izvodjac.ime && izvodjac.prezime) {
      return `${izvodjac.ime} ${izvodjac.prezime}`;
    }
    if (izvodjac.naziv) {
      return izvodjac.naziv;
    }
    return 'Nepoznat izvođač';
  }

prikaziGenerisanje(koncert: Koncert): void {
    this.odabraniKoncertZaKarte = koncert;
    this.generisanjeVidljivo = true;
    this.cenaKarata = 0;
}

generisiKarte(): void {
    if (!this.odabraniKoncertZaKarte?.id) return;
    
    this.koncertService.generisiKarte(
        this.odabraniKoncertZaKarte.id,
        this.cenaKarata
    ).subscribe({
        next: (odgovor) => {
            this.notificationService.success(odgovor.poruka);
            this.generisanjeVidljivo = false;
            this.odabraniKoncertZaKarte = null;
        },
        error: (err) => {
            this.notificationService.error(
                typeof err.error === 'string'
                    ? err.error
                    : 'Greška pri generisanju karata.'
            );
        }
    });
}

zatvoriGenerisanje(): void {
    this.generisanjeVidljivo = false;
    this.odabraniKoncertZaKarte = null;
    this.cenaKarata = 0;
}

}