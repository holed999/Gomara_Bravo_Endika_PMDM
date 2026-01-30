import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { IPregunta } from './../interfaces/interfaces';
import { GestionStorageService } from './gestion-storage.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CuestionarioService {
  private preguntas: IPregunta[] = [];

  private preguntasCargadasEnSesion: boolean = false;

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private storageService: GestionStorageService
  ) {
    this.recuperarPreguntas();
  }

  getPreguntas(): IPregunta[] {
    return this.preguntas;
  }

  async recuperarPreguntas() {
    if (!this.preguntasCargadasEnSesion) {
      console.log('Primera carga en esta sesión, leyendo desde JSON...');
      await this.leerDatosFicheroForzado();
      this.preguntasCargadasEnSesion = true;
    } else {
      console.log('Ya hay preguntas cargadas en esta sesión, manteniendo estado actual');
    }
  }

  private async leerDatosFicheroForzado(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Intentando leer fichero JSON (forzado)...');
      this.http.get<IPregunta[]>('assets/datos/datos.json').subscribe({
        next: (data) => {
          console.log('Datos leídos del JSON:', data);
          this.preguntas = data.map(pregunta => ({
            ...pregunta,
            respuestasIncorrectas: [],
            intentos: 0,
            acierto: false
          }));
          console.log('Preguntas procesadas y reseteadas:', this.preguntas);
          
          this.guardarPreguntas();
          resolve();
        },
        error: (error) => {
          console.error('Error al leer el fichero JSON:', error);
          reject(error);
        }
      });
    });
  }

  async mostrarAlerta(pregunta: IPregunta) {
    const alert = await this.alertController.create({
      header: 'Asmatu logotipoa',
      inputs: [
        {
          name: 'respuesta',
          type: 'text',
          placeholder: 'Sartu erantzuna'
        }
      ],
      buttons: [
        {
          text: 'Bidali',
          handler: (data) => {
            this.comprobarRespuesta(pregunta, data.respuesta);
          }
        }
      ]
    });

    await alert.present();
  }

  private comprobarRespuesta(pregunta: IPregunta, respuestaUsuario: string) {
    pregunta.intentos++;

    if (respuestaUsuario.trim().toLowerCase() === pregunta.respuesta.trim().toLowerCase()) {
      pregunta.acierto = true;
    } else {
      pregunta.acierto = false;
      if (!pregunta.respuestasIncorrectas.includes(respuestaUsuario)) {
        pregunta.respuestasIncorrectas.push(respuestaUsuario);
      }
    }
    this.guardarPreguntas();
  }

  async guardarPreguntas() {
    await this.storageService.setObject('preguntas', this.preguntas);
  }

  async reiniciarPreguntas() {
    this.preguntasCargadasEnSesion = false;
    await this.leerDatosFicheroForzado();
  }
}