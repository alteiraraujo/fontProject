import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnimalComponent } from './animal.component';
import { AnimalFormComponent } from './animal-form/animal-form.component';

const routes: Routes = [
  {path:'', component: AnimalComponent},
  {path:'novo', component: AnimalFormComponent},
  {path:'editar/:id', component: AnimalFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnimalRoutingModule { }
