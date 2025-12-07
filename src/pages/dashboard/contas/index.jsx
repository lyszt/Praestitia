import { useState, useEffect } from "react";
import { authenticatedFetch } from "../../../utils/api";
import Datagrid from "../../../components/datagrid";
import AddEntity from "../../../components/forms/AddEntity";
import DeleteButton from "../../../components/buttons/DeleteButton";
import EditEntity from "../../../components/forms/EditEntity";
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PeopleIcon from '@mui/icons-material/People';

const Contas = () => {
  const [users, setUsers] = useState([]);
  const [usersLength, setUsersLength] = useState(0);
  const [userRefresh, setUserRefresh] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await authenticatedFetch("/auth/users/");
        if (response.ok) {
          const data = await response.json();
          if (data.users) {
            setUsers(data.users);
            setUsersLength(data.users.length);
          }
        } else {
          console.error("Falha ao buscar usuários: status", response.status);
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    })();
  }, [userRefresh]);

  const currentPaginationModel = { page: 0, pageSize: usersLength || 5 };
  const userColumns = [
    { field: "id", headerName: "ID", width: 70, minWidth: 50 },
    { field: "username", headerName: "Username", width: 200, minWidth: 150, flex: 1 },
    { field: "email", headerName: "Email", width: 250, minWidth: 150, flex: 1 },
    { field: "group", headerName: "Grupo", width: 150, minWidth: 100 }
  ];

  const userFields = [
    { name: 'username', label: 'Username', required: true, helperText: 'Nome de usuário para login' },
    { name: 'email', label: 'Email', type: 'email', required: true, helperText: 'Email do usuário' },
    { name: 'password', label: 'Senha', type: 'password', required: true, helperText: 'Senha de acesso' },
    { name: 'group_id', label: 'ID do Grupo', type: 'number', helperText: 'ID do grupo de permissões (opcional)' }
  ];

  return (
    <main>
      <header className="p-5 w-full bg-transparent">
        <h1 className="w-full flex justify-left items-center gap-5 text-slate-200">
          <PeopleIcon sx={{ fontSize: 40, color: 'var(--praestitia-primary)' }} />
          Gerenciamento de Contas
        </h1>
      </header>

      <section aria-label="Gerenciamento de usuários">
        <div className="flex flex-row gap-3 items-center mb-5">
          <AddEntity
            entityType="usuário"
            buttonLabel="Adicionar Usuário"
            title="Adicionar Usuário"
            icon={AccountCircleIcon}
            apiEndpoint="/auth/users/"
            fields={userFields}
            setRefresh={setUserRefresh}
          />
          <EditEntity
            selectedIds={selectedIds}
            rows={users}
            entityType="usuário"
            buttonLabel="Editar Usuário"
            title="Editar Usuário"
            icon={EditIcon}
            apiEndpoint="/auth/users/"
            fields={userFields}
            setRefresh={setUserRefresh}
          />
          <DeleteButton
            selectedIds={selectedIds}
            entityType="usuário"
            apiEndpoint="/auth/users/"
            onDeleteSuccess={() => {
              setUserRefresh(prev => prev + 1);
              setSelectedIds([]);
            }}
          />
        </div>
        <Datagrid
          rows={users}
          columns={userColumns}
          paginationModel={currentPaginationModel}
          emptyText="Nenhum usuário cadastrado ainda"
          onRowSelectionModelChange={(newSelection) => setSelectedIds(newSelection)}
          rowSelectionModel={selectedIds}
        />
      </section>
    </main>
  );
};

export default Contas;
