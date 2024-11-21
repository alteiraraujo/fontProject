import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnimalService } from 'src/app/animal/animal.service';
import { PessoaService } from 'src/app/pessoa/pessoa.service';
import { Agendamento } from '../agendamento';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-agendamento-form',
  templateUrl: './agendamento-form.component.html',
  styleUrls: ['./agendamento-form.component.css'],
})
export class AgendamentoFormComponent implements OnInit {
  @Input() agendamento: Agendamento | null = null;

  form: FormGroup;
  tutores: { label: string; value: string }[] = [];
  animais: { label: string; value: number }[] = [];
  procedimentos = ['Serviços estéticos', 'Consulta Clínica', 'Vacina'];

  constructor(
    private fb: FormBuilder,
    private animalService: AnimalService,
    private pessoaService: PessoaService,
    private modalRef: NzModalRef
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      data_hora_agendamento: [null, Validators.required],
      procedimento_agendamento: [null, Validators.required],
      tutor_animal: ['', Validators.required],
      animal: [null, Validators.required],
      status_agendamento: ['Pendente', Validators.required],
    });

    if (this.agendamento) {
      this.form.patchValue(this.agendamento);
    }

    this.carregarTutores();
  }

  carregarTutores(): void {
    this.pessoaService.list().subscribe({
      next: (pessoas) => {
        this.tutores = pessoas.map((pessoa) => ({
          label: pessoa.nome_pessoa,
          value: pessoa.id_pessoa.toString(),
        }));
      },
      error: () => {
        console.error('Erro ao carregar tutores');
      },
    });
  }

  onTutorChange(tutorId: string): void {
    this.animalService.list().subscribe({
      next: (animais) => {
        console.log('Lista completa de animais:', animais);
  
        // Filtra os animais pelo tutor selecionado
        const animaisDoTutor = animais.filter(
          (animal) => animal.pessoa.id_pessoa.toString() === tutorId
        );
  
        console.log('Animais filtrados pelo tutor:', animaisDoTutor);
  
        this.animais = animaisDoTutor.map((animal) => ({
          label: animal.nome_animal,
          value: animal.id_animal,
        }));
  
        this.form.get('animal')?.reset(); // Reseta o campo animal
      },
      error: (err) => {
        console.error('Erro ao carregar animais:', err);
      },
    });
  }
  

  submitForm(): void {
    if (this.form.valid) {
      const formData = this.form.value;
  
      const agendamento: Agendamento = {
        data_hora_agendamento: formData.data_hora_agendamento,
        animal: {
          id_animal: formData.animal,
          nome_animal: this.animais.find((a) => a.value === formData.animal)?.label,
        },
        procedimento_agendamento: formData.procedimento_agendamento,
        status_agendamento: 'Pendente',
        pessoa: {
          id_pessoa: formData.tutor_animal,
          nome_pessoa: this.tutores.find((t) => t.value === formData.tutor_animal)?.label || '',
        },
      };
  
      console.log('Dados para o POST:', agendamento);
  
      this.modalRef.close(agendamento);
    } else {
      this.form.markAllAsTouched();
    }
  }
  
  
  
  cancel(): void {
    this.modalRef.close();
  }
  
}
