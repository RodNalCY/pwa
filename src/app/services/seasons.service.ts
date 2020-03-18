import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeasonsService {

  url = environment.url;

  constructor(private http: HttpClient) { }

  getSeasons(): any {
    return this.http.get(`${this.url}/estaciones/datos/getAll`);
  }
}
