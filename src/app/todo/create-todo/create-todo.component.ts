import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";
import { TodosService } from "../../todo/todo.service";
import { Todo } from "../../todo/todo.model";
import { AuthService } from "../../auth/auth.service";
import {MAT_DIALOG_DATA, MatDialogRef,MatDialog} from "@angular/material";
import { ErrorComponent } from "../../error/error.component";
import { ErrorService } from "../../error/error.service";
import {Snotify,SnotifyService} from 'ng-snotify';

export interface Role {
  value: string;
  viewValue: string;
}
export interface Group {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-dataset-create",
  templateUrl: "./create-todo.component.html",
  styleUrls: ["./create-todo.component.css"]
})

export class CreateTodoComponent implements OnInit, OnDestroy {

  todo: Todo;
  data: any =[];
  isLoading = true;
  selectedValue=[]; rolesdata: any=[];
  userData: any=[]; groupData: any=[];
  isEdit = false;  selectedRole;
   // form: FormGroup;
  mode = "create";
  private userId: string;
  private authStatusSub: Subscription;
  currentPage = 1;

   constructor(
    public todoService: TodosService,
    private dialogRef: MatDialogRef<CreateTodoComponent>,
    public route: ActivatedRoute,
    public snotifyservice:SnotifyService,
    private authService: AuthService,
    private router: Router,private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data) {
      console.log(data,"0000000")
      this.data = data;
    }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.todo = {id:"", title: "", description: ""};
    this.userData = this.authService.getUserData();
      if(this.data.id && this.data.mode=='edit'){
        this.mode = "edit";
        this.isLoading = true;
        this.isEdit = false;
          this.todoService.getTodo(this.data.id).subscribe( (userData: any) => {
            this.isLoading = false; 
            this.todo = userData.data[0];
            console.log(this.todo)
          });
      } else {
        console.log("Create")
        this.isLoading = false;
        this.mode = "create";
        this.isEdit =true;
        this.userId = null;
      }
  }
// TODO: User
  onSaveUser(form: FormGroup) {
     if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.todoService.addTodo(form.value.title, form.value.description).subscribe(responseData => {
        this.toastMessage(responseData);
        this.dialogRef.close();
        this.isLoading = true;
      },
     error => {
       console.log(error)
      });
    } else {
      this.todoService.updateTodo( this.data.id, form.value.title, form.value.description).subscribe(responseData => {
        this.toastMessage(responseData);
        this.dialogRef.close();
        this.isLoading = true;
      },
     error => {
       console.log(error)
      });  
    }
    form.reset();
  }

  toastMessage(data:any){
    this.snotifyservice.success(data.message, {
      timeout: 5000,
      showProgressBar: false,
      closeOnClick: true,
    });    
  }

 close() {
    this.dialogRef.close();
}

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
