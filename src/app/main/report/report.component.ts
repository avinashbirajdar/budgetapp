import { Component, OnInit } from '@angular/core';
import { AlertifyService } from 'src/app/services/alertify.service';
import { ApiService } from 'src/app/services/api.service';
import * as canvas from '../../../assets/js/canvasjs.min';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  //const income=[];
  constructor(private http:ApiService,private alertify:AlertifyService) { }

  ngOnInit(): void {
    this.GetIncome();
  }

  GetIncome():any{
    this.http.CallGetApi('api/report/getincome').subscribe(res=>{
      console.log(res);
      this.CreateIncomeChart();
    },error=>{
      this.alertify.error('error in fetching data');
    })
  }

  CreateIncomeChart(){
    var chart = new canvas.Chart("chartContainer", {
      title:{
        text: "Current Year Income"              
      },
      data: [              
      {
        // Change type to "doughnut", "line", "splineArea", etc.
        type: "column",
        dataPoints: [
          { label: "Jan",  y: 10  },
          { label: "Feb", y: 15  },
          { label: "Mar", y: 25  },
          { label: "April",  y: 30  },
          { label: "May",  y: 28  },
          { label: "Jun",  y: 28  },
          { label: "July",  y: 28  },
          { label: "Aug",  y: 28  },
          { label: "Sep",  y: 28  },
          { label: "Oct",  y: 28  },
          { label: "Nov",  y: 28  },
          { label: "Dec",  y: 28  },
        ]
      }
      ]
    });
    chart.render();
  }
  }

