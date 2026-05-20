import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Grad } from '../models/grad.model';

@Injectable({
  providedIn: 'root'
})
export class GradService {

  private apiUrl = 'http://localhost:9000/api/gradovi';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Grad[]> {
    return this.http.get<Grad[]>(this.apiUrl);
  }

  findById(id: number): Observable<Grad> {
    return this.http.get<Grad>(`${this.apiUrl}/${id}`);
  }

  save(grad: Grad): Observable<Grad> {
    return this.http.post<Grad>(this.apiUrl, grad);
  }

  update(id: number, grad: Grad): Observable<Grad> {
    return this.http.put<Grad>(`${this.apiUrl}/${id}`, grad);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}