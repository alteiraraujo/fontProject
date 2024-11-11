import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-fornecedor-modal',
  templateUrl: './fornecedor-modal.component.html',
  styleUrls: ['./fornecedor-modal.component.css']
})
export class FornecedorModalComponent {


  isVisible = false;
  
  supplierForm: FormGroup;
  bairros = [
    { id: 1, name: 'Bairro A' },
    { id: 2, name: 'Bairro B' }
  ];
  cidades = [
    { id: 1, name: 'Cidade X' },
    { id: 2, name: 'Cidade Y' }
  ];
  telefones = [
    { id: 1, number: '(11) 1234-5678' },
    { id: 2, number: '(11) 9876-5432' }
  ];

  constructor(private fb: FormBuilder) {
    this.supplierForm = this.fb.group({
      nomeFornecedor: ['', Validators.required],
      cepFornecedor: ['', Validators.required],
      cnpjFornecedor: ['', Validators.required],
      complementoFornecedor: [''],
      ieFornecedor: [''],
      numeroEstabelecimento: ['', Validators.required],
      ruaFornecedor: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      telefone: ['', Validators.required]
    });
  }

  handleOk(): void {
    if (this.supplierForm.valid) {
      console.log(this.supplierForm.value);
      this.isVisible = false;
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  addNewBairro(): void {
    // Lógica para adicionar um novo bairro
  }

  addNewTelefone(): void {
    // Lógica para adicionar um novo telefone
  }

}
