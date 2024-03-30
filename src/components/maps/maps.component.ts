import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  map!: google.maps.Map;

  center = new google.maps.LatLng(37.7749, -122.4194);  // Default coordinates (San Francisco)
  zoom = 8;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    const mapOptions: google.maps.MapOptions = {
      center: this.center,
      zoom: this.zoom,
    };
    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
  }

}
