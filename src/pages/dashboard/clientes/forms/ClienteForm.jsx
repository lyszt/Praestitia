import { useState } from "react";
import { authenticatedFetch } from "../../../../utils/api";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const ClienteForm = ({ onCancel, onSubmit, setClienteRefresh, isExpanded, setIsExpanded }) => {
    const handleToggleExpand = () => {
        if (setIsExpanded) {
            setIsExpanded(!isExpanded);
        }
    };

    // Campos básicos
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [empresa, setEmpresa] = useState("");
    const [status, setStatus] = useState("Ativo");

    // Campos expandidos
    const [endereco, setEndereco] = useState("");
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");
    const [cep, setCep] = useState("");
    const [cpfCnpj, setCpfCnpj] = useState("");
    const [observacoes, setObservacoes] = useState("");

    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        const clienteData = {
            nome,
            email: email || undefined,
            telefone: telefone || undefined,
            empresa: empresa || undefined,
            status,
            endereco: endereco || undefined,
            cidade: cidade || undefined,
            estado: estado || undefined,
            cep: cep || undefined,
            cpf_cnpj: cpfCnpj || undefined,
            observacoes: observacoes || undefined,
        };

        try {
            const response = await authenticatedFetch("/api/clientes", {
                method: "POST",
                body: JSON.stringify(clienteData),
            });

            if (response.ok) {
                if (setClienteRefresh) setClienteRefresh((prev) => prev + 1);
                onSubmit?.();
            } else {
                const data = await response.json();
                setError(data.message || "Falha ao adicionar cliente");
            }
        } catch (err) {
            setError("Erro ao adicionar cliente: " + err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full z-9999 flex flex-col shadow-2xl rounded-lg h-full" style={{ backgroundColor: 'var(--surface-3)', color: 'var(--praestitia-text)' }}>
            <div className={`p-4 rounded-t-lg flex items-center justify-between sticky top-0 z-50 flex-shrink-0 ${!isExpanded ? 'handle cursor-move' : ''}`} style={{ backgroundColor: 'var(--surface-2)' }}>
                <div className="flex items-center gap-2">
                    <DragIndicatorIcon sx={{ color: 'var(--praestitia-primary)' }} />
                    <h2 className="text-lg font-semibold" style={{ color: 'var(--praestitia-text)' }}>Adicionar Cliente</h2>
                </div>
                <button
                    type="button"
                    onClick={onCancel}
                    className="p-1 rounded transition-colors"
                    style={{ backgroundColor: 'transparent' }}
                >
                    <CloseIcon sx={{ color: 'var(--praestitia-primary)' }} />
                </button>
            </div>

            <Box className={`flex flex-col gap-3 overflow-y-auto flex-1 ${isExpanded ? 'p-8 max-w-7xl mx-auto w-full' : 'p-6'}`}>
                {error && (
                    <Alert severity="error" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* Campos básicos */}
                <TextField
                    required
                    label="Nome Completo"
                    variant="outlined"
                    color="secondary"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    fullWidth
                    helperText="Nome completo do cliente"
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    color="secondary"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    helperText="Email de contato"
                />
                <TextField
                    label="Telefone"
                    variant="outlined"
                    color="secondary"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    fullWidth
                    placeholder="(00) 00000-0000"
                    helperText="Telefone de contato"
                />
                <TextField
                    label="Empresa"
                    variant="outlined"
                    color="secondary"
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    fullWidth
                    helperText="Empresa onde trabalha (opcional)"
                />
                <Autocomplete
                    value={status}
                    onChange={(_event, newValue) => setStatus(newValue || "Ativo")}
                    options={["Ativo", "Inativo", "Prospecto", "Arquivado"]}
                    renderInput={(params) => (
                        <TextField {...params} label="Status" required helperText="Status atual do cliente" />
                    )}
                    slotProps={{ popper: { style: { zIndex: 20000 } } }}
                />

                {/* Botão de expandir */}
                <Button
                    onClick={handleToggleExpand}
                    variant="text"
                    color="secondary"
                    endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    fullWidth
                    sx={{ mt: 1 }}
                >
                    {isExpanded ? "Menos Opções" : "Mais Opções"}
                </Button>

                {/* Campos expandidos */}
                {isExpanded && (
                    <>
                        <Divider sx={{ mt: 2 }} />
                        <Typography variant="subtitle1" color="secondary" sx={{ mt: 1, fontWeight: 'bold' }}>
                            Informações Adicionais
                        </Typography>

                        <TextField
                            label="CPF/CNPJ"
                            variant="outlined"
                            color="secondary"
                            value={cpfCnpj}
                            onChange={(e) => setCpfCnpj(e.target.value)}
                            fullWidth
                            size="small"
                            helperText="CPF ou CNPJ do cliente"
                        />

                        <TextField
                            label="Endereço"
                            variant="outlined"
                            color="secondary"
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                            fullWidth
                            size="small"
                            helperText="Endereço completo"
                        />

                        <div className="flex gap-3">
                            <TextField
                                label="Cidade"
                                variant="outlined"
                                color="secondary"
                                value={cidade}
                                onChange={(e) => setCidade(e.target.value)}
                                fullWidth
                                size="small"
                            />
                            <TextField
                                label="Estado"
                                variant="outlined"
                                color="secondary"
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                                sx={{ width: '150px' }}
                                size="small"
                                placeholder="SP"
                            />
                        </div>

                        <TextField
                            label="CEP"
                            variant="outlined"
                            color="secondary"
                            value={cep}
                            onChange={(e) => setCep(e.target.value)}
                            fullWidth
                            size="small"
                            placeholder="00000-000"
                            helperText="CEP do endereço"
                        />

                        <TextField
                            label="Observações"
                            variant="outlined"
                            color="secondary"
                            multiline
                            rows={3}
                            value={observacoes}
                            onChange={(e) => setObservacoes(e.target.value)}
                            fullWidth
                            size="small"
                            placeholder="Informações adicionais sobre o cliente..."
                            helperText="Notas e observações"
                        />
                    </>
                )}

                <Divider sx={{ mt: 2 }} />

                <Button
                    startIcon={<PersonAddIcon />}
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ mt: 1 }}
                >
                    Adicionar Cliente
                </Button>
            </Box>
        </form>
    );
};

export default ClienteForm;
