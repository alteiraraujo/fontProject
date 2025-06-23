import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Servico } from './servico';
import { Observable, delay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicoService {
  private API = 'http://localhost:8080/servicos';

  constructor(private http: HttpClient) {}

  list(): Observable<Servico[]> {
    return this.http.get<Servico[]>(this.API).pipe(
      delay(500),
      tap((animais) => console.log('Lista de Serviços:', animais))
    );
  }

  getById(id: number): Observable<Servico> {
    return this.http.get<Servico>(`${this.API}/${id}`);
  }

  create(servico: Servico): Observable<Servico> {
    return this.http.post<Servico>(this.API, servico);
  }

  update(id: number, servico: Servico): Observable<Servico> {
    return this.http.put<Servico>(`${this.API}/${id}`, servico);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }

  // Atualizar status do serviço (opcional)
  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.API}/${id}`, { status_servico: status });
  }
}
