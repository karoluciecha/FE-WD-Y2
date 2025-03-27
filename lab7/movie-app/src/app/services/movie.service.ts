import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Import the Observable class from the rxjs package
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  // API key for the OMDB API
  // This key is used to authenticate requests to the OMDB API
  private apiKey = '11fa1dcb';
  private apiUrl = `https://www.omdbapi.com/?apikey=${this.apiKey}&s=war`;

  // Inject the HttpClient service into the constructor
  // This will allow us to make HTTP requests to the OMDB API
  constructor(private http: HttpClient) {}

  // Create a method that fetches movies from the OMDB API
  // This method will return an Observable that emits the response from the API
  getMovies(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
