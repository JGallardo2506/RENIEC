import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DniService } from '../../service/dni.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-consult-dni',
  standalone: true,
  imports: [CommonModule , HttpClientModule , FormsModule],
  templateUrl: './consult-dni.component.html',
})
export class ConsultDniComponent {
  dniInput: string = '';
  dniInfo: any = null;
  errorMessage: string = '';

  constructor(private dniService: DniService) {}

  // Método para realizar la consulta del DNI
  consultarDni() {
    if (this.dniInput) {
      this.dniService.consultDni(this.dniInput).subscribe({
        next: (data) => {
          this.dniInfo = data;
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = 'No se pudo consultar el DNI. Intente nuevamente.';
          this.dniInfo = null;
        }
      });
    } else {
      this.errorMessage = 'Por favor ingrese un DNI válido.';
    }
  }
}
