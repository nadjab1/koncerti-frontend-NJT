import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lokacija } from '../models/lokacija.model';

@Injectable({
  providedIn: 'root'
})
export class LokacijaService {

  private apiUrl = 'http://localhost:9000/api/lokacije';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Lokacija[]> {
    return this.http.get<Lokacija[]>(this.apiUrl);
  }

  findById(id: number): Observable<Lokacija> {
    return this.http.get<Lokacija>(`${this.apiUrl}/${id}`);
  }

  save(lokacija: Lokacija): Observable<Lokacija> {
    return this.http.post<Lokacija>(this.apiUrl, lokacija);
  }

  update(id: number, lokacija: Lokacija): Observable<Lokacija> {
    return this.http.put<Lokacija>(`${this.apiUrl}/${id}`, lokacija);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}