import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { FinemappingComponent } from './components/finemapping/finemapping.component';
import { SnpQueryComponent } from './components/snp-query/snp-query.component';

const routes: Routes = [
  { path: '', component: SnpQueryComponent },
  { path: 'finemapping', component: FinemappingComponent },
  { path: 'about', component: AboutComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
 }
