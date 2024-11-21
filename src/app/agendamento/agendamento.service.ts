import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agendamento } from './agendamento';

@Injectable({
  providedIn: 'root',
})
export class AgendamentoService {
  private readonly API = 'http://localhost:8080/agendamentos';

  constructor(private http: HttpClient) {}

  list(): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(this.API);
  }

  add(agendamento: Agendamento): Observable<Agendamento> {
    return this.http.post<Agendamento>(this.API, agendamento);
  }

  update(id_agenda: number, agendamento: Partial<Agendamento>): Observable<Agendamento> {
    return this.http.put<Agendamento>(`${this.API}/${id_agenda}`, agendamento); // Usando this.API para consistência
  }
}
