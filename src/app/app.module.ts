import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuthInterceptor } from "./auth/auth-interceptor";
import { ErrorInterceptor } from "./error-interceptor";
import { ErrorComponent } from "./error/error.component";
import { AngularMaterialModule } from "./angular-material.module";
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { TodosComponent } from './todo/todos.component';
import { CreateTodoComponent } from './todo/create-todo/create-todo.component';
import { LoginComponent } from "./login/login.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule, WavesModule } from 'angular-bootstrap-md';
import { MatRadioModule } from '@angular/material';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { environment } from '../environments/environment';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent,
    FooterComponent,
    HomeComponent,
    TodosComponent,
    LoginComponent,
    CreateTodoComponent,
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    NgbModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    CarouselModule,
    WavesModule,
    MatSelectModule,
    MatFormFieldModule,
    SnotifyModule,
    ],exports: [    ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService
    ],
  bootstrap: [AppComponent],
  entryComponents: [
    ErrorComponent,
    CreateTodoComponent,
    LoginComponent
  ]
})
export class AppModule {}
