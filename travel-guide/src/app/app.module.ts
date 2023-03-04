import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { UserlistingComponent } from './components/userlisting/userlisting.component';
import { AuthInterceptor } from './service/auth.interceptor';
import { UpdateDialogComponent } from './components/update-dialog/update-dialog.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { HomeComponent } from './components/home/home.component';
import { LocationDialogComponent } from './components/location-dialog/location-dialog.component';
import { CarouselModule } from '@coreui/angular';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    UserlistingComponent,
    UpdateDialogComponent,
    HomeComponent,
    LocationDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    GoogleMapsModule,
    CarouselModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
