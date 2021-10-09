import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { entyBank } from 'src/entities/entyBank';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'budgetApp';

  constructor(private route: Router) { }

  ngOnInit(): void {
    // if (!localStorage.getItem('userToken')) {
    //   this.route.navigate(['/auth/login']);
    // }
  }
}
