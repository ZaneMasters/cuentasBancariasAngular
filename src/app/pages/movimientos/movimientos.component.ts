import { Component, OnInit } from '@angular/core';
import { MovimientoService } from '../../services/movimiento.service';
import { Movimiento } from '../../models/movimiento';
import Swal from 'sweetalert2';
import { Cuenta } from 'src/app/models/cuenta';
import { CuentaService } from '../../services/cuenta.service';


@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css']
})
export class MovimientosComponent implements OnInit {
  movimientos: Movimiento[] = [];
  cuentas: Cuenta[] = [];
  showPopup = false;
  editing = false;
  selectedMovimiento: Movimiento = new Movimiento();

  constructor(private movimientoService: MovimientoService,private cuentaService: CuentaService) {}

  ngOnInit(): void {
    this.getMovimientos();
    this.getCuentas();
  }
  
  getMovimientos(): void {
    this.movimientoService.getMovimientos().subscribe((data: Movimiento[]) => {
      this.movimientos = data;
    });
  }

  getCuentas(): void {
    this.cuentaService.getCuentas().subscribe((data: Cuenta[]) => {
      this.cuentas = data;
    });
  }
  
  openForm(): void {
    this.selectedMovimiento = new Movimiento();
    this.editing = false;
    this.showPopup = true;
    console.log(this.movimientos);
  }

  editMovimiento(movimiento: Movimiento): void {
    this.selectedMovimiento = { ...movimiento };
    this.editing = true;
    this.showPopup = true;
  }

  closeForm(): void {
    this.showPopup = false;
  }

  onSubmit(): void {
    const successMessage = this.editing ? 'Movimiento actualizado exitosamente!' : 'Movimiento creado exitosamente!';
    
    if (this.editing && this.selectedMovimiento.id !== undefined) {
      this.movimientoService.updateMovimiento(this.selectedMovimiento.id, this.selectedMovimiento).subscribe({
        next: () => {
          this.getMovimientos();
          this.closeForm();
          Swal.fire('Éxito', successMessage, 'success');
        },
        error: (err) => {
          Swal.fire('Error', `Error al actualizar el movimiento: ${err.error}`, 'error');
        }
      });
    } else {
      this.movimientoService.createMovimiento(this.selectedMovimiento).subscribe({
        next: () => {
          this.getMovimientos();
          this.closeForm();
          Swal.fire('Éxito', successMessage, 'success');
        },
        error: (err) => {
          Swal.fire('Error', `Error al crear el movimiento: ${err.error}`, 'error');
        }
      });
    }
  }
  

  eliminarMovimiento(id: any): void {
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
        this.movimientoService.deleteMovimiento(id).subscribe({
          next: () => {
            this.getMovimientos();
            Swal.fire('Eliminado!', 'El movimiento ha sido eliminado.', 'success');
          },
          error: (err) => {
            Swal.fire('Error', `Error al eliminar el movimiento: ${err.message}`, 'error');
          }
        });
      }
    });
  }
  
}
