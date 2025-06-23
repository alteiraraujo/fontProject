import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Diagnostico } from './diagnostico';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DiagnosticoService {
  private API = 'http://localhost:8080/diagnosticos';

  constructor(private http: HttpClient) {}

  list(): Observable<Diagnostico[]> {
    return this.http.get<Diagnostico[]>(this.API);
  }

  create(diagnostico: any): Observable<any> {
    return this.http.post(this.API, diagnostico);
  }

  update(id: number, diagnostico: any): Observable<any> {
    return this.http.put(`${this.API}/${id}`, diagnostico);
  }

  /** 
   * Atualiza apenas o status do diagnóstico (PATCH)
   */
  updateStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.API}/${id}`, { status_diagnostico: status });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
