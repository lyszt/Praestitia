import { useState } from 'react';
import { authenticatedFetch } from '../../utils/api';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const DeleteButton = ({
    selectedIds,
    entityType,
    apiEndpoint,
    onDeleteSuccess,
    disabled = false
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        if (!loading) {
            setOpen(false);
            setError(null);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        setError(null);

        try {
            // Manda um pedido pra cada item que vai ser deletado
            const deletePromises = selectedIds.map(id =>
                authenticatedFetch(`${apiEndpoint}${id}/`, {
                    method: 'DELETE'
                })
            );

            // Promise é mais eficaz/performativo que fazer um fetch pra cada item 
            // Isso usa multithreads
            const responses = await Promise.all(deletePromises);

            // Checa se todos os pedidos de deleção deram certo
            const allSuccessful = responses.every(response => response.ok);

            if (allSuccessful) {
                const count = selectedIds.length;
                setSnackbar({
                    open: true,
                    message: `${count} ${entityType}(s) deletado(s) com sucesso!`,
                    severity: 'success'
                });
                setOpen(false);

                if (onDeleteSuccess) {
                    onDeleteSuccess();
                }
            } else {
                const failedCount = responses.filter(r => !r.ok).length;
                setError(`Falha ao deletar ${failedCount} ${entityType}(s)`);
            }
        } catch (err) {
            setError(`Erro ao deletar ${entityType}(s): ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const count = selectedIds.length;
    const isDisabled = disabled || count === 0;

    return (
        <>
            <button
                onClick={handleClickOpen}
                disabled={isDisabled}
                className="flex border border-slate-700 flex-row gap-2 transition duration-100 rounded p-3 justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-900 bg-gray-800 text-slate-50 hover:bg-slate-700 disabled:hover:bg-gray-900"
            >
                <span className={`text-2xl ${isDisabled ? 'text-slate-400' : 'text-red-500'}`}>×</span>
                <span>Deletar {count > 0 ? `(${count})` : ''}</span>
            </button>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                PaperProps={{
                    sx: {
                        backgroundColor: 'var(--surface-2)',
                        color: 'var(--praestitia-text)',
                        border: '1px solid var(--surface-3)'
                    }
                }}
            >
                <DialogTitle id="delete-dialog-title" sx={{ color: 'var(--praestitia-text)' }}>
                    Confirmar Exclusão
                </DialogTitle>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <DialogContentText id="delete-dialog-description" sx={{ color: 'var(--muted)' }}>
                        Tem certeza que deseja deletar <strong>{count}</strong> {entityType}(s) selecionado(s)?
                        <br />
                        <br />
                        Esta ação não pode ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={handleClose}
                        disabled={loading}
                        sx={{ color: 'var(--praestitia-text)' }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={loading}
                        variant="contained"
                        color="error"
                        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
                    >
                        {loading ? 'Deletando...' : 'Deletar'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default DeleteButton;
