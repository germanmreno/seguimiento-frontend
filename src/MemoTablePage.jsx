import { columns } from "./forums/columns"
import { DataTable } from "./forums/data-table"
import { Layout } from "./layout/Layout"

const data = [
  {
    id: "SSC-2024-1514",
    asunto: "ADDENDUM",
    solicitante: "PAPI GOLD",
    gerencia: "Consultoría Jurídica",
    date: new Date(),
    status: "pending",
    observacion: "Pendiente de confirmación"
  },
  {
    id: "SSC-2024-1535",
    asunto: "ADDENDUM 2",
    solicitante: "PAPI GOLD",
    gerencia: "Consultoría Jurídica",
    date: new Date(),
    status: "completed",
    observacion: "Pendiente de confirmación"
  },
  {
    id: "SSC-2024-1548",
    asunto: "ADDENDUM",
    solicitante: "PAPI GOLD",
    gerencia: "Consultoría Jurídica",
    date: new Date(),
    status: "completed",
    observacion: "Pendiente de confirmación"
  },
  {
    id: "SSC-2024-1515",
    asunto: "CONTRACT REVIEW",
    solicitante: "JOHN DOE",
    gerencia: "Finance",
    date: new Date(),
    status: "completed",
    observacion: "Aprobado por el M/G"
  },
  {
    id: "SSC-2024-1534",
    asunto: "CONTRACT REVIEW",
    solicitante: "JOHN DOE",
    gerencia: "Finance",
    date: new Date(),
    status: "completed",
    observacion: "Aprobado por el M/G"
  },
  {
    id: "SSC-2024-1516",
    asunto: "BUDGET APPROVAL",
    solicitante: "JANE SMITH",
    gerencia: "Operations",
    date: new Date(),
    status: "completed",
    observacion: "Negado"
  },
  {
    id: "SSC-2024-1517",
    asunto: "PROJECT KICKOFF",
    solicitante: "ALICE JOHNSON",
    gerencia: "Project Management",
    date: new Date(),
    status: "pending",
    observacion: "Pendiente"
  },
  {
    id: "SSC-2024-1518",
    asunto: "LEGAL REVIEW",
    solicitante: "BOB BROWN",
    gerencia: "Legal",
    date: new Date(),
    status: "completed",
    observacion: "Archivado"
  },
  {
    id: "SSC-2024-1519",
    asunto: "ANNUAL REPORT",
    solicitante: "CAROL WHITE",
    gerencia: "Administration",
    date: new Date(),
    status: "pending",
    observacion: "En revisión"
  },
  {
    id: "SSC-2024-1520",
    asunto: "IT UPGRADE",
    solicitante: "DAVID BLACK",
    gerencia: "IT",
    date: new Date(),
    status: "completed",
    observacion: "Implementado"
  },
  {
    id: "SSC-2024-1521",
    asunto: "MARKETING CAMPAIGN",
    solicitante: "EMILY GREEN",
    gerencia: "Marketing",
    date: new Date(),
    status: "pending",
    observacion: "En progreso"
  },
  {
    id: "SSC-2024-1522",
    asunto: "HR POLICY UPDATE",
    solicitante: "FRANK BLUE",
    gerencia: "Human Resources",
    date: new Date(),
    status: "completed",
    observacion: "Aprobado"
  },
  {
    id: "SSC-2024-1523",
    asunto: "SUPPLY CHAIN REVIEW",
    solicitante: "GRACE YELLOW",
    gerencia: "Supply Chain",
    date: new Date(),
    status: "pending",
    observacion: "Pendiente de revisión"
  },
  {
    id: "SSC-2024-1514",
    asunto: "ADDENDUM",
    solicitante: "PAPI GOLD",
    gerencia: "Consultoría Jurídica",
    date: new Date(),
    status: "pending",
    observacion: "Pendiente de confirmación"
  },
  {
    id: "SSC-2024-1515",
    asunto: "CONTRACT REVIEW",
    solicitante: "JOHN DOE",
    gerencia: "Finance",
    date: new Date(),
    status: "completed",
    observacion: "Aprobado por el M/G"
  },
  {
    id: "SSC-2024-1516",
    asunto: "BUDGET APPROVAL",
    solicitante: "JANE SMITH",
    gerencia: "Operations",
    date: new Date(),
    status: "completed",
    observacion: "Negado"
  },
  {
    id: "SSC-2024-1517",
    asunto: "PROJECT KICKOFF",
    solicitante: "ALICE JOHNSON",
    gerencia: "Project Management",
    date: new Date(),
    status: "pending",
    observacion: "Pendiente"
  },
  {
    id: "SSC-2024-1518",
    asunto: "LEGAL REVIEW",
    solicitante: "BOB BROWN",
    gerencia: "Legal",
    date: new Date(),
    status: "completed",
    observacion: "Archivado"
  },
  {
    id: "SSC-2024-1514",
    asunto: "ADDENDUM",
    solicitante: "PAPI GOLD",
    gerencia: "Consultoría Jurídica",
    date: new Date(),
    status: "pending",
    observacion: "Pendiente de confirmación"
  },
  {
    id: "SSC-2024-1515",
    asunto: "CONTRACT REVIEW",
    solicitante: "JOHN DOE",
    gerencia: "Finance",
    date: new Date(),
    status: "completed",
    observacion: "Aprobado por el M/G"
  },
  {
    id: "SSC-2024-1516",
    asunto: "BUDGET APPROVAL",
    solicitante: "JANE SMITH",
    gerencia: "Operations",
    date: new Date(),
    status: "completed",
    observacion: "Negado"
  },
  {
    id: "SSC-2024-1517",
    asunto: "PROJECT KICKOFF",
    solicitante: "ALICE JOHNSON",
    gerencia: "Project Management",
    date: new Date(),
    status: "pending",
    observacion: "Pendiente"
  },
  {
    id: "SSC-2024-1518",
    asunto: "LEGAL REVIEW",
    solicitante: "BOB BROWN",
    gerencia: "Legal",
    date: new Date(),
    status: "completed",
    observacion: "Archivado"
  },
];

// ...


export default function MemoTablePage() {


  return (
    <Layout >

      <div className="container mx-auto py-10 grid grid-rows-1 divide-y">
        <div className="bg-[#667f2a] text-white rounded-t-lg w-full h-12 flex items-center justify-start p-0 border-solid border-gray border-2 pl-4" >
          <h1 className="primary-text p-0 m-0">LISTA DE OFICIOS DE LA CORPORACIÓN VENEZOLANA DE MINERÍA</h1>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </Layout>
  )
}