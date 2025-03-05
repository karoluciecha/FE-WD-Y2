import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; // Abilty to invoke method asynchronously


// This identifies that this is a service
@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private httpClient:HttpClient) { }

  // :Observable<any> says that its async method
  getWeatherData():Observable<any> {
    return this.httpClient.get('https://api.openweathermap.org/data/2.5/weather?q=Galway&appid=0104ad407a8d15f7ce35baed7577d5cb');
  }
}
