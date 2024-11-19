import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Raca } from './raca';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RacaService {

  private readonly API = 'http://localhost:8080/racas';

  constructor(private http: HttpClient) { }

  list(): Observable<Raca[]>{
    return this.http.get<Raca[]>(this.API)
    .pipe(
      delay(500),
      tap(console.log)
    );
  }

  updateStatus(id_raca: number, status_raca: string): Observable<any> {
    return this.http.put(`${this.API}/${id_raca}`, { status_raca: status_raca })
      .pipe(
        tap(() => console.log(`Status da raça com ID ${id_raca} atualizado para ${status_raca}`))
      );
  }

  create(raca: Raca): Observable<Raca> {
    return this.http.post<Raca>(this.API, raca).pipe(
      tap((novaRaca) => console.log('Raça criada:', novaRaca))
    );
  }
}
