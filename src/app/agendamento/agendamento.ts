export interface Agendamento{
    id_agenda?: number;
    data_hora_agendamento: Date;
    tbl_animal_id: number;
    procedimento_agendamento: "Serviços estéticos" | "Consulta Clínica" | "Vacina";
    tutor_animal: string;
    status_agendamento: string;

}