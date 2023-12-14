import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  stateArr: any[] = [];
  cityArr: any[] = [];
  customerArr: any[] = [];
  filteredCustomerArr: any[] = [];
  customerObj: any = {
    "customerId": 0,
    "customerName": "",
    "dob": "",
    "customerAddress": "",
    "photo": "",
    "state": "",
    "city": "",
  };
  selectedFile: File | null = null;

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadStates();
    this.loadCities();
    this.loadCustomers();
  }

  onAddCustomer() {
    const notNull = document.getElementById('customerModal');
    if (notNull != null) {
      notNull.style.display = 'block';
    }
    this.customerObj = {
      "customerId": 0,
      "customerName": "",
      "dob": new Date(),
      "customerAddress": "",
      "photoUrl": "",
      "state": "",
      "city": "",
    }
  }

  onCloseModal() {
    const notNull = document.getElementById('customerModal');
    if (notNull != null) {
      notNull.style.display = 'none';
    }
  }

  loadStates() {
    this.http.get("assets/state.json").subscribe((res: any) => {
      this.stateArr = res.data;
    });
  }

  loadCities() {
    this.http.get("assets/city.json").subscribe((res: any) => {
      this.cityArr = res.data;
    });
  }

  loadCustomers() {
    this.http.get("assets/customerList.json").subscribe((res: any) => {
      this.customerArr = res.data;
      this.filteredCustomerArr = res.data;
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSave() {
    if (this.selectedFile) {
      const newCustomer = { ...this.customerObj };
      newCustomer.customerId = this.customerArr.length + 1;
      const reader = new FileReader();
      reader.onload = () => {
        newCustomer.photoUrl = reader.result as string;
        this.customerArr.push(newCustomer);
        this.toastr.success('Customer Added Successfully');
        console.log(this.customerArr);
      };
      reader.readAsDataURL(this.selectedFile);
      this.onCloseModal();
    }
  }

  onEdit(customer: any) {
    this.onAddCustomer();
    this.customerObj = customer;
  }

  onUpdate() {
    const updatedCustomerIndex = this.customerArr.findIndex(customer => customer.customerId === this.customerObj.customerId);
    if (updatedCustomerIndex !== -1) {
      this.customerArr[updatedCustomerIndex] = { ...this.customerObj };
      this.toastr.success('Customer Updated Successfully');
      this.onCloseModal();
    } else {
      this.toastr.error('Customer not found');
    }
  }

  onDelete(customerId: number) {
    const isConfirm = confirm('Do you really want to remove this record?');
    if (isConfirm) {
      const index = this.customerArr.findIndex(customer => customer.customerId === customerId);
      if (index !== -1) {
        this.customerArr.splice(index, 1);
        this.toastr.success('Customer Deleted Successfully');
      }
    }
  }

  onSearch() {
    this.filteredCustomerArr = this.customerArr;

    if (this.customerObj.state) {
      this.filteredCustomerArr = this.filteredCustomerArr.filter(customer => customer.state === this.customerObj.state);
    }
    if (this.customerObj.city) {
      this.filteredCustomerArr = this.filteredCustomerArr.filter(customer => customer.city === this.customerObj.city);
    }
    if (this.customerObj.customerAddress) {
      this.filteredCustomerArr = this.filteredCustomerArr.filter(customer =>
        customer.customerAddress.toLowerCase().includes(this.customerObj.customerAddress.toLowerCase())
      );
    }
    if (this.customerObj.dob) {
      this.filteredCustomerArr = this.filteredCustomerArr.filter(customer => {
        const searchDate = new Date(this.customerObj.dob).toLocaleDateString();
        const customerDate = new Date(customer.dob).toLocaleDateString();
        return customerDate === searchDate;
      });
    }
    if (this.customerObj.customerName) {
      this.filteredCustomerArr = this.filteredCustomerArr.filter(customer =>
        customer.customerName.toLowerCase().includes(this.customerObj.customerName.toLowerCase())
      );
    }
  }

  onSearchReset() {
    this.customerObj.customerName = "";
    this.customerObj.dob = null;
    this.customerObj.customerAddress = "";
    this.customerObj.state = "";
    this.customerObj.city = "";
    this.loadCustomers();
  }


  onCancel() {
    this.onCloseModal();
    this.customerObj = {
      "customerId": 0,
      "customerName": "",
      "dob": "",
      "customerAddress": "",
      "photoUrl": "",
      "state": "",
      "city": "",
    };
  }

}
