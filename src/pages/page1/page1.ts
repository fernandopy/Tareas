import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})

export class Page1 {
  selectedItem: any;
  items: Array<{title: string, num: number}>;
  public arreglo;
  constructor( public http : Http,public alertCtrl: AlertController,public navCtrl: NavController, public navParams: NavParams) {
    // Se hace una petición post para llenar la lista con las tareas de tipo 1 (pendientes)
    var data;
    let headers = new Headers();
    var obj2 = JSON.parse('{"tipo":2}');
    var datos = JSON.stringify(obj2);
   	this.http.post('http://coral.izt.uam.mx/conexion_mongo.php', datos , {headers: headers})
    	.map(res=>res.json())
     	.subscribe(
      	data => {console.log('respuesta'),
	       	console.log(data[0].title)
	       	this.arreglo = data;
	       	this.selectedItem = navParams.get('item');
			this.items = [];
		    for (let i = 0; i < data.length; i++) {
		      this.items.push({
		        title: data[i].title,
		       num: i+1
		      });
		    }

   		},
      err => console.log("ERRORR"),
      () => console.log('Call Complete')
    );
}

  itemTapped(event, item) {
    this.navCtrl.push(Page1, {
      item: item
    });
  }

  showConfirm(num:any) {
  	let headers = new Headers();
    let confirm = this.alertCtrl.create({
      title: 'Tarea terminada',
      message: 'Si eliges "terminada" la tarea se eliminará de la lista',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
        	//cuando se eliga terminar se mandara el id para encontrar el objeto en mongo y 
        	//actualizarlo tipo = 3 así ya no aparecera en la lista
          text: 'Terminada',
          handler: () => {
          	console.log(this.arreglo[num-1]);
          	var id = this.arreglo[num-1]._id.$id;//saco el id de la tarea que se va a eliminar de la lista
          	var result = JSON.parse('{"tipo":3,"id":"'+id+'"}');
            var datos = JSON.stringify(result);
          	console.log(datos);
            this.http.post('http://coral.izt.uam.mx/conexion_mongo.php', datos , {headers: headers})
              .map(res=>res.json())
              .subscribe(
                data => console.log('respu '+JSON.stringify(data)),
                err => console.log("ERRORR"),
                () => console.log('Call Complete')
              );
              location.reload();// se recarga la página y ya no estará la tarea terminada
          }
        }
      ]
    });
    confirm.present();
  }
}
