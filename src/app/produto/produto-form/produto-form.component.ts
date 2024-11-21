import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProdutosService } from '../produtos.service';
import { CategoriaService } from 'src/app/categoria/categoria.service';
import { FornecedorService } from 'src/app/fornecedor/fornecedor.service';
import { Produto } from '../produto';

@Component({
  selector: 'app-produto-form',
  templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.css'],
})
export class ProdutoFormComponent implements OnInit {
  produtoForm: FormGroup;
  categorias$: Observable<any[]>;
  fornecedores$: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutosService,
    private categoriaService: CategoriaService,
    private fornecedorService: FornecedorService
  ) {}

  ngOnInit(): void {
    this.produtoForm = this.fb.group({
      cod_produto: ['', Validators.required],
      desc_produto: ['', Validators.required],
      qtd_produto: ['', Validators.required],
      valor_compra_produto: ['', Validators.required],
      valor_venda_produto: ['', Validators.required],
      selectedCategoriaId: ['', Validators.required],
      selectedFornecedorId: ['', Validators.required],
      status_produto: ['', Validators.required],
    });

    this.categorias$ = this.categoriaService.list();
    this.fornecedores$ = this.fornecedorService.list();
  }

  onCategoriaChange(categoriaId: number): void {
    console.log('Categoria selecionada:', categoriaId);
  }

  onFornecedorChange(fornecedorId: number): void {
    console.log('Fornecedor selecionado:', fornecedorId);
  }

  openCategoriaModal(): void {
    console.log('Abrir modal para adicionar uma nova categoria');
  }

  openFornecedorModal(): void {
    console.log('Abrir modal para adicionar um novo fornecedor');
  }

  onSubmit(): void {
    if (this.produtoForm.valid) {
      const novoProduto: Produto = {
        cod_produto: this.produtoForm.value.cod_produto,
        desc_produto: this.produtoForm.value.desc_produto,
        qtd_proudto: this.produtoForm.value.qtd_produto,
        valor_compra_produto: this.produtoForm.value.valor_compra_produto,
        valor_venda_produto: this.produtoForm.value.valor_venda_produto,
        status_produto: 'Ativo', // Define automaticamente como "Ativo"
        categoria: { id_categoria: this.produtoForm.value.selectedCategoriaId },
        fornecedor: { id_fornecedor: this.produtoForm.value.selectedFornecedorId },
      };
  
      this.produtoService.create(novoProduto).subscribe({
        next: (response) => {
          console.log('Produto criado com sucesso:', response);
          alert('Produto cadastrado com sucesso!');
          this.produtoForm.reset();
        },
        error: (error) => {
          console.error('Erro ao criar produto:', error);
          alert('Erro ao cadastrar o produto. Tente novamente.');
        },
      });
    }
  }
}
