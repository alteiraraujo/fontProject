import { Component, OnInit } from '@angular/core';
import { Observable, Subject, catchError, map, of, pipe } from 'rxjs';
import { Produto } from './produto';
import { ProdutosService } from './produtos.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css'],
  preserveWhitespaces: true,
})
export class ProdutoComponent implements OnInit {
  produtos$: Observable<Produto[]>;
  produtosFiltrados$: Observable<Produto[]>;
  pageIndex = 1;
  pageSize = 10;

  constructor(private service: ProdutosService) {}

  ngOnInit() {
    this.produtos$ = this.service.list();

    this.produtosFiltrados$ = this.produtos$.pipe(
      map(produtos =>
        produtos.slice((this.pageIndex - 1) * this.pageSize, this.pageIndex * this.pageSize)
      )
    );
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.produtosFiltrados$ = this.produtos$.pipe(
      map(produtos =>
        produtos.slice((this.pageIndex - 1) * this.pageSize, this.pageIndex * this.pageSize)
      )
    );
  }
}
