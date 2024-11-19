import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Colaborador } from './colaborador';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {

  private readonly API = 'http://localhost:8080/colaboradores';

  constructor(private http: HttpClient) { }

  // Listar todos os colaboradores
  list(): Observable<Colaborador[]> {
    return this.http.get<Colaborador[]>(this.API)
      .pipe(
        delay(500),
        tap(console.log)
      );
  }

  // Atualizar o status do colaborador (Ativo/Inativo)
  updateStatus(id_colaborador: number, status: string): Observable<any> {
    return this.http.put(`${this.API}/${id_colaborador}`, { status_colaborador: status })
      .pipe(
        tap(() => console.log(`Status do colaborador com ID ${id_colaborador} atualizado para ${status}`))
      );
  }

  // Adicionar um novo colaborador
  add(colaborador: Colaborador): Observable<Colaborador> {
    return this.http.post<Colaborador>(this.API, colaborador)
      .pipe(
        tap((novoColaborador) => console.log('Novo colaborador adicionado:', novoColaborador))
      );
  }

  // Atualizar dados do colaborador
  update(id_colaborador: number, colaborador: Colaborador): Observable<Colaborador> {
    return this.http.put<Colaborador>(`${this.API}/${id_colaborador}`, colaborador)
      .pipe(
        tap(() => console.log(`Colaborador com ID ${id_colaborador} atualizado.`))
      );
  }

  // Remover um colaborador
  remove(id_colaborador: number): Observable<any> {
    return this.http.delete(`${this.API}/${id_colaborador}`)
      .pipe(
        tap(() => console.log(`Colaborador com ID ${id_colaborador} removido.`))
      );
  }
}
