import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapsComponent } from './maps.component';
import { GoogleMapsModule } from '@angular/google-maps';



@NgModule({
  declarations: [
    MapsComponent,
  ],
  imports: [
    CommonModule,
    GoogleMapsModule
  ],
  exports: [
    MapsComponent
  ]
})
export class MapsModule { }
