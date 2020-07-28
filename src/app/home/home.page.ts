import { Component } from '@angular/core';
import { Geofence } from '@ionic-native/geofence/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController } from '@ionic/angular';

import { SMS } from '@ionic-native/sms/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  latitudFinal: number;
  longitudFinal: number;
  lat2: number;
  lon2: number;
  total: number;
  texto: string;
  latitudInicial = 6.1523501;
  longitudInicial = -75.3650801;

  constructor(public geofence: Geofence, public geolocation: Geolocation, public alert: AlertController,
              public sms: SMS) {
    geofence.initialize().then(
      () => console.log('Geocerca esta lista!'),
      (err) => console.log(err)
    );
  }

   private addGeofence() {
    const cerca = {
      id: 'cerca 1',
      latitude: 6.1521787,
      longitude: -75.3651484,
      radius: 10,
      transitionType: 2,
    };
    this.geofence.addOrUpdate(cerca).then(
       () => console.log('Geofence agregada'),
       (err) => console.log('la geocelda fallo ')
     );
    this.geofence.onTransitionReceived().subscribe(pos => {
      this.sms.send('3117049557',  'Salioooooo');
      console.log('salio');
      this.alert.create({
        message: 'saliooo' });
      });
 }
  getGeolocation(){
     this.geolocation.getCurrentPosition().then(posicion => {
      this.latitudFinal = posicion.coords.latitude;
      this.longitudFinal = posicion.coords.longitude;
      this.total = this.calculateDistance(this.longitudInicial, this.longitudFinal, this.latitudInicial, this.latitudFinal);
      if (this.total < 0.001){
        this.texto = 'estas adentro';
    }else {
      this.texto = 'estas afuera';
    }
    });
      /*const latitudGeocerca = 6.1502718;
      const longitudGeocerca = -75.3761837;*/
  }

  calculateDistance( longitudInicial: number, longitudFinal: number,
                     latitudInicial: number, latitudFinal: number){

    const radio = 6378;
    const diferenciaDeLongitud = this.pasarGradosARadianes(longitudFinal - longitudInicial);
    const diferenciaDeLatitud = this.pasarGradosARadianes (latitudFinal - latitudInicial);
    const distanciaEntreLosDosPuntos = Math.pow(Math.sin(diferenciaDeLatitud / 2 ), 2) + Math.cos(latitudInicial) * Math.cos(latitudFinal)
    * Math.pow(Math.sin(diferenciaDeLongitud / 2), 2);
    const distanciaAlAngulo = 2 * Math.atan2(Math.sqrt(distanciaEntreLosDosPuntos), Math.sqrt(1 - distanciaEntreLosDosPuntos));
    const distancia = radio * distanciaAlAngulo;
    return distancia;
}
  setGeocelda(){
    this.addGeofence();
    console.log('holaa');

  }
  pasarGradosARadianes( numeroAPasar: number){
    const CIENTOOCHENTAGRADOS = 180;
    const PI = Math.PI;
    return (PI / CIENTOOCHENTAGRADOS) * (numeroAPasar);

  }



}
