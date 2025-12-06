import { useState, useEffect } from "react";
import { authenticatedFetch } from "../../../utils/api";
import Datagrid from "../../../components/datagrid";
import AddCliente from "./forms/AddCliente";
import Person from '@mui/icons-material/Person';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clientesLength, setClientesLength] = useState(0);
  const [clienteRefresh, setClienteRefresh] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const response = await authenticatedFetch("/api/clientes");
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

  return (
    <main>
      <header className="p-5 w-full" style={{ backgroundColor: '#000000' }}>
        <h1 className="w-full flex justify-left items-center gap-5" style={{ color: 'var(--praestitia-text)' }}>
          <Person sx={{ fontSize: 40, color: 'var(--praestitia-primary)' }} />
          Clientes Cadastrados
        </h1>
      </header>

      <section aria-label="Gerenciamento de clientes">
        <AddCliente setClienteRefresh={setClienteRefresh} />
        <Datagrid
          rows={clientes}
          columns={clienteColumns}
          paginationModel={currentPaginationModel}
          emptyText="Nenhum cliente cadastrado ainda"
        />
      </section>
    </main>
  );
};

export default Clientes;
