import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Earthquake } from '../interface/EarthQuakeInterface';

@Injectable({
  providedIn: 'root'
})
export class EarthquakeService {

  baseUrl = 'https://earthquake.usgs.gov';

  constructor(private http: HttpClient) {}

  getEarthquakes(): Observable<Earthquake> {
    return this.http.get<Earthquake>(`${this.baseUrl}/fdsnws/event/1/query?format=geojson&starttime=2024-01-01&endtime=2024-01-02`);
  }
}
