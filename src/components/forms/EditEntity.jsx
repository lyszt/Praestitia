import { useState, useRef, useEffect } from "react";
import Draggable from 'react-draggable';
import { getModalStyle } from '../modals/modalStyles';
import EntityForm from './EntityForm';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const EditEntity = ({ selectedIds, rows, entityType, buttonLabel, fields, apiEndpoint, title, icon, setRefresh }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const nodeRef = useRef(null);

    const handleEditClick = () => {
        if (selectedIds.length !== 1) {
            setShowWarning(true);
        } else {
            setShowForm(true);
        }
    };

    const handleFormSubmit = () => {
        setShowForm(false);
        setIsExpanded(false);
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setIsExpanded(false);
    };

    useEffect(() => {
        const handleCancelExpansionKey = (event) => {
            if (showForm && event.key === 'Escape') {
                setShowForm(false);
                setIsExpanded(false);
            }
        };

        window.addEventListener('keydown', handleCancelExpansionKey);
        return () => {
            window.removeEventListener('keydown', handleCancelExpansionKey);
        };
    }, [showForm]);

    // Pega o id do objeto selecionado
    const selectedId = selectedIds[0];
    const selectedItem = rows.find(r => r.id === selectedId);

    // Cria o link pro envio
    const editEndpoint = selectedId ? `${apiEndpoint}${selectedId}/` : apiEndpoint;

    return (
        <div>
            {/* NÃO É PERMITIDO SELECIONAR MAIS DE UM ITEM! */}
            <Dialog
                open={showWarning}
                onClose={() => setShowWarning(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: 'var(--surface-2)',
                        color: 'var(--praestitia-text)',
                        border: '1px solid var(--surface-3)'
                    }
                }}
            >
                <DialogTitle sx={{ color: 'var(--praestitia-text)' }}>Seleção Inválida</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: 'var(--muted)' }}>
                        Selecione 1 item para editar.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowWarning(false)} sx={{ color: 'var(--praestitia-primary)' }}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            {showForm && selectedItem && (
                <>
                    {isExpanded ? (
                        <div style={getModalStyle(isExpanded)}>
                            <EntityForm
                                entityType={entityType}
                                apiEndpoint={editEndpoint}
                                title={title}
                                icon={icon}
                                fields={fields}
                                initialValues={selectedItem}
                                method="PUT"
                                onSubmit={handleFormSubmit}
                                onCancel={handleFormCancel}
                                setRefresh={setRefresh}
                                isExpanded={isExpanded}
                                setIsExpanded={setIsExpanded}
                            />
                        </div>
                    ) : (
                        <Draggable handle=".handle" nodeRef={nodeRef}>
                            <div ref={nodeRef} style={getModalStyle(isExpanded)}>
                                <EntityForm
                                    entityType={entityType}
                                    apiEndpoint={editEndpoint}
                                    title={title}
                                    icon={icon}
                                    fields={fields}
                                    initialValues={selectedItem}
                                    method="PUT"
                                    onSubmit={handleFormSubmit}
                                    onCancel={handleFormCancel}
                                    setRefresh={setRefresh}
                                    isExpanded={isExpanded}
                                    setIsExpanded={setIsExpanded}
                                />
                            </div>
                        </Draggable>
                    )}
                </>
            )}
            <div className="flex flex-row">
                <button
                    onClick={handleEditClick}
                    className="flex border border-slate-700 flex-row gap-2 transition duration-100 rounded p-3 justify-center items-center bg-gray-800 text-slate-50 hover:bg-slate-700"
                >
                    <span className="text-emerald-500 text-2xl">✎</span>
                    <span>{buttonLabel}</span>
                </button>
            </div>
        </div>
    );
};

export default EditEntity;
