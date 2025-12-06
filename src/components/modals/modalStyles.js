// Retorna estilos CSS para modal baseado no estado de expansão
export const getModalStyle = (isExpanded) => {
    // Modal expandido: ocupa tela inteira (fullscreen)
    if (isExpanded) {
        return {
            position: 'fixed',
            zIndex: 9999,
            width: '100vw',
            height: '100vh',
            left: 0,
            top: 0,
            transform: 'none'
        };
    }
    // Modal normal: centralizado com largura fixa de 500px
    return {
        position: 'fixed',
        zIndex: 9999,
        width: '90%',
        maxWidth: '500px',
        left: '50%',
        top: '5%',
        transform: 'translateX(-50%)',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column'
    };
};
