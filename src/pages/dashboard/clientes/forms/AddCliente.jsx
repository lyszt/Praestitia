import { useState, useRef, useEffect } from "react";
import Draggable from 'react-draggable';
import { getModalStyle } from '../../../../components/modals/modalStyles';
import ClienteForm from './ClienteForm';
import AddCircle from '@mui/icons-material/AddCircle';

const AddCliente = ({ setClienteRefresh }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const nodeRef = useRef(null);

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

    return (
        <div>
            {showForm && (
                <>
                    {isExpanded ? (
                        <div style={getModalStyle(isExpanded)}>
                            <ClienteForm
                                onSubmit={handleFormSubmit}
                                onCancel={handleFormCancel}
                                setClienteRefresh={setClienteRefresh}
                                isExpanded={isExpanded}
                                setIsExpanded={setIsExpanded}
                            />
                        </div>
                    ) : (
                        <Draggable handle=".handle" nodeRef={nodeRef}>
                            <div ref={nodeRef} style={getModalStyle(isExpanded)}>
                                <ClienteForm
                                    onSubmit={handleFormSubmit}
                                    onCancel={handleFormCancel}
                                    setClienteRefresh={setClienteRefresh}
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
                    onClick={() => setShowForm(true)}
                    className="flex bg-slate-800 border-slate-700 border flex-row gap-2 mt-5 ml-5 mb-5 transition duration-100 hover:bg-slate-700 rounded active:bg-slate-600 p-3 justify-center items-center"
                >
                    <AddCircle sx={{ color: '#10B981' }} />
                    <span className="text-slate-100">Adicionar Cliente</span>
                </button>
            </div>
        </div>
    );
};

export default AddCliente;
