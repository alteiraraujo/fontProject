import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefoneFormatado'
})
export class TelefoneFormatadoPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';

    // Remove qualquer caractere que não seja número
    const digits = value.replace(/\D/g, '');

    // Formato (00) 00000-0000 ou (00) 0000-0000
    if (digits.length === 11) {
      return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7,11)}`;
    }
    if (digits.length === 10) {
      return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6,10)}`;
    }
    // Retorna valor original se não bate com nenhum formato esperado
    return value;
  }
}
