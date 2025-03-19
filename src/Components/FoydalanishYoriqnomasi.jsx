import React, { useEffect } from 'react';

function FoydalanishYoriqnomasi() {
    useEffect(() => {
        window.open("/templates/instructions.pdf", "_blank");
    }, []);

    return null;
}

export default FoydalanishYoriqnomasi;
