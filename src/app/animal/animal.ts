export interface Animal {
    id_animal?: number;
    nome_animal: string;
    idade_animal: number;
    status_animal: string;
    pessoa: { id_pessoa: number }; // Dono (ID da pessoa)
    raca: { id_raca: number }; // Raça (ID da raça)
  }
