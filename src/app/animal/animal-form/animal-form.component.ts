import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PessoaService } from 'src/app/pessoa/pessoa.service';
import { RacaService } from 'src/app/raca/raca.service';
import { AnimalService } from '../animal.service';
import { Animal } from '../animal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { PessoaFormComponent } from 'src/app/pessoa/pessoa-form/pessoa-form.component';
import { RacaFormComponent } from 'src/app/raca/raca-form/raca-form.component';
import { ModoFormulario } from 'src/app/enuns/modo-formulario.enum';
import { MensagensInfo } from 'src/app/enuns/mensagens-info.enum';

@Component({
  selector: 'app-animal-form',
  templateUrl: './animal-form.component.html',
  styleUrls: ['./animal-form.component.css'],
})
export class AnimalFormComponent implements OnInit {
  @Output() animalCadastrado: EventEmitter<Animal> = new EventEmitter<Animal>();
  @Output() cancelado: EventEmitter<void> = new EventEmitter<void>();

  animalForm: FormGroup;
  pessoas$: Observable<any[]>;
  racas$: Observable<any[]>;

  @Input() animal?: {
    id_animal?: number;
    nome_animal: string;
    data_nascimento: string | Date;
    status_animal: string;
    pessoa: {
      id_pessoa: number;
      nome_pessoa?: string;
    };
    raca: {
      id_raca: number;
      nome_raca?: string;
    };
  };

  @Input() modo!: 'cadastrar' | 'editar' | 'abrir';

  constructor(
    private fb: FormBuilder,
    private pessoaService: PessoaService,
    private racaService: RacaService,
    private animalService: AnimalService,
    private message: NzMessageService,
    private modal: NzModalService,
    private modalRef: NzModalRef
  ) {}

  ngOnInit(): void {
    this.animalForm = this.fb.group({
      nome_animal: [
        this.animal?.nome_animal || '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(30)],
      ],
      data_nascimento: [
        this.animal?.data_nascimento || null,
        [Validators.required],
      ],
      selectedPessoaId: [
        this.animal?.pessoa?.id_pessoa || '',
        Validators.required,
      ],
      selectedRacaId: [
        this.animal?.raca?.id_raca || '',
        Validators.required,
      ],
      status_animal: [
        this.animal?.status_animal || 'Ativo',
        Validators.required,
      ],
    });

    if (this.modo === 'abrir') {
      this.animalForm.disable(); // Desabilita o formulário no modo "abrir"
    }

    this.refreshPessoasList();
    this.refreshRacasList();
  }

  refreshPessoasList(): void {
    this.pessoas$ = this.pessoaService.list();
  }

  refreshRacasList(): void {
    this.racas$ = this.racaService.list();
  }

  openPessoaModal(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Cadastrar Pessoa',
      nzContent: PessoaFormComponent,
      nzFooter: null,
      nzWidth: '600px',
    });

    const instance = modalRef.getContentComponent() as PessoaFormComponent;

    instance.pessoaCadastrada.subscribe(() => {
      this.message.success('Pessoa cadastrada com sucesso!');
      modalRef.close();
      this.refreshPessoasList();
    });

    instance.cancelado.subscribe(() => {
      this.message.info('Cadastro de pessoa cancelado.');
      modalRef.close();
    });
  }

  onPessoaChange(pessoaId: number): void {
    console.log('Pessoa selecionada:', pessoaId);
  }

  onRacaChange(racaId: number): void {
    console.log('Raça selecionada:', racaId);
  }

  openRacaModal(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Cadastrar Raça',
      nzContent: RacaFormComponent,
      nzFooter: null,
      nzWidth: '600px',
    });

    const instance = modalRef.getContentComponent() as RacaFormComponent;


  }

  onSubmit(): void {
    if (this.animalForm.valid) {
      const animalData: Animal = {
        id_animal: this.animal?.id_animal,
        nome_animal: this.animalForm.value.nome_animal,
        data_nascimento: this.animalForm.value.data_nascimento,
        status_animal: this.animalForm.value.status_animal,
        pessoa: { id_pessoa: this.animalForm.value.selectedPessoaId },
        raca: { id_raca: this.animalForm.value.selectedRacaId },
      };

      if (this.modo === 'editar' && this.animal?.id_animal) {
        this.animalService.update(this.animal.id_animal, animalData).subscribe({
          next: () => {
            this.message.success('Animal atualizado com sucesso!');
            this.modalRef.close(animalData);
          },
          error: () => {
           // this.message.error('Erro ao atualizar o animal. Tente novamente.');
          },
        });
      } else if (this.modo === 'cadastrar') {
        this.animalService.create(animalData).subscribe({
          next: (response) => {
            this.message.success('Animal cadastrado com sucesso!');
            this.animalCadastrado.emit(response);
            this.modalRef.close();
          },
          error: () => {
            this.message.error('Erro ao cadastrar o animal. Tente novamente.');
          },
        });
      }
    } else {
      this.message.error('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  cancel(): void {
    if (this.modo === ModoFormulario.CADASTRAR) {
      this.message.info(MensagensInfo.CADASTRO_CANCELADO);
    } else if (this.modo === ModoFormulario.EDITAR) {
      this.message.info(MensagensInfo.EDICAO_CANCELADA);
    }
    this.modalRef.close();
  }

  closeModal(resultado?: any): void {
    this.modalRef.destroy(resultado);
  }

  getTitulo(): string {
    return this.modo === 'cadastrar'
      ? 'Cadastrar Animal'
      : this.modo === 'editar'
      ? 'Editar Animal'
      : 'Detalhes do Animal';
  }

  desabilitarDataFutura = (current: Date): boolean => {
  // Bloqueia datas após hoje
  return current && current > new Date();
};

}
