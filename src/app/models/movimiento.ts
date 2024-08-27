import { Cuenta } from './cuenta';
export class Movimiento {
    id?: number;
    fecha?: Date;
    tipoMovimiento?: string;
    valor?: number;
    saldo?: number;
    cuentaId?: string;
    cuenta: Cuenta = new Cuenta;
  }
  