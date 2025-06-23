import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Produto } from '../produto';
import { ProdutosService } from '../produtos.service';
import { CategoriaService } from 'src/app/categoria/categoria.service'; // ajuste se necessário
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-produto-form',
  templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.css'],
})
export class ProdutoFormComponent implements OnInit, OnChanges {
  @Input() produto?: Produto;
  @Input() modo!: 'cadastrar' | 'editar' | 'abrir';

  produtoForm: FormGroup;
  categorias$: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private produtosService: ProdutosService,
    private categoriaService: CategoriaService,
    private message: NzMessageService,
    private modalRef: NzModalRef,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.categorias$ = this.categoriaService.list(); // ajuste para o seu service
    this.criarFormulario();

    if (this.produto) {
      this.preencherFormulario(this.produto);
    }
    if (this.modo === 'abrir') {
      this.produtoForm.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['produto'] && changes['produto'].currentValue) {
      this.preencherFormulario(changes['produto'].currentValue);
    }
    if (changes['modo'] && changes['modo'].currentValue === 'abrir') {
      this.produtoForm?.disable();
    }
    if (changes['modo'] && changes['modo'].currentValue !== 'abrir') {
      this.produtoForm?.enable();
    }
  }

  criarFormulario() {
    this.produtoForm = this.fb.group({
      cod_produto: [null, Validators.required],
      desc_produto: [null, Validators.required],
      qtd_produto: [null, Validators.required],
      valor_compra_produto: [null, Validators.required],
      valor_venda_produto: [null, Validators.required],
      selectedCategoriaId: [null, Validators.required],
    });
  }

  preencherFormulario(produto: Produto) {
    if (this.produtoForm) {
      this.produtoForm.patchValue({
        cod_produto: produto.cod_produto || null,
        desc_produto: produto.desc_produto || null,
        qtd_produto: produto.qtd_produto || null,
        valor_compra_produto: produto.valor_compra_produto || null,
        valor_venda_produto: produto.valor_venda_produto || null,
        selectedCategoriaId: produto.categoria?.id_categoria || null,
      });
    }
  }

  onCategoriaChange(id: number) {
    // Se quiser tratar algo ao mudar categoria, faça aqui
  }

  openCategoriaModal(): void {
    // Implemente se quiser abrir modal de categoria
    // this.modalService.create({...})
  }

  onSubmit(): void {
    if (this.produtoForm.valid) {
      const formValue = this.produtoForm.getRawValue();
      const produtoData: any = {
        ...this.produto,
        cod_produto: formValue.cod_produto,
        desc_produto: formValue.desc_produto,
        qtd_produto: formValue.qtd_produto,
        valor_compra_produto: formValue.valor_compra_produto,
        valor_venda_produto: formValue.valor_venda_produto,
        tbl_categoria_id: formValue.selectedCategoriaId, // <- Envie exatamente como backend espera
        status_produto: 'Ativo',
      };

      if (this.modo === 'editar' && this.produto && this.produto.id_produto) {
        this.produtosService
          .update(this.produto.id_produto, produtoData)
          .subscribe({
            next: (response) => {
              this.message.success('Produto atualizado com sucesso!');
              this.modalRef.close(response);
            },
            error: () => {
              this.message.error('Erro ao atualizar produto. Tente novamente.');
            },
          });
      } else if (this.modo === 'cadastrar') {
        this.produtosService.create(produtoData).subscribe({
          next: (response) => {
            this.message.success('Produto cadastrado com sucesso!');
            this.modalRef.close(response);
          },
          error: () => {
            this.message.error('Erro ao cadastrar produto. Tente novamente.');
          },
        });
      }
    } else {
      this.message.error('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  cancelar(): void {
    this.modalRef.close();
  }
}
