import type { Campaign } from "@/features/campaigns/types/campaign.types";

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "1",
    title: "Fondo de Crédito Productivo — Cali",
    description:
      "Financiamiento para pequeñas empresas del sector manufacturero en el Valle del Cauca, con retorno anual proyectado del 12%.",
    status: "active",
    targetAmount: 500_000,
    raisedAmount: 320_000,
    startDate: "2024-01-15",
    endDate: "2024-07-15",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    title: "Cartera Agropecuaria — Antioquia",
    description:
      "Crédito para productores agrícolas del Oriente Antioqueño. Garantía hipotecaria sobre predios rurales.",
    status: "active",
    targetAmount: 250_000,
    raisedAmount: 250_000,
    startDate: "2024-02-01",
    endDate: "2024-08-01",
    createdAt: "2024-01-25",
  },
  {
    id: "3",
    title: "Portafolio PyME — Bogotá",
    description:
      "Línea de crédito rotativo para empresas medianas del sector servicios en Bogotá. Plazo de 12 meses.",
    status: "pending",
    targetAmount: 800_000,
    raisedAmount: 0,
    startDate: "2024-04-01",
    endDate: "2025-04-01",
    createdAt: "2024-03-20",
  },
  {
    id: "4",
    title: "Infraestructura Turística — Cartagena",
    description:
      "Financiamiento para mejoras en hospedaje y turismo en la costa Caribe. Rentabilidad ligada a ocupación hotelera.",
    status: "completed",
    targetAmount: 300_000,
    raisedAmount: 300_000,
    startDate: "2023-06-01",
    endDate: "2024-01-01",
    createdAt: "2023-05-15",
  },
  {
    id: "5",
    title: "Crédito Comercial — Barranquilla",
    description:
      "Capital de trabajo para importadores de la zona franca de Barranquilla. Ciclo de 90 días renovable.",
    status: "active",
    targetAmount: 150_000,
    raisedAmount: 90_000,
    startDate: "2024-03-01",
    endDate: "2024-09-01",
    createdAt: "2024-02-20",
  },
  {
    id: "6",
    title: "Fondo Energías Renovables — Cundinamarca",
    description:
      "Proyectos de energía solar para industria. Co-financiado con el Ministerio de Energía.",
    status: "cancelled",
    targetAmount: 600_000,
    raisedAmount: 80_000,
    startDate: "2024-01-01",
    endDate: "2024-06-01",
    createdAt: "2023-12-01",
  },
  {
    id: "7",
    title: "Microcrédito Rural — Nariño",
    description:
      "Créditos de bajo monto para comunidades rurales del sur del país. Impacto social medible.",
    status: "pending",
    targetAmount: 100_000,
    raisedAmount: 15_000,
    startDate: "2024-05-01",
    endDate: "2025-05-01",
    createdAt: "2024-04-01",
  },
  {
    id: "8",
    title: "Cartera Inmobiliaria — Medellín",
    description:
      "Financiamiento puente para desarrolladores residenciales en el Área Metropolitana del Valle de Aburrá.",
    status: "completed",
    targetAmount: 1_000_000,
    raisedAmount: 1_000_000,
    startDate: "2023-03-01",
    endDate: "2023-12-01",
    createdAt: "2023-02-15",
  },
];
