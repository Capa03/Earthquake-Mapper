import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MapsModule } from '../maps/maps.module';
import { ContentComponent } from './content/content.component';

@NgModule({
  declarations: [SidebarComponent, ContentComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MapsModule
  ],
  exports: [SidebarComponent]
})
export class SidebarModule { }
