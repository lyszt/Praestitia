import { useState, useRef, useEffect } from "react";
import Draggable from 'react-draggable';
import { getModalStyle } from '../modals/modalStyles';
import EntityForm from './EntityForm';

const AddEntity = ({ entityType, buttonLabel, fields, apiEndpoint, title, icon, setRefresh }) => {
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
                            <EntityForm
                                entityType={entityType}
                                apiEndpoint={apiEndpoint}
                                title={title}
                                icon={icon}
                                fields={fields}
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
                                    apiEndpoint={apiEndpoint}
                                    title={title}
                                    icon={icon}
                                    fields={fields}
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
                    onClick={() => setShowForm(true)}
                    className="flex border flex-row gap-2 mt-5 ml-5 mb-5 transition duration-100 rounded p-3 justify-center items-center"
                    style={{
                        backgroundColor: 'var(--surface-2)',
                        borderColor: 'var(--surface-3)',
                        color: 'var(--praestitia-text)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-3)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-2)'}
                >
                    <span style={{ color: 'var(--praestitia-primary)', fontSize: '24px' }}>+</span>
                    <span>{buttonLabel}</span>
                </button>
            </div>
        </div>
    );
};

export default AddEntity;
