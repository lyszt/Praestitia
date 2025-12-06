import { useState, useEffect } from "react";
import { authenticatedFetch } from "../../../utils/api";
import Datagrid from "../../../components/datagrid";
import AddEntity from "../../../components/forms/AddEntity";
import DeleteButton from "../../../components/buttons/DeleteButton";
import EditEntity from "../../../components/forms/EditEntity";
import EditIcon from '@mui/icons-material/Edit';
import Person from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clientesLength, setClientesLength] = useState(0);
  const [clienteRefresh, setClienteRefresh] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await authenticatedFetch("/api/clientes/");
        if (response.ok) {
          const data = await response.json();
          if (data.clientes) {
            setClientes(data.clientes);
            setClientesLength(data.clientes.length);
          }
        } else {
          console.error("Falha ao buscar clientes: status", response.status);
        }
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    })();
  }, [clienteRefresh]);

  const currentPaginationModel = { page: 0, pageSize: clientesLength || 5 };
  const clienteColumns = [
    { field: "id", headerName: "ID", width: 70, minWidth: 50 },
    { field: "nome", headerName: "Nome do Cliente", width: 200, minWidth: 150, flex: 1 },
    { field: "email", headerName: "Email", width: 200, minWidth: 150, flex: 1 },
    { field: "telefone", headerName: "Telefone", width: 150, minWidth: 100 },
    { field: "empresa", headerName: "Empresa", width: 200, minWidth: 150, flex: 1 },
    { field: "status", headerName: "Status", width: 120, minWidth: 100 }
  ];

  const clienteFields = [
    { name: 'nome', label: 'Nome Completo', required: true, helperText: 'Nome completo do cliente' },
    { name: 'email', label: 'Email', type: 'email', required: false, helperText: 'Email de contato' },
    { name: 'telefone', label: 'Telefone', mask: '(99) 99999-9999', placeholder: '(00) 00000-0000', helperText: 'Telefone de contato' },
    { name: 'empresa', label: 'Empresa', helperText: 'Empresa onde trabalha (opcional)' },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      defaultValue: 'Ativo',
      options: [
        { value: 'Ativo', label: 'Ativo' },
        { value: 'Inativo', label: 'Inativo' },
        { value: 'Prospecto', label: 'Prospecto' },
        { value: 'Arquivado', label: 'Arquivado' }
      ],
      helperText: 'Status atual do cliente'
    },
    { name: 'cpf_cnpj', label: 'CPF/CNPJ', expanded: true, size: 'small', helperText: 'CPF ou CNPJ do cliente' },
    { name: 'endereco', label: 'Endereço', expanded: true, size: 'small', helperText: 'Endereço completo' },
    { name: 'cidade', label: 'Cidade', expanded: true, size: 'small' },
    { name: 'estado', label: 'Estado', expanded: true, size: 'small', placeholder: 'SP' },
    { name: 'cep', label: 'CEP', expanded: true, size: 'small', placeholder: '00000-000', helperText: 'CEP do endereço' },
    { name: 'observacoes', label: 'Observações', expanded: true, multiline: true, rows: 3, size: 'small', placeholder: 'Informações adicionais sobre o cliente...', helperText: 'Notas e observações' }
  ];

  return (
    <main>
      <header className="p-5 w-full bg-transparent">
        <h1 className="w-full flex justify-left items-center gap-5 text-slate-200">
          <Person sx={{ fontSize: 40, color: 'var(--praestitia-primary)' }} />
          Clientes Cadastrados
        </h1>
      </header>

      <section aria-label="Gerenciamento de clientes">
        <div className="flex flex-row gap-3 items-center mb-5">
          <AddEntity
            entityType="cliente"
            buttonLabel="Adicionar Cliente"
            title="Adicionar Cliente"
            icon={PersonAddIcon}
            apiEndpoint="/api/clientes/"
            fields={clienteFields}
            setRefresh={setClienteRefresh}
          />
          <EditEntity
            selectedIds={selectedIds}
            rows={clientes}
            entityType="cliente"
            buttonLabel="Editar Cliente"
            title="Editar Cliente"
            icon={EditIcon}
            apiEndpoint="/api/clientes/"
            fields={clienteFields}
            setRefresh={setClienteRefresh}
          />
          <DeleteButton
            selectedIds={selectedIds}
            entityType="cliente"
            apiEndpoint="/api/clientes/"
            onDeleteSuccess={() => {
              setClienteRefresh(prev => prev + 1);
              setSelectedIds([]);
            }}
          />
        </div>
        <Datagrid
          rows={clientes}
          columns={clienteColumns}
          paginationModel={currentPaginationModel}
          emptyText="Nenhum cliente cadastrado ainda"
          onRowSelectionModelChange={(newSelection) => setSelectedIds(newSelection)}
          rowSelectionModel={selectedIds}
        />
      </section>
    </main>
  );
};

export default Clientes;
