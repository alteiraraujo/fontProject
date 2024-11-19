import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PessoaService } from 'src/app/pessoa/pessoa.service';
import { RacaService } from 'src/app/raca/raca.service';
import { AnimalService } from '../animal.service';
import { Animal } from '../animal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-animal-form',
  templateUrl: './animal-form.component.html',
  styleUrls: ['./animal-form.component.css'],
})
export class AnimalFormComponent implements OnInit {
  animalForm: FormGroup;
  pessoas$: Observable<any[]>; // Observable para a lista de pessoas
  racas$: Observable<any[]>; // Observable para a lista de raças

  constructor(
    private fb: FormBuilder,
    private pessoaService: PessoaService,
    private racaService: RacaService,
    private animalService: AnimalService,
    private message: NzMessageService
   
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
    this.pessoas$ = this.pessoaService.list();
    this.racas$ = this.racaService.list();
  }

  onPessoaChange(pessoaId: number): void {
    console.log('Pessoa selecionada:', pessoaId);
  }

  onRacaChange(racaId: number): void {
    console.log('Raça selecionada:', racaId);
  }

  openPessoaModal(): void {
    console.log('Abrir modal para adicionar uma nova pessoa');
    // Lógica para abrir o modal de pessoa
  }

  openRacaModal(): void {
    console.log('Abrir modal para adicionar uma nova raça');
    // Lógica para abrir o modal de raça
  }

  onSubmit(): void {
    if (this.animalForm.valid) {
      // Cria o JSON no formato correto para o backend
      const novoAnimal: Animal = {
        nome_animal: this.animalForm.value.nome_animal,
        idade_animal: this.animalForm.value.idade_animal,
        status_animal: this.animalForm.value.status_animal,
        pessoa: { id_pessoa: this.animalForm.value.selectedPessoaId },
        raca: { id_raca: this.animalForm.value.selectedRacaId },
      };
  
      // Envia o objeto ao backend
      this.animalService.create(novoAnimal).subscribe({
        next: (response) => {
          console.log('Animal criado com sucesso:', response);
          this.message.success('Animal cadastrado com sucesso!');
          this.animalForm.reset({
            nome_animal: '',
            idade_animal: '',
            selectedPessoaId: '',
            selectedRacaId: '',
            status_animal: 'Ativo',
          });
        },
        error: (error) => {
          console.error('Erro ao criar animal:', error);
          this.message.error(error.error || 'Erro ao cadastrar o animal. Tente novamente.');
        },
      });
    }
  }
  
}
