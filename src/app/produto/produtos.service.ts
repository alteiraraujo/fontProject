import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from './produto';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {

  private readonly API = 'http://localhost:8080/produtos';

  constructor(private http: HttpClient) { }

  list(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.API)
      .pipe(
        delay(500),
        tap(console.log)
      );
  }

  updateStatus(id_produto: number, status: string): Observable<any> {
    return this.http.put(`${this.API}/${id_produto}`, { status_produto: status })
      .pipe(
        tap(() => console.log(`Status do produto com ID ${id_produto} atualizado para ${status}`))
      );
  }
  
}
