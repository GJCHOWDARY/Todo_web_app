import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import {MatDialog, MatDialogConfig} from "@angular/material";
import { AuthService } from "../auth/auth.service";
import { LoginComponent } from '../login/login.component';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  processingData:any =[];
  private authListenerSubs: Subscription;
  private processListenerSubs: Subscription;
  userData: any=[];

  constructor(private authService: AuthService,
              public dialog: MatDialog, ) {}

  ngOnInit() {
    this.processingData=localStorage.getItem("ProcessingData"); 
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userData = this.authService.getUserData();
    

    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userData = this.authService.getUserData();
      });
  }
  
  loginDialog(val){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = 432;
    dialogConfig.data = {type: val};
    const dialogRef = this.dialog.open(LoginComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}