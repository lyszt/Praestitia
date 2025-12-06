import { useState, useEffect } from "react";
import { authenticatedFetch } from "../../../utils/api";
import Datagrid from "../../../components/datagrid";
import AddEntity from "../../../components/forms/AddEntity";
import DeleteButton from "../../../components/buttons/DeleteButton";
import EditEntity from "../../../components/forms/EditEntity";
import EditIcon from '@mui/icons-material/Edit';
import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [leadsLength, setLeadsLength] = useState(0);
  const [leadRefresh, setLeadRefresh] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await authenticatedFetch("/api/leads/");
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

  const leadFields = [
    { name: 'nome', label: 'Nome do Lead', required: true, helperText: 'Nome completo do lead' },
    { name: 'email', label: 'Email', type: 'email', required: true, helperText: 'Email de contato' },
    { name: 'telefone', label: 'Telefone', mask: '(99) 99999-9999', placeholder: '(00) 00000-0000', helperText: 'Telefone de contato' },
    {
      name: 'origem',
      label: 'Origem',
      type: 'select',
      required: true,
      defaultValue: 'site',
      options: [
        { value: 'site', label: 'Site' },
        { value: 'indicacao', label: 'Indicação' },
        { value: 'redes_sociais', label: 'Redes Sociais' },
        { value: 'email', label: 'E-mail Marketing' },
        { value: 'telefone', label: 'Telefone' },
        { value: 'evento', label: 'Evento' },
        { value: 'outro', label: 'Outro' }
      ],
      helperText: 'Canal de origem do lead'
    },
    { name: 'interesse', label: 'Interesse', helperText: 'Produto ou serviço de interesse do lead' },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      defaultValue: 'novo',
      options: [
        { value: 'novo', label: 'Novo' },
        { value: 'contatado', label: 'Contatado' },
        { value: 'qualificado', label: 'Qualificado' },
        { value: 'em_negociacao', label: 'Em Negociação' },
        { value: 'convertido', label: 'Convertido' },
        { value: 'perdido', label: 'Perdido' }
      ],
      helperText: 'Status atual do lead'
    },
    { name: 'empresa', label: 'Empresa', expanded: true, size: 'small', helperText: 'Nome da empresa do lead' },
    { name: 'cargo', label: 'Cargo', expanded: true, size: 'small', helperText: 'Cargo do lead na empresa' },
    { name: 'pontuacao', label: 'Pontuação', type: 'number', expanded: true, size: 'small', defaultValue: 0, helperText: 'Score do lead para qualificação' },
    { name: 'observacoes', label: 'Observações', expanded: true, multiline: true, rows: 3, size: 'small', placeholder: 'Informações adicionais sobre o lead...', helperText: 'Notas e observações' }
  ];

  return (
    <main>
      <header className="p-5 w-full bg-transparent">
        <h1 className="w-full flex justify-left items-center gap-5 text-slate-200">
          <TrendingUp sx={{ fontSize: 40, color: 'var(--praestitia-primary)' }} />
          Leads em Prospecção
        </h1>
      </header>

      <section aria-label="Gerenciamento de leads">
        <div className="flex flex-row gap-3 items-center mb-5">
          <AddEntity
            entityType="lead"
            buttonLabel="Adicionar Lead"
            title="Adicionar Lead"
            icon={TrendingUpIcon}
            apiEndpoint="/api/leads/"
            fields={leadFields}
            setRefresh={setLeadRefresh}
          />
          <EditEntity
            selectedIds={selectedIds}
            rows={leads}
            entityType="lead"
            buttonLabel="Editar Lead"
            title="Editar Lead"
            icon={EditIcon}
            apiEndpoint="/api/leads/"
            fields={leadFields}
            setRefresh={setLeadRefresh}
          />
          <DeleteButton
            selectedIds={selectedIds}
            entityType="lead"
            apiEndpoint="/api/leads/"
            onDeleteSuccess={() => {
              setLeadRefresh(prev => prev + 1);
              setSelectedIds([]);
            }}
          />
        </div>
        <Datagrid
          rows={leads}
          columns={leadColumns}
          paginationModel={currentPaginationModel}
          emptyText="Nenhum lead cadastrado ainda"
          onRowSelectionModelChange={(newSelection) => setSelectedIds(newSelection)}
          rowSelectionModel={selectedIds}
        />
      </section>
    </main>
  );
};

export default Leads;
