import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Grad } from '../../models/grad.model';
import { GradService } from '../../services/grad.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-gradovi',
  imports: [CommonModule, FormsModule],
  templateUrl: './gradovi.html',
  styleUrl: './gradovi.css'
})
export class GradoviComponent implements OnInit {

  gradovi: Grad[] = [];
  formaVidljiva = false;
  editMode = false;
  loading = true;

  noviGrad: Grad = { naziv: '' };
  odabraniGrad: Grad | null = null;

  constructor(
    private gradService: GradService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.ucitajGradove();
  }

  ucitajGradove(): void {
    this.loading = true;
    this.gradService.findAll().subscribe({
      next: data => {
        this.gradovi = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificationService.error('Greška pri učitavanju gradova. Proverite da li je backend pokrenut.');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  prikaziFormu(): void {
    this.formaVidljiva = true;
    this.editMode = false;
    this.noviGrad = { naziv: '' };
  }

  sacuvaj(): void {
    if (this.editMode && this.odabraniGrad?.id) {
      this.gradService.update(this.odabraniGrad.id, this.noviGrad).subscribe({
        next: () => {
          this.notificationService.success('Grad uspešno izmenjen!');
          this.ucitajGradove();
          this.zatvoriFormu();
        },
        error: () => {
          this.notificationService.error('Greška pri izmeni grada.');
        }
      });
    } else {
      this.gradService.save(this.noviGrad).subscribe({
        next: () => {
          this.notificationService.success('Grad uspešno dodat!');
          this.ucitajGradove();
          this.zatvoriFormu();
        },
        error: () => {
          this.notificationService.error('Greška pri dodavanju grada.');
        }
      });
    }
  }

  uredi(grad: Grad): void {
    this.odabraniGrad = grad;
    this.noviGrad = { ...grad };
    this.editMode = true;
    this.formaVidljiva = true;
  }

  obrisi(id: number): void {
    if (confirm('Da li ste sigurni da želite da obrišete ovaj grad?')) {
      this.gradService.delete(id).subscribe({
        next: () => {
          this.notificationService.success('Grad uspešno obrisan!');
          this.ucitajGradove();
        },
        error: () => {
          this.notificationService.error('Greška pri brisanju grada. Možda ima lokacije vezane za njega.');
        }
      });
    }
  }

  zatvoriFormu(): void {
    this.formaVidljiva = false;
    this.editMode = false;
    this.noviGrad = { naziv: '' };
    this.odabraniGrad = null;
  }
}