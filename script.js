document.addEventListener('DOMContentLoaded', () => {
    const ramos = document.querySelectorAll('.ramo');
    const approvedRamos = new Set(); // Para almacenar los IDs de los ramos aprobados

    // Elementos de la interfaz para mostrar las estadísticas
    const creditosAprobadosSpan = document.getElementById('creditos-aprobados');
    const ramosAprobadosCountSpan = document.getElementById('ramos-aprobados-count');
    const ramosRestantesCountSpan = document.getElementById('ramos-restantes-count');
    const ramosTotalCountSpan = document.getElementById('ramos-total-count');

    let totalRamos = 0;
    let totalCreditosCarrera = 0;

    // Calcular el total de ramos y créditos de la carrera una sola vez
    ramos.forEach(ramo => {
        totalRamos++;
        const creditos = parseInt(ramo.dataset.creditos);
        if (!isNaN(creditos)) {
            totalCreditosCarrera += creditos;
        }
    });
    ramosTotalCountSpan.textContent = totalRamos;

    // Carga el estado guardado de los ramos (si existe)
    loadApprovedRamos();
    // Inicializa el estado de los ramos al cargar la página y actualiza las estadísticas
    updateAllStates();

    ramos.forEach(ramo => {
        ramo.addEventListener('click', () => {
            const ramoId = ramo.id;
            console.log(`Clic en ramo: ${ramoId}`);

            if (ramo.classList.contains('aprobado')) {
                console.log(`Ramo ${ramoId} tiene la clase 'aprobado'. Intentando desaprobar.`);
                // Si el ramo ya está aprobado, desaprobamos
                unapproveRamo(ramoId);
            } else if (!ramo.classList.contains('bloqueado')) {
                console.log(`Ramo ${ramoId} no está aprobado ni bloqueado. Comprobando requisitos.`);
                // Si no está aprobado ni bloqueado, intentamos aprobar
                if (checkRequirements(ramoId)) {
                    console.log(`Requisitos de ${ramoId} cumplidos. Aprobando.`);
                    approveRamo(ramoId);
                } else {
                    console.log(`Requisitos de ${ramoId} NO cumplidos. Mostrando alerta.`);
                    alert('Debes aprobar los requisitos previos para este ramo.');
                }
            } else {
                console.log(`Ramo ${ramoId} está bloqueado.`);
            }
        });
    });

    function approveRamo(ramoId) {
        const ramoElement = document.getElementById(ramoId);
        if (ramoElement && !ramoElement.classList.contains('aprobado')) {
            ramoElement.classList.add('aprobado');
            ramoElement.classList.remove('bloqueado');
            approvedRamos.add(ramoId);
            saveApprovedRamos(); // Guarda el estado en localStorage
            updateAllStates(); // Actualiza el estado de todos los ramos y las estadísticas
        }
    }

    function unapproveRamo(ramoId) {
        const ramoElement = document.getElementById(ramoId);
        console.log(`--- Iniciando unapproveRamo para: ${ramoId} ---`);

        // Verificar si desaprobar este ramo bloqueará ramos ya aprobados que dependen de él
        if (wouldUnapprovingBlockApprovedRamos(ramoId)) {
            console.log(`Alerta: No se puede desaprobar ${ramoId} porque bloquea ramos aprobados.`);
            alert('No puedes desaprobar este ramo porque otros ramos ya aprobados dependen de él. Desaprueba primero los ramos dependientes.');
            return;
        }

        if (ramoElement && ramoElement.classList.contains('aprobado')) {
            console.log(`Desaprobando ${ramoId} y actualizando estado.`);
            ramoElement.classList.remove('aprobado');
            approvedRamos.delete(ramoId); // Elimina el ID del ramo del Set
            saveApprovedRamos(); // Guarda el estado actualizado en localStorage
            updateAllStates(); // Actualiza el estado de todos los ramos y las estadísticas
        }
        console.log(`--- Fin unapproveRamo para: ${ramoId} ---`);
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
            // Asumiendo que tus semestres tienen IDs como 'semestre-1', 'semestre-2', etc.
            const semestreElement = document.getElementById(`semestre-${i}`);
            if (semestreElement) {
                const ramosInSemestre = semestreElement.querySelectorAll('.ramo');
                for (const ramo of ramosInSemestre) {
                    if (!isRamoApproved(ramo.id)) {
                        return false; // Al menos un ramo en un semestre anterior no está aprobado
                    }
                }
            } else {
                // Si un semestre previo no existe (no tiene ID o no está en el DOM),
                // esto podría indicar un problema con la estructura del HTML
                // o que se está pidiendo un semestre que no existe.
                // Para la lógica de requisitos, si el semestre no se puede encontrar,
                // asumimos que los requisitos no se cumplen para ese semestre.
                return false;
            }
        }
        return true;
    }

    function wouldUnapprovingBlockApprovedRamos(unapprovedRamoId) {
        for (const approvedRamoId of approvedRamos) {
            if (approvedRamoId === unapprovedRamoId) continue; // No revisar el ramo que estamos intentando desaprobar

            const ramoElement = document.getElementById(approvedRamoId);
            const requisitosStr = ramoElement.dataset.requisitos;

            if (requisitosStr) {
                const requisitos = requisitosStr.split(',').map(req => req.trim());
                if (requisitos.includes(unapprovedRamoId)) {
                    return true; // Un ramo aprobado depende directamente del que queremos desaprobar
                }
            }
        }
        return false;
    }

    function updateAllStates() {
        let currentCreditosAprobados = 0;
        let currentRamosAprobados = 0;

        ramos.forEach(ramo => {
            const ramoId = ramo.id;
            const creditosRamo = parseInt(ramo.dataset.creditos);

            // Si el ramo está en el Set de aprobados, se considera aprobado
            if (approvedRamos.has(ramoId)) {
                ramo.classList.add('aprobado');
                ramo.classList.remove('bloqueado');
                currentCreditosAprobados += creditosRamo;
                currentRamosAprobados++;
            } else {
                // Si no está aprobado, verificar si debe estar bloqueado
                if (!checkRequirements(ramoId)) {
                    ramo.classList.add('bloqueado');
                    ramo.classList.remove('aprobado');
                } else {
                    // Si los requisitos se cumplen, asegurarse de que no esté ni aprobado (si fue desaprobado) ni bloqueado
                    ramo.classList.remove('bloqueado');
                    ramo.classList.remove('aprobado'); // Asegurarse de que no tenga la clase aprobado si fue desaprobado
                }
            }
        });

        // Actualizar los textos de las estadísticas
        creditosAprobadosSpan.textContent = currentCreditosAprobados;
        ramosAprobadosCountSpan.textContent = currentRamosAprobados;
        ramosRestantesCountSpan.textContent = totalRamos - currentRamosAprobados;
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
