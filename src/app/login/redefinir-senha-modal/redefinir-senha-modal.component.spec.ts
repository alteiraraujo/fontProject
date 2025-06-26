import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedefinirSenhaModalComponent } from './redefinir-senha-modal.component';

describe('RedefinirSenhaModalComponent', () => {
  let component: RedefinirSenhaModalComponent;
  let fixture: ComponentFixture<RedefinirSenhaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedefinirSenhaModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedefinirSenhaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
