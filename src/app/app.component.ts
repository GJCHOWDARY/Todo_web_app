import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute, ParamMap,Params } from "@angular/router";

import { AuthService } from "./auth/auth.service";
// import { ErrorService } from "./error/error.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy {
  // hasError = false;
  // private errorSub: Subscription;
   userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  email :string;
  role  :string;
  verifyEmail:string;
constructor(public authService: AuthService,private activatedRoute: ActivatedRoute, private router: Router) {
 }

ngOnInit() {
  this.authService.autoAuthUser();  
  localStorage.removeItem("ProcessingData"); 
  this.activatedRoute.queryParams.subscribe(params => {
    console.log(params)
    if(params.email){
    this.verifyEmail = params.email;
        console.log(params)
    }else if(params.token){
        console.log(params)
    }
  });
  this.userIsAuthenticated = this.authService.getIsAuth();
  this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
   });
}

onLogout() {
 this.authService.logout();
}

ngOnDestroy() {
 this.authListenerSubs.unsubscribe(); 
  }
}
