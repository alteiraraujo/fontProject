import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpfFormatado'
})
export class CpfFormatadoPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';

    // Remove caracteres não numéricos
    const digits = value.replace(/\D/g, '');

    // Formata se tiver 11 dígitos
    if (digits.length === 11) {
      return `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6,9)}-${digits.slice(9,11)}`;
    }

    // Retorna original se não for válido
    return value;
  }
}
