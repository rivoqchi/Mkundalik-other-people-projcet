import React, { useEffect } from 'react';

function FoydalanishYoriqnomasi() {
    useEffect(() => {
        window.open("/templates/instructions.pdf", "_blank");
    }, []);
    window.location.replace('/templates/instructions.pdf')

    return null;
}

export default FoydalanishYoriqnomasi;
