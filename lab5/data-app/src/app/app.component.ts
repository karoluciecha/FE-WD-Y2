import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from './services/data.service';
import { WeatherService } from './services/weather.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'data-app';
  // Arrays to hold student and weather data
  students:any[] = [];
  weatherConditions:any[] = [];
  weatherTemperature:string[] = [];


  constructor(private dataService:DataService, private weatherService:WeatherService) {
    // We shouldn't put the logic here. Just initialization
  }

  ngOnInit(): void {
    // subscribing to invoke asynchronously
    this.dataService.getStudentData().subscribe((data) => {
      this.students = data.students;
    });

    this.weatherService.getWeatherData().subscribe((data) => {
      this.weatherConditions = data.weather; // data.weather looks for "weather" in JSON file
      this.weatherTemperature[0] = (data.main.temp - 273.15).toFixed(2); // taking only temperature and converting it from Kelvin to Celsius
      this.weatherTemperature[1] = (data.main.feels_like - 273.15).toFixed(2);
    });
  }
}
