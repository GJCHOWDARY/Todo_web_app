import { Component, OnInit, OnDestroy,Inject } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute,Params } from "@angular/router";
import {MAT_DIALOG_DATA, MatDialogRef,MatDialog} from "@angular/material";
import { AuthService } from "../auth/auth.service";
import { Subject } from "rxjs";
import {Snotify,SnotifyService} from 'ng-snotify';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { environment } from "../../environments/environment";
const BACKEND_URL = environment.apiUrl + "/organization";

@Component({
  selector: 'app-login',
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  userIsAuthenticated= false;
  modelData:any;
  modelType:any;
  searchedData=false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService,
     private activatedRoute: ActivatedRoute,
     private router: Router,
     private http: HttpClient,
     private dialog: MatDialog,
     public snotifyservice:SnotifyService,
     private dialogRef: MatDialogRef<LoginComponent>,
   @Inject(MAT_DIALOG_DATA) data) {
     console.log(data,"0000000")
     this.modelData=data;
     this.modelType=data.type;
}

ngOnInit() {
     const isAuth = this.authService.getIsAuth();
       console.log(isAuth,"0000000000000000000") 
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password)
    .subscribe(
      (response: any) => {
        this.authService.saveLoginInfo(response);
          this.dialogRef.close();
          this.router.navigate(["/todos"]);
      })
  }

onSignUp(form: NgForm) {
  if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.siginup(form.value.email, form.value.mobile,form.value.name,form.value.password)
    .subscribe(
      (response: any) => {
        if(response.status){
        this.snotifyservice.success('You Account Created !', {
          timeout: 5000,
          showProgressBar: false,
          closeOnClick: true,
        });    
        this.dialogRef.close();
      }else{
        this.snotifyservice.success(response.message, {
          timeout: 5000,
          showProgressBar: false,
          closeOnClick: true,
        });   
        this.isLoading = true;
      }
     })
  }

 close() {
    this.dialogRef.close();
 }

ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
