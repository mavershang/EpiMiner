import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GetDataService } from 'src/app/services/get-data.service';
import { DialogComponent } from '../dialog/dialog.component';
//import { Configuration, OpenAIApi } from "openai";

@Component({
  selector: 'app-fun-stuff',
  templateUrl: './fun-stuff.component.html',
  styleUrls: ['./fun-stuff.component.css']
})
export class FunStuffComponent implements OnInit {

  inputStr:string;
  model:string = "text-davinci-002";
  maxToken: number =2048;
  randomness:number = 0.5;
  outStr:string = "";

  constructor(
    private getDataService: GetDataService,
    private dialog: MatDialog
    ) { }

  ngOnInit(): void {
  }

  askChatGPT(){
    this.getDataService.askChatGPT(this.inputStr, this.maxToken, this.randomness, this.model).subscribe(
      data => {
      this.outStr = data["text"];
      
    }, error => {
      this.openDialog("Failed to : " + error.message);
    });
  }

  openDialog(description:string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = description;
    this.dialog.open(DialogComponent, dialogConfig);
  }

/*   async chat(){
    const configuration = new Configuration({
      organization: "org-t6yQwD2kRlcbMx1IgVVq2thJ",
      apiKey: "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"//process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.listEngines();
  }   */

}
