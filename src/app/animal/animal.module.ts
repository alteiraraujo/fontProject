import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnimalRoutingModule } from './animal-routing.module';
import { AnimalFormComponent } from './animal-form/animal-form.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageModule } from 'ng-zorro-antd/message';


@NgModule({
  declarations: [
    AnimalFormComponent
  ],
  imports: [
    CommonModule,
    AnimalRoutingModule,
    NzButtonModule,
    NzTableModule,
    NzSwitchModule,
    FormsModule,
    NzInputModule,
    NzIconModule,
    NzSelectModule,
    NzTypographyModule,
    NzPaginationModule,
    ReactiveFormsModule,
    NzFormModule,
    NzImageModule,
    NzDividerModule,
    NzMessageModule
    
  ]
})
export class AnimalModule { }
