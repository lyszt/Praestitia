import { useState } from "react";
import { authenticatedFetch } from "../../utils/api";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import InputMask from 'react-input-mask';

const EntityForm = ({
    entityType,
    apiEndpoint,
    title,
    icon: Icon,
    fields,
    onCancel,
    onSubmit,
    setRefresh,
    isExpanded,
    setIsExpanded
}) => {
    const handleToggleExpand = () => {
        if (setIsExpanded) {
            setIsExpanded(!isExpanded);
        }
    };

    // Initialize state for all fields
    const [formData, setFormData] = useState(() => {
        const initialState = {};
        fields.forEach(field => {
            initialState[field.name] = field.defaultValue || '';
        });
        return initialState;
    });

    const [error, setError] = useState(null);

    const handleChange = (fieldName, value) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        // Build payload with only defined values
        const payload = {};
        fields.forEach(field => {
            const value = formData[field.name];
            if (field.required || value) {
                if (field.type === 'number') {
                    payload[field.name] = parseInt(value) || field.defaultValue || 0;
                } else {
                    payload[field.name] = value || undefined;
                }
            }
        });

        try {
            const response = await authenticatedFetch(apiEndpoint, {
                method: "POST",
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                if (setRefresh) setRefresh((prev) => prev + 1);
                onSubmit?.();
            } else {
                const data = await response.json();
                setError(data.message || `Falha ao adicionar ${entityType}`);
            }
        } catch (err) {
            setError(`Erro ao adicionar ${entityType}: ${err.message}`);
        }
    }

    const renderField = (field) => {
        const value = formData[field.name];

        // Phone field with mask
        if (field.mask) {
            return (
                <InputMask
                    key={field.name}
                    mask={field.mask}
                    value={value}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                >
                    {(inputProps) => (
                        <TextField
                            {...inputProps}
                            label={field.label}
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            placeholder={field.placeholder}
                            helperText={field.helperText}
                            required={field.required}
                            size={field.size || 'medium'}
                        />
                    )}
                </InputMask>
            );
        }

        // Autocomplete field
        if (field.type === 'select') {
            return (
                <Autocomplete
                    key={field.name}
                    value={field.options.find(opt => opt.value === value)}
                    onChange={(_event, newValue) => handleChange(field.name, newValue?.value || field.defaultValue)}
                    options={field.options}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={field.label}
                            required={field.required}
                            helperText={field.helperText}
                            size={field.size || 'medium'}
                        />
                    )}
                    slotProps={{ popper: { style: { zIndex: 20000 } } }}
                />
            );
        }

        // Regular text field
        return (
            <TextField
                key={field.name}
                label={field.label}
                variant="outlined"
                color="secondary"
                type={field.type || 'text'}
                value={value}
                onChange={(e) => handleChange(field.name, e.target.value)}
                fullWidth
                required={field.required}
                placeholder={field.placeholder}
                helperText={field.helperText}
                multiline={field.multiline}
                rows={field.rows}
                size={field.size || 'medium'}
            />
        );
    };

    const basicFields = fields.filter(f => !f.expanded);
    const expandedFields = fields.filter(f => f.expanded);

    return (
        <form onSubmit={handleSubmit} className="w-full z-9999 flex flex-col shadow-2xl rounded-lg h-full" style={{ backgroundColor: 'var(--surface-3)', color: 'var(--praestitia-text)' }}>
            <div className={`p-4 rounded-t-lg flex items-center justify-between sticky top-0 z-50 flex-shrink-0 ${!isExpanded ? 'handle cursor-move' : ''}`} style={{ backgroundColor: 'var(--surface-2)' }}>
                <div className="flex items-center gap-2">
                    <DragIndicatorIcon sx={{ color: 'var(--praestitia-primary)' }} />
                    <h2 className="text-lg font-semibold" style={{ color: 'var(--praestitia-text)' }}>{title}</h2>
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

                {/* Basic fields */}
                {basicFields.map(renderField)}

                {/* Expand button */}
                {expandedFields.length > 0 && (
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
                )}

                {/* Expanded fields */}
                {isExpanded && expandedFields.length > 0 && (
                    <>
                        <Divider sx={{ mt: 2 }} />
                        <Typography variant="subtitle1" color="secondary" sx={{ mt: 1, fontWeight: 'bold' }}>
                            Informações Adicionais
                        </Typography>

                        {expandedFields.map(renderField)}
                    </>
                )}

                <Divider sx={{ mt: 2 }} />

                <Button
                    startIcon={Icon && <Icon />}
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ mt: 1 }}
                >
                    {title}
                </Button>
            </Box>
        </form>
    );
};

export default EntityForm;
