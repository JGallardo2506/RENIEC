import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dni } from '../model/dni';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DniService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Dni[]> {
    return this.http.get<Dni[]>(`${this.baseUrl}/`);
  }

  getByDni(dni: string): Observable<Dni> {
    return this.http.get<Dni>(`${this.baseUrl}/dni/${dni}`);
  }

  getByStatus(status: string): Observable<Dni[]> {
    return this.http.get<Dni[]>(`${this.baseUrl}/status?status=${status}`);
  }

  restoreDni(id: number): Observable<string> {
    return this.http.put<string>(
      `${this.baseUrl}/restore/${id}`,
      {},
      { responseType: 'text' as 'json' }
    );
  }

  updateDni(id: number, dni: string): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/update/${id}?dni=${dni}`, null, {
      responseType: 'text' as 'json'
    });
  }

  consultDni(dni: string): Observable<Dni> {
    return this.http.post<Dni>(`${this.baseUrl}/consultar?dni=${dni}`, {});
  }

  deleteLogical(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, {
      responseType: 'text',
    });
  }

  deleteFisical(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete/fisical/${id}`, {
      responseType: 'text',
    });
  }
}
