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
export class MapsComponent implements OnInit {
  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/outdoors-v12';
  lat: number = 37.9966083;
  lng: number = -7.8527005;
  earthquakeData: Earthquake = {
    type: 'FeatureCollection',
    features: [],
  };
  constructor(private earthquakeService: EarthquakeService) {
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
              time: new Date(feature.properties.time).getTime(),
              title: feature.properties.title // add this line
            }
          };
        })
      };
      this.initializeMap();
    });
  }


  ngOnInit(): void {

  }

  initializeMap() {

    this.map = new mapboxgl.Map({
      accessToken: "pk.eyJ1IjoiY2FwYTAzIiwiYSI6ImNsdWV0NGt2ZjFpd20ycXBpZTFtbmVvdmoifQ.gBCyjJOc075PrMQ5NE4iKw",
      container: 'map',
      style: this.style,
      zoom: 5,
      center: [this.lng, this.lat]
    });

    this.map.on('load', () => {
      this.map?.addSource('earthquakes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: this.earthquakeData.features.map((feature: EarthquakeFeature) => {
            return {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: feature.geometry.coordinates
              },
              properties: {
                details: feature.properties.detail,
                ...feature.properties,
                city: feature.properties.place,
                time: new Date(feature.properties.time).getTime()
              }
            };
          })
        }
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

      let popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      this.map?.on('mousemove', 'earthquakes-layer', (e) => {
        if (e.features && e.features.length > 0) {
          var feature = e.features[0];
          if (feature.geometry && feature.geometry.type === 'Point' && feature.properties) {
            const coordinates = (feature.geometry as GeoJSON.Point).coordinates.slice();
            const description = feature.properties['title'] || ''; // Use bracket notation here

            // Handle longitude wrapping (optional)
            coordinates[0] = (coordinates[0] + 540) % 360 - 180;  // More concise approach

            // Update popup content and add it to the map
            if (this.map) {
              console.log(description);

              popup.setLngLat(coordinates as [number, number])

                .setHTML(description)
                .addTo(this.map);
            }
          }
          if (this.map) {
            this.map.getCanvas().style.cursor = (e.features && e.features.length > 0) ? 'pointer' : '';
          }
        }});

      this.map?.on('mouseleave', 'earthquakes-layer', () => {
        popup.remove();
        if (this.map){
          this.map.getCanvas().style.cursor = '';
        }
      });
    });
  }
}

