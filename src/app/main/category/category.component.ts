import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { entyCategory } from 'src/entities/entyCategory';
import { ApiService } from 'src/app/services/api.service';
import { DatatbleService } from 'src/app/services/datatble.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  isDtInitialized = false;
  dtTrigger: Subject<any> = new Subject();

  categoryId: number;
  fgcategory: FormGroup;
  category: entyCategory[] = [];
  @ViewChild("fileInput") fileInput;

  constructor(private fb: FormBuilder, private http: ApiService, private alertify: AlertifyService) {
    this.categoryId = null;
    this.fgcategory = this.fb.group({
      CategoryName: ['', Validators.required],
      CategoryIcon: [],
      IsActive: true
    });
  }

  ngOnInit(): void {
    this.GetAllCategory();
  }

  SaveCategory(): void {
    let category = <entyCategory>this.fgcategory.value;

    this.http.CallPostApi('api/category', category).subscribe(res => {
      this.UploadFile();
      this.alertify.success('Category Added Successfully!!');
      //To Get New Category
      this.GetAllCategory();
      this.fgcategory.reset();
    },
      err => {
        this.alertify.error(err.error.ExceptionMessage);
      }
    )
  }

  GetAllCategory(): void {
    this.http.CallGetApi('api/category').subscribe(res => {
      this.category = (<entyCategory[]>res);
      if (this.isDtInitialized) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      } else {
        this.isDtInitialized = true;
        this.dtTrigger.next();
      }
    },
      err => {
        this.alertify.error('Error in fetching category!!');
      })
  }

  SetDeleteItemId(id): void {
    this.categoryId = id;
    if (this.categoryId != null) {
      document.getElementById('btnModl').click();
    }
  }

  DeleteUserCategory(): void {

    this.http.CallDeleteApi('api/category/', this.categoryId).subscribe(res => {
      this.alertify.message('category deleted!!');
      //To Get Remaining Category
      this.GetAllCategory();
    },
      err => {
        this.alertify.error('Error In Deleting Category');
      }
    )
  }


  // DeleteCategory(): void {
  //   //  let category = <entyCategory>this.fgcategory.value;

  //   this.http.CallPostApi('api/category',).subscribe(res => {
  //     alert('category saved successfully!!');
  //   },
  //     err => {
  //       alert('Something wnet wrong!');
  //       console.log(err);
  //     }
  //   )
  // }  

  UploadFile(): void {
    let fi = this.fileInput.nativeElement;
    let fileToUpload;
    if (fi.files && fi.files[0]) {
      fileToUpload = fi.files[0];
    }
    let input = new FormData();
    input.append("file", fileToUpload);
    this.http.CallPostFileApi('api/category/UploadCategoryIcon', input).subscribe(res => {
      this.GetAllCategory();
    },
      err => {
        console.log(err);
      }
    )
  }

}
