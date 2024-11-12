import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, tap } from 'rxjs';
import { Pessoa } from './pessoa';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  private readonly API ='http://localhost:8080/pessoas';

  constructor(private http: HttpClient) { }
  
  list(): Observable<Pessoa[]>{
    return this.http.get<Pessoa[]>(this.API)
    .pipe(
      delay(500),
      tap(console.log)
    );
  }

  updateStatus(id_pessoa:number, status: string): Observable<any>{
    return this.http.put(`${this.API}/${id_pessoa}`, {status_pessoa: status})
    .pipe(
      tap(() => console.log(`Status da pessoa com ID ${id_pessoa} atualizado para ${status}`))
    );
  }
}
