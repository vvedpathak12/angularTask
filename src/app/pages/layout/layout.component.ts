import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
  }

  onLogOut() {
    const isConfirm = confirm('Do you really want Log out?');
    if (isConfirm) {
      localStorage.removeItem('username');
      this.toastr.success('Logged Out Successfully');
      this.router.navigateByUrl('login');
    }
  }
}
