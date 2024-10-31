import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Produto } from './produto';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {

  private readonly API ='http://localhost:8080/produtos';

  constructor(private http: HttpClient) { }

  list(){
    return this.http.get<Produto[]>(this.API)
    .pipe(
      delay(500),
      tap(console.log)
    );
  }
}
