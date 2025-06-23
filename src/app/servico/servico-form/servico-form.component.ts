import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Servico } from '../servico';
import { ServicoService } from '../servico.service';
import { AnimalService } from '../../animal/animal.service';
import { ProdutosService } from '../../produto/produtos.service';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-servico-form',
  templateUrl: './servico-form.component.html',
  styleUrls: ['./servico-form.component.css'],
})
export class ServicoFormComponent implements OnInit, OnChanges {
  @Input() servico?: Servico;
  @Input() modo!: 'cadastrar' | 'editar' | 'abrir';

  form: FormGroup;
  animais$: Observable<any[]>;
  produtosArray: any[] = [];
  filteredProdutos: any[][] = [];
  carregando = true;
  
  

  constructor(
    private fb: FormBuilder,
    private servicoService: ServicoService,
    private animalService: AnimalService,
    private produtosService: ProdutosService,
    private message: NzMessageService,
    private modalRef: NzModalRef
  ) {}

  ngOnInit(): void {
    forkJoin({
      animais: this.animalService.list(),
      produtos: this.produtosService.list(),
    }).subscribe(({ animais, produtos }) => {
      this.produtosArray = produtos;
      this.animais$ = this.animalService.list();

      this.criarFormulario();

      if (this.servico) {
        this.preencherFormulario(this.servico);
      } else {
        this.form.get('data_servico')?.setValue(new Date());
        if (this.itens.length === 0) {
          this.adicionarItem();
        }
      }

      if (this.modo === 'abrir') {
        this.form.disable();
      }
      this.carregando = false;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.carregando) return;
    if (changes['servico'] && changes['servico'].currentValue) {
      this.preencherFormulario(changes['servico'].currentValue);
    }
    if (changes['modo'] && changes['modo'].currentValue === 'abrir') {
      this.form?.disable();
    }
    if (changes['modo'] && changes['modo'].currentValue !== 'abrir') {
      this.form?.enable();
    }
  }

  criarFormulario() {
    this.form = this.fb.group({
      id_animal: [null, Validators.required],
      obs_servico: [''],
      data_servico: [
        { value: new Date(), disabled: true },
        Validators.required,
      ],
      itens: this.fb.array([]),
    });
  }

  get itens(): FormArray {
    return this.form.get('itens') as FormArray;
  }

  adicionarItem() {
    this.itens.push(
      this.fb.group({
        produto: [null, Validators.required], // ID do produto
        produtoSearch: ['', Validators.required], // Nome digitado ou selecionado
        qtd: [1, [Validators.required, Validators.min(1)]],
        valor: [{ value: 0, disabled: true }],
      })
    );
    this.filteredProdutos.push(this.produtosArray);
  }

  removerItem(index: number) {
    this.itens.removeAt(index);
    this.filteredProdutos.splice(index, 1);
    this.atualizarValorTotal();
  }

  onProdutoSearch(index: number, value: string) {
    this.filteredProdutos[index] = this.produtosArray.filter(
      (prod) =>
        prod.desc_produto.toLowerCase().includes((value || '').toLowerCase()) ||
        (prod.cod_produto &&
          prod.cod_produto.toLowerCase().includes((value || '').toLowerCase()))
    );
  }

  // Após selecionar produto no autocomplete
  onProdutoSelect(index: number, produtoId: number) {
    const prod = this.produtosArray.find((p) => p.id_produto == produtoId);
    if (prod) {
      this.itens.at(index).get('produto')?.setValue(prod.id_produto);
      this.itens.at(index).get('produtoSearch')?.setValue(prod.desc_produto);
      this.itens.at(index).get('valor')?.setValue(prod.valor_venda_produto);
    } else {
      this.itens.at(index).get('valor')?.setValue(0);
    }
    this.atualizarValorTotal();
  }

  // Quando perder o foco do input produto (usuário digitou e saiu do campo)
  onProdutoBlur(index: number) {
    const prodName = this.itens.at(index).get('produtoSearch')?.value || '';
    const prod = this.produtosArray.find(
      (p) => p.desc_produto.toLowerCase() === prodName.toLowerCase()
    );
    if (prod) {
      this.itens.at(index).get('produto')?.setValue(prod.id_produto);
      this.itens.at(index).get('valor')?.setValue(prod.valor_venda_produto);
    } else {
      this.itens.at(index).get('produto')?.setValue(null);
      this.itens.at(index).get('valor')?.setValue(0);
    }
    this.atualizarValorTotal();
  }

  onQtdChange(index: number) {
    this.atualizarValorTotal();
  }

  atualizarValorTotal() {
    // Atualiza e força o Angular a recalcular
    this.form.get('itens')?.updateValueAndValidity();
  }

  calcularTotal(): number {
    const itens: any[] = this.form.getRawValue().itens;
    return itens.reduce((total, item) => {
      const qtd = Number(item.qtd) || 0;
      const valor = Number(item.valor) || 0;
      return total + qtd * valor;
    }, 0);
  }

  preencherFormulario(servico: Servico) {
    if (this.form) {
      this.form.patchValue({
        id_animal: servico.animal?.id_animal || null,
        obs_servico: servico.obs_servico || '',
        data_servico: servico.data_servico
          ? new Date(servico.data_servico)
          : new Date(),
      });

      this.itens.clear();
      this.filteredProdutos = [];
      if (servico['itens'] && servico['itens'].length > 0) {
        for (const item of servico['itens']) {
          const prod = this.produtosArray.find(
            (p) => p.id_produto == item.tbl_produto_id
          );
          const valor = prod
            ? prod.valor_venda_produto
            : item.valor_item_servico;
          this.itens.push(
            this.fb.group({
              produto: [item.tbl_produto_id, Validators.required],
              produtoSearch: [
                prod ? prod.desc_produto : '',
                Validators.required,
              ],
              qtd: [
                item.qtd_item_servico,
                [Validators.required, Validators.min(1)],
              ],
              valor: [{ value: valor, disabled: true }],
            })
          );
          this.filteredProdutos.push(this.produtosArray);
        }
      } else {
        this.adicionarItem();
      }
    }
  }

  submitForm(): void {
    if (this.form.valid) {
      const rawItens = this.form.getRawValue().itens;
      const data: any = {
        data_servico: this.form.get('data_servico')?.value,
        status_servico: 'Ativo',
        obs_servico: this.form.get('obs_servico')?.value,
        valor_servico: this.calcularTotal(),
        animal: { id_animal: this.form.get('id_animal')?.value },
        itens: rawItens.map((item: any) => ({
          tbl_produto_id: item.produto,
          qtd_item_servico: item.qtd,
          valor_item_servico: item.valor,
        })),
      };

      if (this.modo === 'editar' && this.servico?.id_servico) {
        this.servicoService.update(this.servico.id_servico, data).subscribe({
          next: (response) => {
            this.message.success('Serviço atualizado com sucesso!');
            this.modalRef.close(response);
          },
          error: () => {
            this.message.error('Erro ao atualizar serviço.');
          },
        });
      } else if (this.modo === 'cadastrar') {
        this.servicoService.create(data).subscribe({
          next: (response) => {
            this.message.success('Serviço cadastrado com sucesso!');
            this.modalRef.close(response);
          },
          error: () => {
            this.message.error('Erro ao cadastrar serviço.');
          },
        });
      }
    } else {
      this.message.error('Preencha todos os campos obrigatórios.');
    }
  }

  cancelar(): void {
    this.modalRef.close();
  }
}
