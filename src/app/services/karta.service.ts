import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Karta } from '../models/karta.model';

@Injectable({
  providedIn: 'root'
})
export class KartaService {

  private apiUrl = 'http://localhost:9000/api/karte';

  constructor(private http: HttpClient) {}

  findByKoncert(koncertId: number): Observable<Karta[]> {
    return this.http.get<Karta[]>(`${this.apiUrl}/koncert/${koncertId}`);
  }

  kupiKartu(id: number, imeKupca: string, emailKupca: string): Observable<Karta> {
    return this.http.post<Karta>(
      `${this.apiUrl}/${id}/kupi?imeKupca=${imeKupca}&emailKupca=${emailKupca}`,
      {}
    );
  }

  stornirajKartu(id: number): Observable<Karta> {
    return this.http.post<Karta>(`${this.apiUrl}/${id}/storniraj`, {});
  }
}