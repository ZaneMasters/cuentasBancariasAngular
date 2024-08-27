import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/clientes';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  showPopup = false;
  editing = false;
  selectedCliente: Cliente = new Cliente();

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.getClientes();
  }

  getClientes(): void {
    this.clienteService.getClientes().subscribe((data: Cliente[]) => {
      this.clientes = data;
    });
  }

  openForm(): void {
    this.selectedCliente = new Cliente();
    this.editing = false;
    this.showPopup = true;
  }

  editCliente(cliente: Cliente): void {
    this.selectedCliente = { ...cliente };
    this.editing = true;
    this.showPopup = true;
  }

  closeForm(): void {
    this.showPopup = false;
  }

  onSubmit(): void {
    const successMessage = this.editing ? 'Cliente actualizado exitosamente!' : 'Cliente creado exitosamente!';
    
    if (this.editing && this.selectedCliente.id !== undefined) {
      this.clienteService.updateCliente(this.selectedCliente.id, this.selectedCliente).subscribe(() => {
        this.getClientes();
        this.closeForm();
        Swal.fire('Éxito', successMessage, 'success');
      });
    } else {
      this.clienteService.createCliente(this.selectedCliente).subscribe(() => {
        this.getClientes();
        this.closeForm();
        Swal.fire('Éxito', successMessage, 'success');
      });
    }
  }

  eliminarCliente(id: any): void {
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
        this.clienteService.deleteCliente(id).subscribe(() => {
          this.getClientes();
          Swal.fire(
            'Eliminado!',
            'El cliente ha sido eliminado.',
            'success'
          );
        });
      }
    });
  }
}
