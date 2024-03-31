import { EarthquakeFeature } from './../../interface/EarthQuakeInterface';
import { EarthquakeService } from './../../services/earthquake.service';
import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Earthquake } from '../../interface/EarthQuakeInterface';
import { SlideService } from '../../services/slide.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  checked: boolean = false;
  constructor(private earthquakeService: EarthquakeService, private slideService: SlideService) {
  }

  get style() {
    return this.checked ? 'mapbox://styles/mapbox/outdoors-v12':'mapbox://styles/mapbox/dark-v11' ;
  }

  ngOnInit(): void {
    this.getEarthquakes();
    this.getChecked();
  }
  getChecked(): boolean {
    this.slideService.getChecked().subscribe((checked) => {
      this.checked = checked;
      this.updateMapStyle();
    });
    return this.checked;
  }

  updateMapStyle() {
    if (this.map) {
      this.map.setStyle(this.style);
      this.initializeMap();
    }
  }

  map: mapboxgl.Map | undefined;
  lat: number = 37.9966083;
  lng: number = -7.8527005;
  earthquakeData: Earthquake = {
    type: 'FeatureCollection',
    features: [],
  };


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

  getMagColor(mag: number): string {
    if (mag < 1) {
      return 'green';
    } else if (mag < 2) {
      return 'yellow';
    } else if (mag < 3) {
      return 'orange';
    } else if (mag < 4) {
      return 'red';
    } else if (mag >= 4) {
      return 'purple';
    } else {
      return 'black'; // Default color
    }
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
                description: feature.properties.title,
                place: feature.properties.place,
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
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'mag'], // Use the 'mag' property to determine the color
            0, '#00FF00', // Green for minor earthquakes
            3, '#FFFF00', // Yellow for light earthquakes
            5, '#FFA500', // Orange for moderate earthquakes
            7, '#FF4500', // Red for strong earthquakes
            9, '#8B0000'  // Dark red for severe earthquakes
          ],
          'circle-stroke-color': 'white'
        }
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        focusAfterOpen: true
      });

      this.map?.on('mouseenter', 'earthquakes-layer', (e) => {
        if (this.map) {
          this.map.getCanvas().style.cursor = 'pointer';

          if (e.features) {
            var feature = e.features[0];
            if (feature.geometry && feature.geometry.type === 'Point' && feature.properties) {
              const coordinates = (feature.geometry as GeoJSON.Point).coordinates.slice();
              const description = feature.properties['title'] || '';

              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }
              popup.setLngLat(coordinates as mapboxgl.LngLatLike)
                .setHTML(description)
                .addTo(this.map);
              console.log('popup', popup.isOpen());

            }
          }
        }
      });

      this.map?.on('mouseleave', 'earthquakes-layer', () => {
        if (this.map) {
          this.map.getCanvas().style.cursor = '';
        }
        popup.remove();
      });
    });
  }
}

