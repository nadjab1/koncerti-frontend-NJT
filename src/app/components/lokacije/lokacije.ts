import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Lokacija } from '../../models/lokacija.model';
import { Grad } from '../../models/grad.model';
import { LokacijaService } from '../../services/lokacija.service';
import { GradService } from '../../services/grad.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-lokacije',
  imports: [CommonModule, FormsModule],
  templateUrl: './lokacije.html',
  styleUrl: './lokacije.css'
})
export class LokacijeComponent implements OnInit {

  lokacije: Lokacija[] = [];
  gradovi: Grad[] = [];
  formaVidljiva = false;
  editMode = false;
  loading = true;

  novaLokacija: Lokacija = {
    naziv: '',
    adresa: '',
    kapacitet: 0,
    grad: { naziv: '' }
  };
  odabranaLokacija: Lokacija | null = null;

  constructor(
    private lokacijaService: LokacijaService,
    private gradService: GradService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.ucitajLokacije();
    this.ucitajGradove();
  }

  ucitajLokacije(): void {
    this.loading = true;
    this.lokacijaService.findAll().subscribe({
      next: data => {
        this.lokacije = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificationService.error('Greška pri učitavanju lokacija. Proverite da li je backend pokrenut.');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ucitajGradove(): void {
    this.gradService.findAll().subscribe({
      next: data => {
        this.gradovi = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificationService.error('Greška pri učitavanju gradova.');
      }
    });
  }

  prikaziFormu(): void {
    this.formaVidljiva = true;
    this.editMode = false;
    this.novaLokacija = { naziv: '', adresa: '', kapacitet: 0, grad: { naziv: '' } };
  }

  onGradChange(gradId: string): void {
    const grad = this.gradovi.find(g => g.id === +gradId);
    if (grad) {
      this.novaLokacija.grad = grad;
    }
  }

  sacuvaj(): void {
    if (this.editMode && this.odabranaLokacija?.id) {
      this.lokacijaService.update(this.odabranaLokacija.id, this.novaLokacija).subscribe({
        next: () => {
          this.notificationService.success('Lokacija uspešno izmenjena!');
          this.ucitajLokacije();
          this.zatvoriFormu();
        },
        error: () => {
          this.notificationService.error('Greška pri izmeni lokacije.');
        }
      });
    } else {
      this.lokacijaService.save(this.novaLokacija).subscribe({
        next: () => {
          this.notificationService.success('Lokacija uspešno dodata!');
          this.ucitajLokacije();
          this.zatvoriFormu();
        },
        error: () => {
          this.notificationService.error('Greška pri dodavanju lokacije.');
        }
      });
    }
  }

  uredi(lokacija: Lokacija): void {
    this.odabranaLokacija = lokacija;
    this.novaLokacija = { ...lokacija, grad: { ...lokacija.grad } };
    this.editMode = true;
    this.formaVidljiva = true;
  }

  obrisi(id: number): void {
    if (confirm('Da li ste sigurni da želite da obrišete ovu lokaciju?')) {
      this.lokacijaService.delete(id).subscribe({
        next: () => {
          this.notificationService.success('Lokacija uspešno obrisana!');
          this.ucitajLokacije();
        },
        error: () => {
          this.notificationService.error('Greška pri brisanju. Možda ima koncerata na ovoj lokaciji.');
        }
      });
    }
  }

  zatvoriFormu(): void {
    this.formaVidljiva = false;
    this.editMode = false;
    this.odabranaLokacija = null;
    this.novaLokacija = { naziv: '', adresa: '', kapacitet: 0, grad: { naziv: '' } };
  }
}