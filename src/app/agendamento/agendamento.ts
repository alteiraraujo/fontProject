export interface Agendamento {
  id_agenda?: number;
  data_hora_agendamento: Date;
  procedimento_agendamento:
    | 'Serviços estéticos'
    | 'Consulta Clínica'
    | 'Vacina';
  status_agendamento: string;
  animal: {
    id_animal: number; // Ajustado para coincidir com Animal
    nome_animal?: string;
  };
  pessoa?: {
    id_pessoa: number;
    nome_pessoa: string;
  };
  tutor_animal?: string;
}
