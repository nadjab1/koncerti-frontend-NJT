import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Izvodjac {
  id?: number;
  kontaktEmail: string;
  tip: 'MUZICAR' | 'BEND';
  ime?: string;
  prezime?: string;
  pol?: string;
  naziv?: string;
  brojClanova?: number;
}

@Injectable({
  providedIn: 'root'
})
export class IzvodjacService {

  private apiUrl = 'http://localhost:9000/api/izvodjaci';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Izvodjac[]> {
    return this.http.get<Izvodjac[]>(this.apiUrl);
  }

  sacuvajMuzicara(muzicar: Izvodjac): Observable<Izvodjac> {
    return this.http.post<Izvodjac>(`${this.apiUrl}/muzicar`, muzicar);
  }

  sacuvajBend(bend: Izvodjac): Observable<Izvodjac> {
    return this.http.post<Izvodjac>(`${this.apiUrl}/bend`, bend);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}