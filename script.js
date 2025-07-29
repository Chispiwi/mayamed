document.addEventListener('DOMContentLoaded', () => {
    const ramos = document.querySelectorAll('.ramo');
    const approvedRamos = new Set(); // Para almacenar los IDs de los ramos aprobados

    // Carga el estado guardado de los ramos (si existe)
    loadApprovedRamos();
    // Inicializa el estado de los ramos al cargar la página
    updateRamoStates();

    ramos.forEach(ramo => {
        ramo.addEventListener('click', () => {
            const ramoId = ramo.id;

            // Solo permite aprobar si no está ya aprobado o bloqueado
            if (!ramo.classList.contains('aprobado') && !ramo.classList.contains('bloqueado')) {
                // Verificar requisitos antes de aprobar
                if (checkRequirements(ramoId)) {
                    approveRamo(ramoId);
                } else {
                    alert('Debes aprobar los requisitos previos para este ramo.');
                }
            }
        });
    });

    function approveRamo(ramoId) {
        const ramoElement = document.getElementById(ramoId);
        if (ramoElement && !ramoElement.classList.contains('aprobado')) {
            ramoElement.classList.add('aprobado');
            ramoElement.classList.remove('bloqueado');
            approvedRamos.add(ramoId);
            saveApprovedRamos(); // Guarda el estado
            updateRamoStates(); // Actualiza el estado de todos los ramos
        }
    }

    function isRamoApproved(ramoId) {
        return approvedRamos.has(ramoId);
    }

    function checkRequirements(ramoId) {
        const ramoElement = document.getElementById(ramoId);
        const requisitosStr = ramoElement.dataset.requisitos;

        if (!requisitosStr) {
            return true; // No tiene requisitos
        }

        const requisitos = requisitosStr.split(',').map(req => req.trim());

        // Manejar requisitos especiales como "X_PRIM_SEM_APROBADOS"
        for (const req of requisitos) {
            if (req.endsWith('_PRIM_SEM_APROBADOS')) {
                const numSemestres = parseInt(req.split('_')[0]);
                if (!checkPreviousSemestersApproved(numSemestres)) {
                    return false;
                }
            } else if (!isRamoApproved(req)) {
                return false; // Requisito no aprobado
            }
        }
        return true;
    }

    function checkPreviousSemestersApproved(numSemestres) {
        for (let i = 1; i <= numSemestres; i++) {
            const semestreElement = document.getElementById(`semestre-${i}`);
            if (semestreElement) {
                const ramosInSemestre = semestreElement.querySelectorAll('.ramo');
                for (const ramo of ramosInSemestre) {
                    if (!isRamoApproved(ramo.id)) {
                        return false; // Al menos un ramo en un semestre anterior no está aprobado
                    }
                }
            }
        }
        return true;
    }

    function updateRamoStates() {
        ramos.forEach(ramo => {
            const ramoId = ramo.id;

            // Si ya está aprobado, mantener ese estado
            if (isRamoApproved(ramoId)) {
                ramo.classList.add('aprobado');
                ramo.classList.remove('bloqueado');
                return; // No hacer más verificaciones para ramos ya aprobados
            }

            // Si no está aprobado, verificar si debe estar bloqueado
            if (!checkRequirements(ramoId)) {
                ramo.classList.add('bloqueado');
                ramo.classList.remove('aprobado');
            } else {
                // Si los requisitos se cumplen, asegurarse de que no esté bloqueado
                ramo.classList.remove('bloqueado');
            }
        });
    }

    function saveApprovedRamos() {
        localStorage.setItem('approvedRamosValdivia', JSON.stringify(Array.from(approvedRamos)));
    }

    function loadApprovedRamos() {
        const savedRamos = localStorage.getItem('approvedRamosValdivia');
        if (savedRamos) {
            const parsedRamos = JSON.parse(savedRamos);
            parsedRamos.forEach(ramoId => approvedRamos.add(ramoId));
        }
    }
});
