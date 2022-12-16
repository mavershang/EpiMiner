import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { CreditReportComponent } from './components/credit-report/credit-report.component';
import { DataSummaryComponent } from './components/data-summary/data-summary.component';
import { EgSidebarComponent } from './components/eg-sidebar/eg-sidebar.component';
import { EpiBrowserComponent } from './components/epi-browser/epi-browser.component';
import { FinemappingComponent } from './components/finemapping/finemapping.component';
import { SnpQueryComponent } from './components/snp-query/snp-query.component';
import { TrackTreeComponent } from './components/track-tree/track-tree.component';
import { ViewerComponent } from './components/viewer/viewer.component';

const routes: Routes = [
  { path: '', component: DataSummaryComponent},
  { path: 'search', component: SnpQueryComponent },
  { path: 'finemapping', component: FinemappingComponent },
  { path: 'viewer', component: ViewerComponent},
  { path: 'epiBrowser', component: EpiBrowserComponent},
  { path: 'about', component: AboutComponent},
  { path: 'sidebar', component: EgSidebarComponent},
  { path: 'trackTree', component:TrackTreeComponent},
  { path: 'summary', component:DataSummaryComponent},
  { path: 'credit-report', component:CreditReportComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
 }
