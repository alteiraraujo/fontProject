import { Component, OnInit } from '@angular/core';
import { Observable, Subject, catchError, of, pipe } from 'rxjs';
import { Produto } from './produto';
import { ProdutosService } from './produtos.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css'],
  preserveWhitespaces: true,
})
export class ProdutoComponent implements OnInit {

  pageIndex = 1;
  pageSize = 10;
  //produtos = [];

  produtos: Produto[] = [];

  produtos$: Observable<Produto[]>;

  constructor(private service: ProdutosService) {}

  selectedValue = null;

  ngOnInit() {
    //this.service.list()
    //  .subscribe(dados => this.produtos$ = dados);

    this.produtos$ = this.service.list();
  }
}
