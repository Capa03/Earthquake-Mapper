import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SlideService } from '../../services/slide.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  title: string = 'EarthQuake Mapper App';
  checked: boolean = false;

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer, private slideService: SlideService) {
    this.matIconRegistry.addSvgIcon(
      'globe',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/globe.svg')
    );
  }

  ngOnInit() {
    console.log(this.checked);
  }

  onToggleChange(event: any) {
    this.checked = !event.checked;
    this.slideService.setChecked(this.checked);
  }

}
