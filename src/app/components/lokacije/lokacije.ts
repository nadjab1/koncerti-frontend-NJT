import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Lokacija } from '../../models/lokacija.model';
import { Grad } from '../../models/grad.model';
import { LokacijaService } from '../../services/lokacija.service';
import { GradService } from '../../services/grad.service';

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

  novaLokacija: Lokacija = {
    naziv: '',
    adresa: '',
    kapacitet: 0,
    grad: { naziv: '' }
  };
  odabranaLokacija: Lokacija | null = null;

  constructor(
    private lokacijaService: LokacijaService,
    private gradService: GradService
  ) {}

  ngOnInit(): void {
    this.ucitajLokacije();
    this.ucitajGradove();
  }

  ucitajLokacije(): void {
    this.lokacijaService.findAll().subscribe(data => {
      this.lokacije = data;
    });
  }

  ucitajGradove(): void {
    this.gradService.findAll().subscribe(data => {
      this.gradovi = data;
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
      this.lokacijaService.update(this.odabranaLokacija.id, this.novaLokacija).subscribe(() => {
        this.ucitajLokacije();
        this.zatvoriFormu();
      });
    } else {
      this.lokacijaService.save(this.novaLokacija).subscribe(() => {
        this.ucitajLokacije();
        this.zatvoriFormu();
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
      this.lokacijaService.delete(id).subscribe(() => {
        this.ucitajLokacije();
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