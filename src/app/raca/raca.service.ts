import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Raca } from './raca';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RacaService {
  private readonly API = 'http://localhost:8080/racas';

  constructor(private http: HttpClient) {}

  // Lista todas as raças
  list(): Observable<Raca[]> {
    return this.http.get<Raca[]>(this.API).pipe(
      delay(500),
      tap((racas) => console.log('Raças carregadas:', racas))
    );
  }

  // Atualiza o status de uma raça
  updateStatus(id_raca: number, status_raca: string): Observable<any> {
    return this.http.put(`${this.API}/${id_raca}/status`, { status_raca }).pipe(
      tap(() =>
        console.log(`Status da raça com ID ${id_raca} atualizado para ${status_raca}`)
      )
    );
  }

  // Cria uma nova raça
  create(raca: Raca): Observable<Raca> {
    return this.http.post<Raca>(this.API, raca).pipe(
      tap((novaRaca) => console.log('Raça criada:', novaRaca))
    );
  }

  // Busca uma raça por ID
  getById(id_raca: number): Observable<Raca> {
    return this.http.get<Raca>(`${this.API}/${id_raca}`).pipe(
      tap((raca) => console.log('Raça carregada:', raca))
    );
  }

  // Atualiza uma raça existente
  update(id_raca: number, raca: Raca): Observable<Raca> {
    return this.http.put<Raca>(`${this.API}/${id_raca}`, raca).pipe(
      tap((racaAtualizada) =>
        console.log('Raça atualizada:', racaAtualizada)
      )
    );
  }

  // Remove uma raça
  delete(id_raca: number): Observable<any> {
    return this.http.delete(`${this.API}/${id_raca}`).pipe(
      tap(() =>
        console.log(`Raça com ID ${id_raca} removida`)
      )
    );
  }
}
