import { Component, OnInit } from '@angular/core';
import { Dni } from '../../model/dni';
import { DniService } from '../../service/dni.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

@Component({
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  selector: 'app-list-dni',
  templateUrl: './list-dni.component.html',
  styleUrls: ['./list-dni.component.css'],
})
export class ListDniComponent implements OnInit {
  dnis: Dni[] = [];
  editingDni: Dni | null = null;
  statusFilter: string = 'A';
  filteredDnis: Dni[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private dniService: DniService) {}

  // Metodos Crud
  ngOnInit(): void {
    this.cargarDnis();
  }

  cargarDnis(): void {
    this.dniService.getByStatus(this.statusFilter).subscribe({
      next: (data) => {
        this.dnis = data;
        this.filteredDnis = [...this.dnis];
        this.filtrarDnis();
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los DNIs';
        this.successMessage = '';
      },
    });
  }

  restaurarDni(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'El DNI será restaurado.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar',
      background: '#1e1e1e',
      color: '#ffffff',
      customClass: {
        popup: 'dark-popup',
        confirmButton: 'dark-confirm-button',
        cancelButton: 'dark-cancel-button',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.dniService.restoreDni(id).subscribe({
          next: (data) => {
            Swal.fire({
              title: '¡Restaurado!',
              text: `El DNI con ID ${id} ha sido restaurado correctamente.`,
              icon: 'success',
              background: '#1e1e1e',
              color: '#ffffff',
              customClass: {
                popup: 'dark-popup',
                confirmButton: 'dark-confirm-button',
              },
            });
            this.cargarDnis();
          },
          error: (error) => {
            console.error('Error al restaurar el DNI:', error);
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al restaurar el DNI.',
              icon: 'error',
              background: '#1e1e1e',
              color: '#ffffff',
              customClass: {
                popup: 'dark-popup',
                confirmButton: 'dark-confirm-button',
              },
            });
          },
        });
      }
    });
  }

  eliminarLogicamente(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#1e1e1e',
      color: '#ffffff',
      customClass: {
        popup: 'dark-popup',
        confirmButton: 'dark-confirm-button',
        cancelButton: 'dark-cancel-button',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.dniService.deleteLogical(id).subscribe({
          next: (response: string) => {
            this.dnis = this.dnis.filter((dni) => dni.id !== id);
            this.filtrarDnis();
            Swal.fire({
              title: '¡Eliminado!',
              text: `El elemento con ID ${id} ha sido eliminado.`,
              icon: 'success',
              background: '#1e1e1e',
              color: '#ffffff',
              customClass: {
                popup: 'dark-popup',
                confirmButton: 'dark-confirm-button',
              },
            });
          },
          error: (err) => {
            console.error('Error al eliminar el elemento:', err);
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al eliminar el elemento.',
              icon: 'error',
              background: '#1e1e1e',
              color: '#ffffff',
              customClass: {
                popup: 'dark-popup',
                confirmButton: 'dark-confirm-button',
              },
            });
          },
        });
      }
    });
  }

  eliminarFisicamente(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción, se eliminará de la base de datos.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#1e1e1e',
      color: '#ffffff',
      customClass: {
        popup: 'dark-popup',
        confirmButton: 'dark-confirm-button',
        cancelButton: 'dark-cancel-button',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.dniService.deleteFisical(id).subscribe({
          next: (response: string) => {
            this.dnis = this.dnis.filter((dni) => dni.id !== id);
            this.filtrarDnis();
            Swal.fire({
              title: '¡Eliminado!',
              text: `El elemento con ID ${id} ha sido eliminado.`,
              icon: 'success',
              background: '#1e1e1e',
              color: '#ffffff',
              customClass: {
                popup: 'dark-popup',
                confirmButton: 'dark-confirm-button',
              },
            });
          },
          error: (err) => {
            console.error('Error al eliminar el elemento:', err);
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al eliminar el elemento.',
              icon: 'error',
              background: '#1e1e1e',
              color: '#ffffff',
              customClass: {
                popup: 'dark-popup',
                confirmButton: 'dark-confirm-button',
              },
            });
          },
        });
      }
    });
  }

  cambiarFiltroEstado(filtro: string): void {
    this.statusFilter = filtro;
    this.cargarDnis();
  }

  editarDni(dni: Dni): void {
    this.editingDni = { ...dni };
  }

  guardarEdicion(): void {
    if (this.editingDni) {
      Swal.fire({
        title: '¿Confirmar edición?',
        text: `Estás a punto de actualizar el DNI a "${this.editingDni.dni}".`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar',
        background: '#1e1e1e',
        color: '#ffffff',
        customClass: {
          popup: 'dark-popup',
          confirmButton: 'dark-confirm-button',
          cancelButton: 'dark-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.dniService
            .updateDni(this.editingDni!.id, this.editingDni!.dni)
            .subscribe({
              next: () => {
                Swal.fire({
                  title: '¡Actualizado!',
                  text: 'El DNI ha sido actualizado correctamente.',
                  icon: 'success',
                  background: '#1e1e1e',
                  color: '#ffffff',
                  customClass: {
                    popup: 'dark-popup',
                    confirmButton: 'dark-confirm-button',
                  },
                });

                this.editingDni = null;
                this.cargarDnis();
              },
              error: (error) => {
                console.error('Error al actualizar el DNI:', error);
                Swal.fire({
                  title: 'Error',
                  text:
                    error.message || 'Hubo un problema al actualizar el DNI.',
                  icon: 'error',
                  background: '#1e1e1e',
                  color: '#ffffff',
                  customClass: {
                    popup: 'dark-popup',
                    confirmButton: 'dark-confirm-button',
                  },
                });
              },
            });
        }
      });
    }
  }

  cancelarEdicion(): void {
    Swal.fire({
      title: '¿Cancelar edición?',
      text: 'Los cambios no guardados se perderán.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver a la edición',
      background: '#1e1e1e',
      color: '#ffffff',
      customClass: {
        popup: 'dark-popup',
        confirmButton: 'dark-confirm-button',
        cancelButton: 'dark-cancel-button',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.editingDni = null;
      }
    });
  }

  // Buscador y Paginador
  filtrarDnis(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredDnis = this.dnis.filter(
      (dni) =>
        dni.dni.toLowerCase().includes(term) ||
        dni.nombres.toLowerCase().includes(term) ||
        dni.apellidoPaterno.toLowerCase().includes(term)
    );
    this.calcularPaginas();
  }

  calcularPaginas(): void {
    this.totalPages = Math.ceil(this.filteredDnis.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.currentPage = pagina;
    }
  }

  obtenerDnisPaginados(): Dni[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredDnis.slice(startIndex, endIndex);
  }

  // Exportaciones
  exportarExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.filteredDnis
    );
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Datos DNIs': worksheet },
      SheetNames: ['Datos DNIs'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    this.guardarArchivo(excelBuffer, 'dnis.xlsx');
  }

  guardarArchivo(buffer: any, nombreArchivo: string): void {
    const blob: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = nombreArchivo;
    link.click();
  }

  exportarPDF(): void {
    const doc = new jsPDF();
    const columnas = [
      { header: 'DNI', dataKey: 'dni' },
      { header: 'Nombres', dataKey: 'nombres' },
      { header: 'Apellido Paterno', dataKey: 'apellidoPaterno' },
      { header: 'Apellido Materno', dataKey: 'apellidoMaterno' },
    ];

    const filas = this.filteredDnis.map((dni) => ({
      dni: dni.dni,
      nombres: dni.nombres,
      apellidoPaterno: dni.apellidoPaterno,
      apellidoMaterno: dni.apellidoMaterno,
    }));

    doc.text('Reporte de DNIs', 14, 10);
    autoTable(doc, {
      columns: columnas,
      body: filas,
      startY: 20,
    });

    doc.save('dnis.pdf');
  }

  exportarCSV(): void {
    const encabezados = 'DNI,Nombres,Apellido Paterno\n';
    const filas = this.filteredDnis
      .map((dni) => `${dni.dni},${dni.nombres},${dni.apellidoPaterno}`)
      .join('\n');

    const blob = new Blob([encabezados + filas], {
      type: 'text/csv;charset=utf-8;',
    });
    saveAs(blob, 'dnis.csv');
  }
}
