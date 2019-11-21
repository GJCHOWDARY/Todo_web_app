import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute, ParamMap,Params } from "@angular/router";
import { AuthService } from "../auth/auth.service";
// import { ErrorService } from "./error/error.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  // hasError = false;
  // private errorSub: Subscription;
  gridList = [
    {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
  ];
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
  this.userIsAuthenticated = this.authService.getIsAuth();
  console.log(this.userIsAuthenticated);
  if (!this.userIsAuthenticated) {
    this.router.navigate(['/']);
  }else{
  this.router.navigate(['/']);
  }
}

onLogout() {
 this.authService.logout();
}

}
