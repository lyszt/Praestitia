import { useState, useEffect } from "react";
import { authenticatedFetch } from "../../../utils/api";
import Datagrid from "../../../components/datagrid";
import TrendingUp from '@mui/icons-material/TrendingUp';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [leadsLength, setLeadsLength] = useState(0);
  const [leadRefresh, setLeadRefresh] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const response = await authenticatedFetch("/api/leads");
        if (response.ok) {
          const data = await response.json();
          if (data.leads) {
            setLeads(data.leads);
            setLeadsLength(data.leads.length);
          }
        } else {
          console.error("Falha ao buscar leads: status", response.status);
        }
      } catch (error) {
        console.error("Erro ao buscar leads:", error);
      }
    })();
  }, [leadRefresh]);

  const currentPaginationModel = { page: 0, pageSize: leadsLength || 5 };
  const leadColumns = [
    { field: "id", headerName: "ID", width: 70, minWidth: 50 },
    { field: "nome", headerName: "Nome do Lead", width: 200, minWidth: 150, flex: 1 },
    { field: "email", headerName: "Email", width: 200, minWidth: 150, flex: 1 },
    { field: "telefone", headerName: "Telefone", width: 150, minWidth: 100 },
    { field: "origem", headerName: "Origem", width: 150, minWidth: 100 },
    { field: "interesse", headerName: "Interesse", width: 200, minWidth: 150, flex: 1 },
    { field: "status", headerName: "Status", width: 120, minWidth: 100 }
  ];

  return (
    <main>
      <header className="p-5 w-full" style={{ backgroundColor: '#000000' }}>
        <h1 className="w-full flex justify-left items-center gap-5" style={{ color: 'var(--praestitia-text)' }}>
          <TrendingUp sx={{ fontSize: 40, color: 'var(--praestitia-primary)' }} />
          Leads em Prospecção
        </h1>
      </header>

      <section aria-label="Gerenciamento de leads">
        <div className="flex flex-row">
          <button
            onClick={() => console.log('Adicionar lead')}
            className="flex border flex-row gap-2 mt-5 ml-5 mb-5 transition duration-100 rounded p-3 justify-center items-center"
            style={{
              backgroundColor: 'var(--surface-2)',
              borderColor: 'var(--surface-3)',
              color: 'var(--praestitia-text)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-3)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-2)'}
          >
            <span style={{ color: 'var(--praestitia-primary)', fontSize: '24px' }}>+</span>
            <span>Adicionar Lead</span>
          </button>
        </div>
        <Datagrid
          rows={leads}
          columns={leadColumns}
          paginationModel={currentPaginationModel}
          emptyText="Nenhum lead cadastrado ainda"
        />
      </section>
    </main>
  );
};

export default Leads;
