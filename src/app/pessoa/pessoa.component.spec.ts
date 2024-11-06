import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PessoaComponent } from './pessoa.component';

describe('ClienteComponent', () => {
  let component: PessoaComponent;
  let fixture: ComponentFixture<PessoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PessoaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PessoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
