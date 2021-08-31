import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SnpQueryComponent } from './components/snp-query/snp-query.component';

const routes: Routes = [
  { path: '', component: SnpQueryComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
