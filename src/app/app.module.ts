import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule }  from '@angular/material/sort';
import { MatTableFilterModule } from 'mat-table-filter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SnpQueryComponent } from './components/snp-query/snp-query.component';
import { ViewerComponent } from './components/viewer/viewer.component';
import { FinemappingComponent } from './components/finemapping/finemapping.component';
import { AboutComponent } from './components/about/about.component';
import { ResultTableComponent } from './components/result-table/result-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogComponent } from './components/dialog/dialog.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { NetworkInterceptor } from './network.interceptor';
import { TopSnpModalComponent } from './modals/top-snp-modal/top-snp-modal.component';
import { EpiBrowserComponent } from './components/epi-browser/epi-browser.component';
import { EgSidebarComponent } from './components/eg-sidebar/eg-sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    SnpQueryComponent,
    ViewerComponent,
    FinemappingComponent,
    AboutComponent,
    ResultTableComponent,
    DialogComponent,
    TopSnpModalComponent,
    EpiBrowserComponent,
    EgSidebarComponent,
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
    MatTableFilterModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NetworkInterceptor,
      multi: true,
    },
  ],
  //add the schemas property and pass the CUSTOM_ELEMENTS_SCHEMA constant
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
