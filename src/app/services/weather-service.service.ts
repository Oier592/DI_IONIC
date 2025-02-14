import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherData } from '../interfaces/weather-data';

@Injectable({
  providedIn: 'root',
})
export class WeatherService { // APIaren informazioa du, hau da, informazioa kontsultatzen du eta emaitza behar denean bueltatzen du.
  private apiKey = '05c4463f0d49c4e68906f75aa2aba10d';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(private http: HttpClient) {}

  fetchWeather(city: string): Observable<WeatherData> {
    return this.http.get<WeatherData>(`${this.apiUrl}?q=${city}&units=metric&appid=${this.apiKey}`);
  }
}
