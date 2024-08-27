import { Cliente } from "./clientes";

export class Cuenta {
  id:           number;
  numeroCuenta: string;
  tipoCuenta:   string;
  saldoInicial: number;
  estado:       boolean;
  clienteId: number = 0;
  cliente:      Cliente;

  constructor() {
    this.id = 0;
    this.numeroCuenta = '';
    this.tipoCuenta = '';
    this.saldoInicial = 0;
    this.estado = true;
    this.cliente = {} as Cliente; 
  }
}
