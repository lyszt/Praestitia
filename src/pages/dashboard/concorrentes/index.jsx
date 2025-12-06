import { useState, useEffect } from "react";
import { authenticatedFetch } from "../../../utils/api";
import Datagrid from "../../../components/datagrid";
import AddEntity from "../../../components/forms/AddEntity";
import DeleteButton from "../../../components/buttons/DeleteButton";
import EditEntity from "../../../components/forms/EditEntity";
import EditIcon from '@mui/icons-material/Edit';
import DomainIcon from '@mui/icons-material/Domain';

const Concorrentes = () => {
    const [concorrentes, setConcorrentes] = useState([]);
    const [concorrentesLength, setConcorrentesLength] = useState(0);
    const [concorrenteRefresh, setConcorrenteRefresh] = useState(0);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await authenticatedFetch("/api/concorrentes/");
                if (response.ok) {
                    const data = await response.json();
                    if (data.concorrentes) {
                        setConcorrentes(data.concorrentes);
                        setConcorrentesLength(data.concorrentes.length);
                    }
                } else {
                    console.error("Falha ao buscar concorrentes: status", response.status);
                }
            } catch (error) {
                console.error("Erro ao buscar concorrentes:", error);
            }
        })();
    }, [concorrenteRefresh]);

    const currentPaginationModel = { page: 0, pageSize: concorrentesLength || 5 };

    const concorrenteColumns = [
        { field: 'id', headerName: 'ID', width: 70, minWidth: 50 },
        { field: 'nome', headerName: 'Nome', width: 200, minWidth: 150, flex: 1 },
        { field: 'email', headerName: 'Email', width: 200, minWidth: 150, flex: 1 },
        { field: 'telefone', headerName: 'Telefone', width: 150, minWidth: 100 },
        { field: 'site', headerName: 'Site', width: 200, minWidth: 150, flex: 1, renderCell: (params) => params.value ? <a href={params.value} target="_blank" rel="noopener noreferrer" className="link link-primary">{params.value}</a> : '-' },
        { field: 'observacoes', headerName: 'Observações', width: 200, minWidth: 150, flex: 1 },
        { field: 'data_cadastro', headerName: 'Cadastrado em', width: 180, minWidth: 150 },
    ];

    const concorrenteFields = [
        { name: 'nome', label: 'Nome', type: 'text', required: true, placeholder: 'Nome da empresa concorrente', helperText: 'Nome da empresa' },
        { name: 'cnpj', label: 'CNPJ', type: 'text', expanded: true, size: 'small', placeholder: '00.000.000/0000-00', helperText: 'CNPJ da empresa' },
        { name: 'responsavel', label: 'Responsável', type: 'text', expanded: true, size: 'small', placeholder: 'Nome do contato', helperText: 'Pessoa de contato' },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'contato@concorrente.com', helperText: 'Email de contato' },
        { name: 'telefone', label: 'Telefone', mask: '(99) 99999-9999', placeholder: '(00) 00000-0000', helperText: 'Telefone de contato' },
        { name: 'site', label: 'Site', type: 'text', placeholder: 'https://www.exemplo.com', helperText: 'Website' },
        { name: 'endereco', label: 'Endereço', type: 'text', placeholder: 'Endereço completo', helperText: 'Endereço principal' },
        { name: 'cidade', label: 'Cidade', type: 'text', expanded: true, size: 'small' },
        { name: 'estado', label: 'Estado', type: 'text', expanded: true, size: 'small', placeholder: 'UF' },
        { name: 'cep', label: 'CEP', type: 'text', expanded: true, size: 'small', placeholder: '00000-000' },
        { name: 'pontos_fortes', label: 'Pontos Fortes', type: 'textarea', expanded: true, multiline: true, rows: 3, placeholder: 'Diferenciais competitivos...', helperText: 'Análise de pontos fortes' },
        { name: 'pontos_fracos', label: 'Pontos Fracos', type: 'textarea', expanded: true, multiline: true, rows: 3, placeholder: 'Vulnerabilidades...', helperText: 'Análise de pontos fracos' },
        { name: 'observacoes', label: 'Observações', type: 'textarea', expanded: true, multiline: true, rows: 3, placeholder: 'Outras anotações', helperText: 'Observações gerais' },
    ];

    return (
        <main>
            <header className="p-5 w-full" style={{ backgroundColor: '#000000' }}>
                <h1 className="w-full flex justify-left items-center gap-5" style={{ color: 'var(--praestitia-text)' }}>
                    <DomainIcon sx={{ fontSize: 40, color: 'var(--praestitia-primary)' }} />
                    Concorrentes
                </h1>
            </header>

            <section aria-label="Gerenciamento de concorrentes">
                <div className="flex flex-row gap-3 items-center mb-5">
                    <AddEntity
                        entityType="Concorrente"
                        buttonLabel="Adicionar Concorrente"
                        title="Novo Concorrente"
                        icon={DomainIcon}
                        apiEndpoint="/api/concorrentes/"
                        fields={concorrenteFields}
                        setRefresh={setConcorrenteRefresh}
                    />
                    <EditEntity
                        selectedIds={selectedIds}
                        rows={concorrentes}
                        entityType="Concorrente"
                        buttonLabel="Editar"
                        fields={concorrenteFields}
                        apiEndpoint="/api/concorrentes/"
                        title="Editar Concorrente"
                        icon={EditIcon}
                        setRefresh={setConcorrenteRefresh}
                    />
                    <DeleteButton
                        selectedIds={selectedIds}
                        entityType="concorrentes"
                        apiEndpoint="/api/concorrentes/"
                        onDeleteSuccess={() => {
                            setConcorrenteRefresh(prev => prev + 1);
                            setSelectedIds([]);
                        }}
                    />
                </div>

                <Datagrid
                    rows={concorrentes}
                    columns={concorrenteColumns}
                    paginationModel={currentPaginationModel}
                    emptyText="Nenhum concorrente cadastrado ainda"
                    onRowSelectionModelChange={(newSelection) => setSelectedIds(newSelection)}
                    rowSelectionModel={selectedIds}
                />
            </section>
        </main>
    )
}

export default Concorrentes;
