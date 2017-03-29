
import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html'
})


export class Page2 {
   posts: any;
  constructor(public alertCtrl: AlertController, public http : Http) {
    this.posts = null;
        
  }
   showPrompt() {
    let headers = new Headers();
    let prompt = this.alertCtrl.create({
      title: 'Tareas',
      message: "Agrega el titulo de la nueva tarea",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          //si se presiona guardar mandara el json con el titulo de la tarea con el tipo 1
          //agrego la hora y fecha y se envían al servidor para almacenarse en mongodb
          text: 'Guardar',
          handler: (datas) => {
            var d = new Date();
            var mes = d.getMonth()+1;
            var fecha = d.getDate() +'/'+mes+'/'+d.getFullYear(); 
            var hora = hora = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds(); 
            var obj2 = JSON.parse('{"tipo":1,"fecha":"'+fecha+'","hora":"'+hora+'"}');
            var result = Object.assign({},datas,obj2);
            var datos = JSON.stringify(result);
            this.http.post('http://192.168.1.71/conexion_mongo.php', datos , {headers: headers})
              .map(res=>res.json())
              .subscribe(
                data => console.log('respuesta '+JSON.stringify(data)),
                err => console.log("ERRORR"),
                () => console.log('Call Complete')
              );
            
          }
        }
      ]
    });
    prompt.present();
  }
  
}
