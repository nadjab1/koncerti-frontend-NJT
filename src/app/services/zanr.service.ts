import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Zanr {
  id?: number;
  naziv: string;
}

@Injectable({
  providedIn: 'root'
})
export class ZanrService {

  private apiUrl = 'http://localhost:9000/api/zanrovi';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Zanr[]> {
    return this.http.get<Zanr[]>(this.apiUrl);
  }

  save(zanr: Zanr): Observable<Zanr> {
    return this.http.post<Zanr>(this.apiUrl, zanr);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}