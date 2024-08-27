import { Component, OnInit } from '@angular/core';
import { CuentaService } from '../../services/cuenta.service';
import { ClienteService } from '../../services/cliente.service'; 
import { Cuenta } from '../../models/cuenta'; 
import { Cliente } from '../../models/clientes';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.css']
})
export class CuentasComponent implements OnInit {
  cuentas: Cuenta[] = [];
  clientes: Cliente[] = []; 
  showPopup = false;
  editing = false;
  selectedCuenta: Cuenta = new Cuenta();

  constructor(private cuentaService: CuentaService, private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.getCuentas();
    this.getClientes();
  }

  getCuentas(): void {
    this.cuentaService.getCuentas().subscribe((data: Cuenta[]) => {
      this.cuentas = data;
    });
  }

  getClientes(): void {
    this.clienteService.getClientes().subscribe((data: Cliente[]) => {
      this.clientes = data;
    });
  }

  openForm(): void {
    this.selectedCuenta = new Cuenta();
    this.editing = false;
    this.showPopup = true;
  }

  editCuenta(cuenta: Cuenta): void {
    this.selectedCuenta = { ...cuenta };
    this.editing = true;
    this.showPopup = true;
  }

  closeForm(): void {
    this.showPopup = false;
  }

  onSubmit(): void {
    const successMessage = this.editing ? 'Cuenta actualizada exitosamente!' : 'Cuenta creada exitosamente!';
    
    if (this.editing && this.selectedCuenta.id !== undefined) {
      this.cuentaService.updateCuenta(this.selectedCuenta.id, this.selectedCuenta).subscribe({
        next: () => {
          this.getCuentas();
          this.closeForm();
          Swal.fire('Éxito', successMessage, 'success');
        },
        error: (err) => {
          Swal.fire('Error', `Error al actualizar la cuenta: ${err.message}`, 'error');
        }
      });
    } else {
      this.cuentaService.createCuenta(this.selectedCuenta).subscribe({
        next: () => {
          this.getCuentas();
          this.closeForm();
          Swal.fire('Éxito', successMessage, 'success');
        },
        error: (err) => {
          Swal.fire('Error', `Error al crear la cuenta: ${err.message}`, 'error');
        }
      });
    }
  }
  

  eliminarCuenta(id: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cuentaService.deleteCuenta(id).subscribe({
          next: () => {
            this.getCuentas();
            Swal.fire('Eliminado!', 'La cuenta ha sido eliminada.', 'success');
          },
          error: (err) => {
            Swal.fire('Error', `Error al eliminar la cuenta: ${err.message}`, 'error');
          }
        });
      }
    });
  }
  
}
