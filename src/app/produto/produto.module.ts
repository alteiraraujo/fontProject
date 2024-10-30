import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ProdutoRoutingModule } from './produto-routing.module';
import { ProdutoComponent } from './produto.component';
import { ProdutoDashboardComponent } from './paginas/produto-dashboard/produto-dashboard.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { ProdutoFormComponent } from './produto-form/produto-form.component';
import { NzFormModule } from 'ng-zorro-antd/form';



@NgModule({
  declarations: [
    ProdutoComponent,
    ProdutoDashboardComponent,
    ProdutoFormComponent,
   
  ],
  imports: [
    CommonModule,
    ProdutoRoutingModule,
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
    NzFormModule
  
  ]
})
export class ProdutoModule {
  

}
