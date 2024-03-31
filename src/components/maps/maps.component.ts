import { EarthquakeFeature } from './../../interface/EarthQuakeInterface';
import { EarthquakeService } from './../../services/earthquake.service';
import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Earthquake } from '../../interface/EarthQuakeInterface';



@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit,AfterContentInit {
  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/outdoors-v12';
  lat: number = 37.9966083;
  lng: number = -7.8527005;
  earthquakeData: Earthquake = {
    type: 'FeatureCollection',
    features: [],
  };
  constructor(private earthquakeService:EarthquakeService) {
    this.getEarthquakes();
   }


   getEarthquakes() {
    this.earthquakeService.getEarthquakes().subscribe((data) => {
      this.earthquakeData = {
        type: 'FeatureCollection',
        features: data.features.map((feature) => {
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [feature.geometry.coordinates[0], feature.geometry.coordinates[1], feature.geometry.coordinates[2]]
            },
            properties: {
              ...feature.properties,
              city: feature.properties.place,
              time: new Date(feature.properties.time).getTime()
            }
          };
        })
      };
    });
  }


  ngOnInit(): void {

  }

  ngAfterContentInit() {

    this.map = new mapboxgl.Map({
      accessToken: "pk.eyJ1IjoiY2FwYTAzIiwiYSI6ImNsdWV0NGt2ZjFpd20ycXBpZTFtbmVvdmoifQ.gBCyjJOc075PrMQ5NE4iKw",
      container: 'map',
      style: this.style,
      zoom: 11,
      center: [this.lng, this.lat]
    });

    this.map.on('load', () => {
      this.map?.addSource('earthquakes', {
        type: 'geojson',

        data: this.earthquakeData,
      });

      // circles
      this.map?.addLayer({
        'id': 'earthquakes-layer',
        'type': 'circle',
        'source': 'earthquakes',
        'paint': {
          'circle-radius': 6,
          'circle-stroke-width': 2,
          'circle-color': 'red',
          'circle-stroke-color': 'white'
        }
      });

    });
  }
}
