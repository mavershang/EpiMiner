import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule} from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule }  from '@angular/material/sort';
import { MatTableFilterModule } from 'mat-table-filter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { NgxChartModule } from 'ngx-chart';
import { NgxChartsModule }from '@swimlane/ngx-charts';
// import { NgChartsModule } from 'ng2-charts'



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SnpQueryComponent } from './components/snp-query/snp-query.component';
import { ViewerComponent } from './components/viewer/viewer.component';
import { FinemappingComponent } from './components/finemapping/finemapping.component';
import { AboutComponent } from './components/about/about.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogComponent } from './components/dialog/dialog.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { NetworkInterceptor } from './network.interceptor';
import { TopSnpModalComponent } from './modals/top-snp-modal/top-snp-modal.component';
import { EpiBrowserComponent } from './components/epi-browser/epi-browser.component';
import { EgSidebarComponent } from './components/eg-sidebar/eg-sidebar.component';
import { ExcelService } from './services/excel.service';
import { DataSummaryComponent } from './components/data-summary/data-summary.component';
import { TrackTreeComponent } from './components/track-tree/track-tree.component';
import { MatTreeModule } from '@angular/material/tree';
import { AnalysisPlotComponent } from './components/analysis-plot/analysis-plot.component';
import { CreditReportComponent } from './components/credit-report/credit-report.component';
import { FunStuffComponent } from './components/fun-stuff/fun-stuff.component';
import { BubblePlotBase } from './components/plot/bubble-plot-base/bubble-plot-base.component';
import { PlotBulkRNASeqExprComponent } from './components/plot/plot-bulk-rnaseq-expr/plot-bulk-rnaseq-expr.component';
import { PlotHolderExprComponent } from './components/plot/plot-holder-expr/plot-holder-expr.component';
import { TestComponent } from './components/plot/test/test.component';
import { TestNgxEchartComponent } from './components/plot/test-ngx-echart/test-ngx-echart.component';

@NgModule({
  declarations: [
    AppComponent,
    SnpQueryComponent,
    ViewerComponent,
    FinemappingComponent,
    AboutComponent,
    DialogComponent,
    TopSnpModalComponent,
    EpiBrowserComponent,
    EgSidebarComponent,
    DataSummaryComponent,
    TrackTreeComponent,
    AnalysisPlotComponent,
    CreditReportComponent,
    FunStuffComponent,
    BubblePlotBase,
    PlotBulkRNASeqExprComponent,
    PlotHolderExprComponent,
    TestComponent,
    TestNgxEchartComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatCheckboxModule,
    MatTableModule,
    MatSelectModule,
    MatSortModule,
    MatPaginatorModule,
    MatTabsModule,
    MatTableFilterModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatTreeModule,
    // NgxChartModule,
    NgxChartsModule,
    //NgChartsModule,  
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NetworkInterceptor,
      multi: true,

    },
    ExcelService,

  ],
  //add the schemas property and pass the CUSTOM_ELEMENTS_SCHEMA constant
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
