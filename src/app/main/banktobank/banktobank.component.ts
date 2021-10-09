import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { entyBank } from 'src/entities/entyBank';
import { ApiService } from 'src/app/services/api.service';
import { entyBankToBak } from 'src/entities/entyBankToBank';
import { DatatbleService } from 'src/app/services/datatble.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-banktobank',
  templateUrl: './banktobank.component.html',
  styleUrls: ['./banktobank.component.scss']
})
export class BanktobankComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  isDtInitialized = false;
  dtTrigger: Subject<any> = new Subject();

  //Declare formgroups and entities
  fgbanktobank: FormGroup;
  banks: entyBank[] = [];
  banktobaks: entyBankToBak[] = [];
  banktransferid: number;

  //Injecting FormBuilder and Api Servce
  constructor(private fb: FormBuilder, private http: ApiService, private alertify: AlertifyService) {
    this.fgbanktobank = this.fb.group({
      FromBank: ['', Validators.required],
      ToBank: ['', Validators.required],
      Amount: ['', Validators.required],
      Description: ['', Validators.required],
      IsActive: [true]
    });
  }

  //Calling Binding Methods it intilization level
  ngOnInit(): void {
    this.GetAllBanks();
    this.GetBankToBantTransfer();
  }

  //Fetching AllBanks and Binding to dropdwonlist
  GetAllBanks(): void {
    this.http.CallGetApi('api/Bank').subscribe(res => {
      this.banks = (<entyBank[]>res);
    }, err => {
      this.alertify.error("Error in fectching Banks");
      console.error(err);
    });
  }

  //Inserting Bank to Bank transfer amounts
  SaveBankToBankTransfer(): void {
    let banktobank = <entyBankToBak>this.fgbanktobank.value;

    this.http.CallPostApi("api/banktobank", banktobank).subscribe(res => {
      this.alertify.success('Amount Transferred Successfully!!');
      this.GetBankToBantTransfer();
      this.fgbanktobank.reset();
    },
      err => {
        alert("Something Went Wrong!!");
      })
  }

  //Feacthing Bank to Bank transfer amount/details
  GetBankToBantTransfer(): void {
    this.http.CallGetApi('api/banktobank').subscribe(res => {
      this.banktobaks = (<entyBankToBak[]>res);

      //To destroy and bind datatable
      if (this.isDtInitialized) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      } else {
        this.isDtInitialized = true;
        this.dtTrigger.next();
      }
    }, err => {
      this.alertify.error('Error in fecthing ban transfer');
      console.error(err);
    });
  }

  //Delteing Bank To Bank Records
  DeletebanktobankDetails(): void {
    if (this.banktransferid != undefined) {
      this.http.CallDeleteApi('api/banktobank/', this.banktransferid).subscribe(res => {
        this.alertify.message('Amount tarnsfer Record Deleted');
        //To Get New Bank
        this.GetBankToBantTransfer();
      }, err => {
        alert('Something Went Wrong.');
        console.error(err);
      });
    }
  }

  //Setting delete id BanktoBank Transfer amount details
  SetDeleteBankId(id): void {
    this.banktransferid = id;
    console.log("id", this.banktransferid);
    if (this.banktransferid != undefined) {
      document.getElementById('btnModl').click();
    }
  }

  ShowFullDescription(description) {
    document.getElementById('banktobank_description').innerText = description;
  }
}
