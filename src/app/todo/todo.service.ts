import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Todo } from "./todo.model";

const BACKEND_URL = environment.apiUrl + "/todo"; 

@Injectable({ providedIn: "root" })
export class TodosService {
  private todos: Todo[] = [];
  private usersUpdated = new Subject<{ todos: Todo[]; count: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getTodos(usersPerPage: number, currentPage: number, search: string) {
    var queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`;
    if(search){
      queryParams+=`&search=${search}`
    }
    this.http
    .get<{ message: string; data: any; count: number }>(
      BACKEND_URL+'/' + queryParams
    )
    .pipe(
      map((todoData: any) => {
        return {
          todos: todoData.data.map(user => {
            return {
              id: user._id,
              title: user.title,
              description: user.description
            };
          }),
          count: todoData.count
        };
      })
    )
    .subscribe((transformedPostData: any) => {
      console.log(transformedPostData)
      this.todos = transformedPostData.todos;
      this.usersUpdated.next({
        todos: [...this.todos],
        count: transformedPostData.count
      });
    });
  }

  getTodo(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      email: string;
      phone: string;
    }>(BACKEND_URL+'/'+ id);
  }
  
  addTodo(title: string, description: string) {
    const user ={
      title: title,
      description: description,
    }
    return this.http.post<{ message: string; users: any }>(BACKEND_URL+"/", user )
  }

  updateTodo(id: string, title: string, description: string) {
     const user ={
      id: id,
      title: title,
      description: description,
    };
    return this.http.put(BACKEND_URL+"/"+id, user)
  }

  deleteTodo(id: string) {
    return this.http.delete(BACKEND_URL+"/"+ id);
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }
}
