import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Koncert } from '../models/koncert.model';

@Injectable({
  providedIn: 'root'
})
export class KoncertService {

  private apiUrl = 'http://localhost:9000/api/koncerti';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Koncert[]> {
    return this.http.get<Koncert[]>(this.apiUrl);
  }

  findById(id: number): Observable<Koncert> {
    return this.http.get<Koncert>(`${this.apiUrl}/${id}`);
  }

  findByStatus(status: string): Observable<Koncert[]> {
    return this.http.get<Koncert[]>(`${this.apiUrl}/status?status=${status}`);
  }

  save(koncert: Koncert): Observable<Koncert> {
    return this.http.post<Koncert>(this.apiUrl, koncert);
  }

  update(id: number, koncert: Koncert): Observable<Koncert> {
    return this.http.put<Koncert>(`${this.apiUrl}/${id}`, koncert);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}