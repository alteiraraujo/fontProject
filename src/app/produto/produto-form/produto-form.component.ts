import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FornecedorModalComponent } from 'src/app/fornecedor/fornecedor-modal/fornecedor-modal.component';


@Component({
  selector: 'app-produto-form',
  templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.css']
})
export class ProdutoFormComponent {

  productForm: FormGroup;

  categories = [
    { id: 1, name: 'Categoria A' },
    { id: 2, name: 'Categoria B' }
    // Adicione mais categorias conforme necessário
  ];
  suppliers = [
    { id: 1, name: 'Fornecedor X' },
    { id: 2, name: 'Fornecedor Y' }
    // Adicione mais fornecedores conforme necessário
  ];
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productDescription: ['', Validators.required],
      purchasePrice: ['', [Validators.required, Validators.min(0)]],
      salePrice: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      supplier: ['', Validators.required]
    });
  }
  onSubmit(): void {
    if (this.productForm.valid) {
      console.log(this.productForm.value);
      // Lógica para salvar o produto
    }
  }

  addNewCategory(): void {
    
    // Lógica para adicionar nova categoria
  }

  addNewSupplier(): void {
    // Lógica para adicionar novo fornecedor
  }

  @ViewChild(FornecedorModalComponent) fornecedorModal: FornecedorModalComponent;

  showFornecedorModal(): void {
    this.fornecedorModal.isVisible = true; // Abre o modal do fornecedor
  }

}
