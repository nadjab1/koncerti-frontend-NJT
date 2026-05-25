import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZanrService, Zanr } from '../../services/zanr.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-zanrovi',
  imports: [CommonModule, FormsModule],
  templateUrl: './zanrovi.html',
  styleUrl: './zanrovi.css'
})
export class ZanroviComponent implements OnInit {

  zanrovi: Zanr[] = [];
  formaVidljiva = false;
  loading = true;
  noviZanr: Zanr = { naziv: '' };

  constructor(
    private zanrService: ZanrService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.ucitajZanrove();
  }

  ucitajZanrove(): void {
    this.loading = true;
    this.zanrService.findAll().subscribe({
      next: data => {
        this.zanrovi = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificationService.error('Greška pri učitavanju žanrova.');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  prikaziFormu(): void {
    this.formaVidljiva = true;
    this.noviZanr = { naziv: '' };
  }

  sacuvaj(): void {
    this.zanrService.save(this.noviZanr).subscribe({
      next: () => {
        this.notificationService.success('Žanr uspešno dodat!');
        this.ucitajZanrove();
        this.formaVidljiva = false;
      },
      error: () => {
        this.notificationService.error('Greška pri dodavanju žanra.');
      }
    });
  }

  obrisi(id: number): void {
    if (confirm('Da li ste sigurni da želite da obrišete ovaj žanr?')) {
      this.zanrService.delete(id).subscribe({
        next: () => {
          this.notificationService.success('Žanr uspešno obrisan!');
          this.ucitajZanrove();
        },
        error: () => {
          this.notificationService.error('Greška pri brisanju žanra.');
        }
      });
    }
  }
}