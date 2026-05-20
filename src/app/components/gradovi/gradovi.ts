import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Grad } from '../../models/grad.model';
import { GradService } from '../../services/grad.service';

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

  noviGrad: Grad = { naziv: '' };
  odabraniGrad: Grad | null = null;

  constructor(private gradService: GradService) {}

  ngOnInit(): void {
    this.ucitajGradove();
  }

  ucitajGradove(): void {
    this.gradService.findAll().subscribe(data => {
      this.gradovi = data;
    });
  }

  prikaziFormu(): void {
    this.formaVidljiva = true;
    this.editMode = false;
    this.noviGrad = { naziv: '' };
  }

  sacuvaj(): void {
    if (this.editMode && this.odabraniGrad?.id) {
      this.gradService.update(this.odabraniGrad.id, this.noviGrad).subscribe(() => {
        this.ucitajGradove();
        this.zatvoriFormu();
      });
    } else {
      this.gradService.save(this.noviGrad).subscribe(() => {
        this.ucitajGradove();
        this.zatvoriFormu();
      });
    }
  }

  uredi(grad: Grad): void {
    this.odabraniGrad = grad;
    this.noviGrad = { ...grad };  // kopija objekta da ne menjamo original
    this.editMode = true;
    this.formaVidljiva = true;
  }

  obrisi(id: number): void {
    if (confirm('Da li ste sigurni da želite da obrišete ovaj grad?')) {
      this.gradService.delete(id).subscribe(() => {
        this.ucitajGradove();
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