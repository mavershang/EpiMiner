import { Component, OnInit } from '@angular/core';

declare var renderBrowserInElement:any;

@Component({
  selector: 'app-epi-browser',
  templateUrl: './epi-browser.component.html',
  styleUrls: ['./epi-browser.component.css', ]
})
export class EpiBrowserComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.init();
  }

  init()
  {
    const container = document.getElementById("embed");
            const contents = {
                genomeName: "mm10",
                displayRegion: "chr5:51997494-52853744",
                trackLegendWidth: 120,
                isShowingNavigator: true,
                tracks: [
                    {
                        type: "geneannotation",
                        name: "refGene",
                        genome: "mm10",
                    },
                    {
                        type: "geneannotation",
                        name: "gencodeM19Basic",
                        genome: "mm10",
                    },
                    {
                        type: "ruler",
                        name: "Ruler",
                    },
                    {
                        type: "bigWig",
                        name: "ChipSeq of Heart",
                        url: "https://www.encodeproject.org/files/ENCFF641FBI/@@download/ENCFF641FBI.bigWig",
                        options: { color: "red" },
                        metadata: { Sample: "Heart" },
                    },
                    {
                        type: "bigWig",
                        name: "ChipSeq of Liver",
                        url: "https://www.encodeproject.org/files/ENCFF555LBI/@@download/ENCFF555LBI.bigWig",
                        options: { color: "blue" },
                        metadata: { Sample: "Liver" },
                    },
                ],
                metadataTerms: ["Sample"],
                // regionSets: [],
                regionSetViewIndex: -1,
            };
            renderBrowserInElement(contents, container);
  }

}
