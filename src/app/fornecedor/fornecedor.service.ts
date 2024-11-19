import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, tap } from 'rxjs';
import { Fornecedor } from './fornecedor';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {

private readonly API ='http://localhost:8080/fornecedores';

  constructor(private http: HttpClient) { }

  list(): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(this.API)
      .pipe(
        delay(500),
        tap(console.log)
      );
  }

  updateStatus(id_fornecedor: number, status_fornecedor: string): Observable<any> {
    return this.http.put(`${this.API}/${id_fornecedor}`, { status_fornecedor: status_fornecedor })
      .pipe(
        tap(() => console.log(`Status do produto com ID ${id_fornecedor} atualizado para ${status_fornecedor}`))
      );
  }
}
