import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

import * as canvas from '../../../assets/js/canvasjs.min';
import { entyCreditDebit } from 'src/entities/entyCreditDebit';
import { DatatbleService } from 'src/app/services/datatble.service';
import { entyPerson } from 'src/entities/entyPerson';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  wallets: any;
  transactions: any;
  persons: any;
  constructor(private api: ApiService, public dt: DatatbleService) { }

  ngOnInit(): void {
    this.getAllWallets();
    this.getUserTransactionReports();
    this.createPieChartForExpenses();
    this.createBarChartForWallets();
    this.getAllCreditDebitEntries();
    this.createBarChartForBanks();
    this.getUserContacts();
  }

  getAllWallets() {
    this.api.CallGetApi('api/wallet').subscribe(res => {
      this.wallets = res;
      this.wallets = this.wallets.length > 3 ? this.wallets.slice(0, 3) : this.wallets;
    }, err => {
      console.log(err);
      alert("Something Went Wrong");
    })
  }

  getUserTransactionReports() {
    this.api.CallGetApi('api/CreditDebit/DebitCreditSumReports').subscribe(res => {
      this.transactions = res;
    }, err => {
      console.log(err);
      alert("Something Went Wrong");
    });
  }

  createPieChartForExpenses() {

    this.api.CallGetApi('api/expense/ExpenseSumByCategories').subscribe(res => {

      let dataPoints = [];
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        dataPoints.push({ y: element.expenseSum, label: element.categoryName })
      }

      console.log(dataPoints)

      var chart = new canvas.Chart("chartContainer", {
        animationEnabled: true,
        title: {
          text: "Category wise Expenses"
        },
        data: [{
          type: "pie",
          startAngle: 240,
          yValueFormatString: "##0.00\"₹\"",
          indexLabel: "{label} {y}",
          dataPoints: dataPoints
        }]
      });

      chart.render();
    })

  }

  createBarChartForWallets() {
    this.api.CallGetApi('api/wallet').subscribe(
      (res) => {

        var dataPoints = [];
        for (var i = 0; i < res.length; i++) {
          const element = res[i];
          dataPoints.push({ y: Number(element.WalletAmount), label: element.WalletName })
        }
        console.log(dataPoints);

        var chart = new canvas.Chart("barchartContainer", {
          animationEnabled: true,

          title: {
            text: "Wallet Amounts"
          },
          axisX: {
            interval: 1
          },
          axisY2: {
            interlacedColor: "rgba(1,77,101,.2)",
            gridColor: "rgba(1,77,101,.1)",
            title: "Amount"
          },
          data: [{
            type: "bar",
            name: "companies",
            axisYType: "primary",
            color: "#014D65",
            dataPoints: dataPoints
          }]
        });
        chart.render();
      },
      (err) => {
        alert('Something Went Wrong.');
        console.error(err);
      }
    );
  }

  getAllCreditDebitEntries() {
    this.api.CallGetApi('api/creditdebit').subscribe(res => {
      let creditdebit = (<entyCreditDebit[]>res);
      let creditPoints = [], debitpoints = [];
      for (let i = 0; i < creditdebit.length; i++) {
        const element = creditdebit[i];
        if (element.Transaction.toLowerCase() === 'credit') {
          creditPoints.push({ x: new Date(res[i].DOT), y: Number(element.Amount) })
        } else {
          debitpoints.push({ x: new Date(res[i].DOT), y: Number(element.Amount) })
        }
      }

      this.createLineChartForCreditTransactions(creditPoints);
      this.createLineChartForDebitTransactions(debitpoints);
      this.createLineChartForAllTransactions(creditPoints, debitpoints);

    }, err => {
      alert('Something Went Wrong.');
      console.error(err);
    });
  }

  createLineChartForCreditTransactions(creditDataPoints) {
    var chart = new canvas.Chart("creditAmountContainer", {
      animationEnabled: true,
      theme: "light2",
      axisX: {
        valueFormatString: "MMM YYYY"
      },
      title: {
        text: "Credit Transactions"
      },
      data: [{
        type: "spline",
        indexLabelFontSize: 16,
        yValueFormatString: "₹#",
        dataPoints: creditDataPoints
      }]
    });
    chart.render();
  }

  createLineChartForDebitTransactions(debitDataPoints) {
    var chart = new canvas.Chart("debitAmountContainer", {
      animationEnabled: true,
      theme: "light2",
      axisX: {
        valueFormatString: "MMM YYYY"
      },
      title: {
        text: "Debit Transactions"
      },
      data: [{
        type: "spline",
        indexLabelFontSize: 16,
        yValueFormatString: "₹#",
        dataPoints: debitDataPoints
      }]
    });
    chart.render();
  }

  createLineChartForAllTransactions(creditDataPoints, debitDataPoints) {
    var chart = new canvas.Chart("mixedAmountContainer", {
      animationEnabled: true,
      theme: "light2",
      axisX: {
        valueFormatString: "MMM YYYY"
      },

      title: {
        text: "All Transactions"
      },
      data: [{
        indexLabelFontSize: 16,
        yValueFormatString: "₹#",
        type: "splineArea",
        color: "rgba(40,175,101,0.6)",
        dataPoints: creditDataPoints,
      }, {
        type: "splineArea",
        color: "rgba(0,75,141,0.7)",
        indexLabelFontSize: 16,
        yValueFormatString: "₹#",
        dataPoints: debitDataPoints,
      }]
    });
    chart.render();
  }

  createBarChartForBanks() {
    this.api.CallGetApi('api/Bank').subscribe(res => {
      var bankPoints = [];
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        bankPoints.push({ y: Number(element.Amount), label: element.BankName })
      }
      var chart = new canvas.Chart("allBanksCharts", {
        animationEnabled: true,
        theme: "light2",
        title: {
          text: "Banks & Amounts"
        },
        axisY: {
          title: "Amount"
        },
        data: [{
          type: "column",
          showInLegend: true,
          legendMarkerColor: "grey",
          yValueFormatString: "₹#",
          legendText: "Bank Names",
          dataPoints: bankPoints
        }]
      });
      chart.render();
    }, (err) => {
      alert('Something Went Wrong.');
      console.error(err);
    });
  }

  getUserContacts() {
    this.api.CallGetApi('api/person').subscribe(res => {
      this.persons = (<entyPerson[]>res);
      this.dt.RefreshDataTable();
    }, err => {
      alert('Something Went Wrong.');
      console.error(err);
    });
  }
}
