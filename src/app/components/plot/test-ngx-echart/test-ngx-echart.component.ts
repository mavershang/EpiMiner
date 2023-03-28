import { Component, OnDestroy } from '@angular/core';
import { ChartConfiguration } from 'chart.js';


@Component({
  selector: 'app-test-ngx-echart',
  templateUrl: './test-ngx-echart.component.html',
  styleUrls: ['./test-ngx-echart.component.css']
})
export class TestNgxEchartComponent implements OnDestroy{
  title = 'ng2-charts-demo';

  public bubbleChartOptions: ChartConfiguration<'bubble'>['options'] = {
    responsive: false,
    scales: {
      x: {
        min: 0,
        max: 30,
      },
      y: {
        min: 0,
        max: 30,
      }
    }
  };
  public bubbleChartLegend = true;

  public bubbleChartDatasets: ChartConfiguration<'bubble'>['data']['datasets'] = [
    {
      data: [
        { x: 10, y: 10, r: 10 },
        { x: 15, y: 5, r: 15 },
        { x: 26, y: 12, r: 23 },
        { x: 7, y: 8, r: 8 },
      ],
      label: 'Series A',
    },
  ];
  
    constructor() { }
  
    ngOnDestroy() {
     
    }
  
    // onChartReady(myChart: any) {
    //   const onPointDragging = function (dataIndex) {
    //     // Data[dataIndex] = myChart.convertFromPixel({ gridIndex: 0 }, this.position) as number[];
  
    //     // Update data
    //     myChart.setOption({
    //       series: [
    //         {
    //           id: 'a',
    //           data: Data,
    //         },
    //       ],
    //     });
    //   };
  
    //   const showTooltip = (dataIndex) => {
    //     myChart.dispatchAction({
    //       type: 'showTip',
    //       seriesIndex: 0,
    //       dataIndex,
    //     });
    //   };
  
    //   const hideTooltip = () => {
    //     myChart.dispatchAction({
    //       type: 'hideTip',
    //     });
    //   };
  
    //   const updatePosition = () => {
    //     myChart.setOption({
    //       graphic: util.map(Data, (item) => ({
    //         position: myChart.convertToPixel({ gridIndex: 0 }, item),
    //       })),
    //     });
    //   };
  
    //   window.addEventListener('resize', updatePosition);
    //   myChart.on('dataZoom', updatePosition);
  
    //   // save handler and remove it on destroy
    //   this.updatePosition = updatePosition;
  
    //   setTimeout(() => {
    //     myChart.setOption({
    //       graphic: util.map(Data, (item, dataIndex) => {
    //         return {
    //           type: 'circle',
    //           position: myChart.convertToPixel({ gridIndex: 0 }, item),
    //           shape: {
    //             cx: 0,
    //             cy: 0,
    //             r: SymbolSize / 2,
    //           },
    //           invisible: true,
    //           draggable: true,
    //           ondrag: util.curry<(dataIndex: any) => void, number>(onPointDragging, dataIndex),
    //           onmousemove: util.curry<(dataIndex: any) => void, number>(showTooltip, dataIndex),
    //           onmouseout: util.curry<(dataIndex: any) => void, number>(hideTooltip, dataIndex),
    //           z: 100,
    //         };
    //       }),
    //     });
    //   }, 0);
    // }

}
