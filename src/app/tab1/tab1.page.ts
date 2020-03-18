import { Component } from '@angular/core';
import * as L from 'leaflet';
import { SeasonsService } from '../services/seasons.service';
import { LegendComponent } from '../components/legend/legend.component';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  private map;
  seasons: any[] = [];
  seasonsMarker: any[] = [];
  seasonsCircle: any[] = [];

  constructor(
    private seasonsService: SeasonsService,
    public popoverController: PopoverController
  ) { }

  ionViewDidEnter() {
    this.seasonsService.getSeasons().subscribe((data: any) => {
      data.data = data.data.filter(d => {
        if (JSON.stringify(d.sensores).toLowerCase().indexOf('pm2.5') !== -1) {
          return d;
        }
      });
      this.seasons = data.data;
      this.initMap();
    });
  }

  ionViewWillLeave() {
    this.map.remove();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: LegendComponent,
      event: ev,
      // translucent: true
      mode: 'ios'
    });
    return await popover.present();
  }

  initMap() {

    this.map = L.map('map').setView([-12.0431800, -77.0282400], 10);
    // this.map = L.map('map').fitWorld();

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 19,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoibHVpc2NoIiwiYSI6ImNrN3A4cXZrczBkaHUzZW1rNDR5bjFyc2IifQ.q56hDBHis9mIdxdXDlQJxw'
    }).addTo(this.map);

    // L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   maxZoom: 19,
    //   attribution: '...'
    // }).addTo(this.map);

    this.map.locate({ setView: true, maxZoom: 12 });

    this.map.on('locationfound', (e) => {
      var radius = e.accuracy;
      L.marker(e.latlng).addTo(this.map)
        .bindPopup("Mi ubicación").openPopup();
      L.circle(e.latlng, radius).addTo(this.map);
    });

    this.map.on('locationerror', (e) => {
      console.log(e.message);
    });

    this.renderMarker();
    this.renderCircle();

  }

  renderMarker() {

    this.seasons.forEach(s => {

      let div = document.createElement('div');

      s.sensores.sort((a, b) => {
        return this.compare(a.sensor, b.sensor, true);
      });

      s.sensores.forEach((sn: any) => {
        let p = document.createElement('p');
        let strong = document.createElement('strong');
        let title = document.createTextNode(sn.sensor + ': ');
        let measure = document.createTextNode(sn.medida ? sn.medida.medida : '0.00');
        strong.appendChild(title);
        p.appendChild(strong);
        p.appendChild(measure);
        div.appendChild(p)
      });

      L.marker([s.latitud, s.longitud]).bindPopup(div).addTo(this.map);
    });
  }

  renderCircle() {
    let fillColor, measure, color;
    this.seasons.forEach(s => {
      s.sensores.forEach(sn => {
        if (sn.sensor.toLowerCase() === 'pm2.5') {
          measure = sn.medida ? sn.medida.medida : 0;
          if (measure >= 0 && measure <= 50) {
            color = '#00ff00';
            fillColor = '#00ff00';
          } else if (measure > 50 && measure <= 100) {
            color = '#ffff00';
            fillColor = '#ffff00';
          } else if (measure > 100 && measure <= 150) {
            color = '#ffa500';
            fillColor = '#ffa500';
          } else if (measure > 150 && measure <= 200) {
            color = '#ff0080';
            fillColor = '#ff0080';
          } else if (measure > 200 && measure <= 300) {
            color = '#ae00ae';
            fillColor = '#ae00ae';
          } else {
            color = '#a40900';
            fillColor = '#a40900';
          }
          let circle = L.circle([s.latitud, s.longitud], { radius: 1000, fillColor, color })
            .addTo(this.map).bindPopup(`Radio: 1000m`);
        }
      });
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }


}
