import { Component, OnInit } from '@angular/core';
import { CuestionarioService } from './../servicios/cuestionario.service';
import { IPregunta } from './../interfaces/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  preguntas: IPregunta[] = [];
  preguntaActual?: IPregunta;
  indicePreguntaActual: number = 0;

  constructor(private cuestionarioService: CuestionarioService) {}

  async ngOnInit() {
    await this.cargarPreguntas();
  }

  async cargarPreguntas() {
    await this.cuestionarioService.recuperarPreguntas();
    
    setTimeout(() => {
      this.preguntas = this.cuestionarioService.getPreguntas();
      console.log('Preguntas cargadas en home:', this.preguntas);
      if (this.preguntas.length > 0) {
        this.preguntaActual = this.preguntas[this.indicePreguntaActual];
        console.log('Pregunta actual:', this.preguntaActual);
      }
    }, 100);
  }

  async responder(pregunta: IPregunta) {
    if (pregunta) {
      await this.cuestionarioService.mostrarAlerta(pregunta);
      this.preguntas = this.cuestionarioService.getPreguntas();
      this.preguntaActual = this.preguntas[this.indicePreguntaActual];
    }
  }

  guardar() {
    this.cuestionarioService.guardarPreguntas();
  }

}