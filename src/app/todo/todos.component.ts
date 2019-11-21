import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Todo } from "./todo.model";
import { TodosService } from "./todo.service";
import { AuthService } from "../auth/auth.service";
import {MatDialog, MatDialogConfig} from "@angular/material";
import { CreateTodoComponent } from './create-todo/create-todo.component';

@Component({
  selector: 'app-users',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit, OnDestroy {
  todos: Todo[] = []; 
  isLoading = false; 
  usersearch: string; 
  currentPage = 1;
  userCount = 0;
  usersPerPage = 10;
  userSizeOptions = [10, 20, 50];
  userIsAuthenticated = false;
  userId: string;
  userData:any =[];
  displayedColumns: string[] = [ 'Title','Description','Action']; 
 
  private userSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public todoService: TodosService,
    private authService: AuthService,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit() {
        this.isLoading = true;
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.todoService.getTodos(this.usersPerPage, this.currentPage, this.usersearch);
        this.userId = this.authService.getUserId();
        this.userData = this.authService.getUserData();
        this.userSub = this.todoService
        .getUserUpdateListener()
        .subscribe((userData: { todos: Todo[]; count: number }) => {
          this.isLoading = false;
          this.userCount = userData.count;
          this.todos = userData.todos;
      });
       this.isLoading = true;
  }
  
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.usersPerPage = pageData.pageSize;
    this.todoService.getTodos(this.usersPerPage, this.currentPage, this.usersearch);
  }

  onDelete(id: string){ 
    this.todoService.deleteTodo(id)
        .subscribe((resData :any) => {
          this.todoService.getTodos(this.usersPerPage, this.currentPage, this.usersearch);
     })
}
 
userChangeValue(data: string) {
  this.currentPage=1;
  this.todoService.getTodos(this.usersPerPage, this.currentPage, this.usersearch);
 }
 
 openDialog(id: number, mode:string) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.data = {id: id,mode: mode};
  const dialogRef = this.dialog.open(CreateTodoComponent, dialogConfig);
  //------After close the dialog dataset Description will be changed
  dialogRef.afterClosed().subscribe(result => {
    this.todoService.getTodos(this.usersPerPage, this.currentPage, this.usersearch);
  });
}

ngOnDestroy() {
     this.userSub.unsubscribe(); 
  }
}
