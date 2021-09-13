import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { FinemappingComponent } from './components/finemapping/finemapping.component';
import { SnpQueryComponent } from './components/snp-query/snp-query.component';
import { ViewerComponent } from './components/viewer/viewer.component';

const routes: Routes = [
  { path: 'search', component: SnpQueryComponent },
  { path: 'finemapping', component: FinemappingComponent },
  { path: 'viewer', component: ViewerComponent},
  { path: 'about', component: AboutComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
 }
