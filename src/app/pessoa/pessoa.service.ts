import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map, Observable, tap } from 'rxjs';
import { Pessoa } from './pessoa';

@Injectable({
  providedIn: 'root',
})
export class PessoaService {
  private readonly API = 'http://localhost:8080/pessoas';

  constructor(private http: HttpClient) {}

  list(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(this.API).pipe(
      delay(500),
      tap((response) => console.log('Lista de pessoas carregada:', response)),
      map((lista) => 
      lista.sort((a, b) => b.id_pessoa - a.id_pessoa) // do maior para menor
    )
    );
  }

  create(pessoa: Pessoa): Observable<Pessoa> {
    return this.http
      .post<Pessoa>(this.API, pessoa)
      .pipe(
        tap((response) => console.log('Pessoa criada com sucesso:', response))
      );
  }

  updateStatus(id_pessoa: number, status: string): Observable<any> {
    return this.http
      .put(`${this.API}/${id_pessoa}`, { status_pessoa: status })
      .pipe(
        tap(() =>
          console.log(
            `Status da pessoa com ID ${id_pessoa} atualizado para ${status}`
          )
        )
      );
  }

  cadastrarPessoa(pessoa: Pessoa): Observable<Pessoa> {
    return this.http
      .post<Pessoa>(this.API, pessoa)
      .pipe(tap((response) => console.log('Pessoa cadastrada:', response)));
  }

  update(id_pessoa: number, pessoa: Pessoa): Observable<Pessoa> {
    return this.http
      .put<Pessoa>(`${this.API}/${id_pessoa}`, pessoa)
      .pipe(
        tap((response) =>
          console.log(`Pessoa com ID ${id_pessoa} atualizada:`, response)
        )
      );
  }

  buscarCEP(cep: string): Observable<any> {
    return this.http
      .get(`https://viacep.com.br/ws/${cep}/json/`)
      .pipe(tap((response) => console.log('Dados do CEP buscados:', response)));
  }

  cpfExiste(cpf: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.API}/existe-cpf/${cpf}`);
  }
}
