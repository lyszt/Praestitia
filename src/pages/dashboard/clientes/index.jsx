import { useState, useEffect } from "react";
import { authenticatedFetch } from "../../../utils/api";
import Datagrid from "../../../components/datagrid";
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
      <header className="p-5 w-full" style={{ backgroundColor: '#f3f4f6' }}>
        <h1 className="w-full flex justify-left items-center gap-5">
          <Person sx={{ fontSize: 40, color: '#007F65' }} />
          Clientes Cadastrados
        </h1>
      </header>

      <section aria-label="Gerenciamento de clientes">
        <div className="flex flex-row">
          <button
            onClick={() => console.log('Adicionar cliente')}
            className="flex border-gray-200 border flex-row gap-2 mt-5 ml-5 mb-5 transition duration-100 rounded active:bg-gray-200 p-3 justify-center items-center"
            style={{ backgroundColor: '#f3f4f6' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          >
            <span style={{ color: '#007F65', fontSize: '24px' }}>+</span>
            <span>Adicionar Cliente</span>
          </button>
        </div>
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
