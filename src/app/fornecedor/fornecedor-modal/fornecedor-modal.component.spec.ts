import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedorModalComponent } from './fornecedor-modal.component';

describe('FornecedorModalComponent', () => {
  let component: FornecedorModalComponent;
  let fixture: ComponentFixture<FornecedorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FornecedorModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FornecedorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
