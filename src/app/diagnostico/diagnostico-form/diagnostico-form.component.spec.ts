import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticoFormComponent } from './diagnostico-form.component';

describe('DiagnosticoFormComponent', () => {
  let component: DiagnosticoFormComponent;
  let fixture: ComponentFixture<DiagnosticoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiagnosticoFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagnosticoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
