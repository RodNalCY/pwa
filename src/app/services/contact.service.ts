import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Contact } from '../models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  url = environment.url;

  constructor(private http: HttpClient) { }

  send(contact: Contact) {
    return this.http.post(`${this.url}/contactos`, contact);
  }

}
