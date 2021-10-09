import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AlertifyService } from 'src/app/services/alertify.service';
import { ApiService } from 'src/app/services/api.service';
import { DatatbleService } from 'src/app/services/datatble.service';
import { entyCategory } from 'src/entities/entyCategory';
import { entySubCategory } from 'src/entities/entySubcategory';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  isDtInitialized = false;
  dtTrigger: Subject<any> = new Subject();

  @ViewChild("fileInput") fileInput;
  subcategory: entySubCategory[] = [];
  category: entyCategory[] = [];
  fgsubcategory: FormGroup;
  subcategoryid: number;

  constructor(private fb: FormBuilder, private http: ApiService, private alertify: AlertifyService) {
    this.fgsubcategory = fb.group({
      SubCategoryName: ['', Validators.required],
      CategoryId: ['', Validators.required],
      SubCategoryIcon: ['', Validators.required],
      IsUserSubCategory: [true],
      IsActive: [true]
    });
  }

  ngOnInit(): void {
    this.GetAllCategory();
    this.GetSubcategory();
  }

  SaveSubCategory(): void {
    let subcategory = <entySubCategory>this.fgsubcategory.value;
    this.http.CallPostApi('api/subcategory', subcategory).subscribe(res => {
      this.UploadFile();
      this.GetSubcategory();
      this.alertify.success('Sub Category Added!!');
      this.fgsubcategory.reset();
    },
      err => {
        this.alertify.error("Error in Adding Sub category");
        console.log(err);
      }
    )

  }

  GetAllCategory(): void {
    this.http.CallGetApi('api/category').subscribe(res => {
      this.category = (<entyCategory[]>res);
    },
      err => {
        this.alertify.error('Error In Fetching Category!!');
        console.log(err);
      })
  }


  UploadFile(): void {
    let fi = this.fileInput.nativeElement;
    let fileToUpload;
    if (fi.files && fi.files[0]) {
      fileToUpload = fi.files[0];
    }
    let input = new FormData();
    input.append("file", fileToUpload);
    console.log(fileToUpload);
    this.http.CallPostFileApi('api/subcategory/UploadSubCategoryIcon', input).subscribe(res => {
      console.log(res);
      this.GetSubcategory();
    },
      err => {
        console.log(err);
      }
    )
  }

  GetSubcategory() {

    this.http.CallGetApi('api/subcategory').subscribe(res => {
      this.subcategory = <entySubCategory[]>res;
      if (this.isDtInitialized) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      } else {
        this.isDtInitialized = true;
        this.dtTrigger.next();
      }
    }, error => {
      this.alertify.error("Error in Fecthing Si=ubCategory!!");
    }
    )
  }
  SetDeleteItemId(id) {
    this.subcategoryid = id;
    if (this.subcategoryid != null) {
      document.getElementById('btnModl').click();
    }
  }

  DeleteSubCatgory() {
    this.http.CallDeleteApi('api/subcategory/', this.subcategoryid).subscribe(res => {
      this.GetSubcategory();
      this.alertify.message('SubCategory Deleted!!');
    },
      error => {
        this.alertify.error('Error in Deleting SubCategory');
      })
  }
}
