import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TrackTreeComponent } from './components/track-tree/track-tree.component';

// declare var showViewer: boolean;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EpiMiner';

  constructor(public dialog: MatDialog){}

  openEpiGenome() { 
    const dialogRef = this.dialog.open(TrackTreeComponent, {
      width: '1400px',
      // data:{
      //   indexSnp: row.IndexSnp,
      //   topSnps:row.TopSnps,
      //   workDir:row.WorkDir,
      //   dataset1: this.qtlParam.dataset1,
      //   dataset2: this.qtlParam.dataset2
      // }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}
