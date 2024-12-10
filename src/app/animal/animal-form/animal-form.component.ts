import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { Router } from '@angular/router';

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
      nome_animal: ['', [Validators.required, Validators.minLength(3)]],
      idade_animal: ['', [Validators.required, Validators.min(0)]],
      selectedPessoaId: ['', Validators.required],
      selectedRacaId: ['', Validators.required],
      status_animal: ['Ativo', Validators.required],
    });

    // Carregar listas de pessoas e raças
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

    instance.pessoaCadastrada.subscribe((novaPessoa: any) => {
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

    instance.racaCadastrada.subscribe((novaRaca: any) => {
      this.message.success('Raça cadastrada com sucesso!');
      modalRef.close();
      this.refreshRacasList();
    });

    instance.cancelado.subscribe(() => {
      this.message.info('Cadastro de raça cancelado.');
      modalRef.close();
    });
  }

  onSubmit(): void {
    if (this.animalForm.valid) {
      const novoAnimal: Animal = {
        nome_animal: this.animalForm.value.nome_animal,
        idade_animal: this.animalForm.value.idade_animal,
        status_animal: 'Ativo',
        pessoa: { id_pessoa: this.animalForm.value.selectedPessoaId },
        raca: { id_raca: this.animalForm.value.selectedRacaId },
      };

      this.animalService.create(novoAnimal).subscribe({
        next: (response) => {
          this.message.success('Animal cadastrado com sucesso!');
          this.animalCadastrado.emit(response); // Emite o evento com o novo animal
          this.modalRef.close(); // Fecha o modal
        },
        error: (error) => {
          this.message.error(
            error.error || 'Erro ao cadastrar o animal. Tente novamente.'
          );
        },
      });
    } else {
      this.message.error('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  cancel(): void {
    this.cancelado.emit(); // Emite o evento para o componente pai
    this.modalRef.close(); // Fecha o modal diretamente
  }
}
