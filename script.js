const ramos = [
  // SEMESTRE I
  {
    id: "CIDI080",
    nombre: "Inglés para la Salud I",
    creditos: 4,
    requisitos: [],
    semestre: 1
  },
  {
    id: "DYRE060",
    nombre: "Educación Física y Salud",
    creditos: 4,
    requisitos: [],
    semestre: 1
  },
  {
    id: "ESME001",
    nombre: "Introducción a los Estudios Médicos y Primeros Auxilios",
    creditos: 4,
    requisitos: [],
    semestre: 1
  },
  {
    id: "QUIM020",
    nombre: "Biología Humana I: Bases Biofísicas y Moleculares",
    creditos: 12,
    requisitos: [],
    semestre: 1
  },

  // SEMESTRE II
  {
    id: "ESME115",
    nombre: "Biología Humana II: Bases Estructurales y Funcionales",
    creditos: 24,
    requisitos: ["QUIM020", "ESME001"],
    semestre: 2
  },

  // SEMESTRE III
  {
    id: "ESME125",
    nombre: "Biología Humana III: Bioquímica, Inmunología y Farmacología",
    creditos: 18,
    requisitos: ["ESME115"],
    semestre: 3
  },
  {
    id: "ESME240",
    nombre: "Neurociencias",
    creditos: 8,
    requisitos: ["ESME115"],
    semestre: 3
  },
  {
    id: "PEDI130",
    nombre: "Haciendo Salud",
    creditos: 2,
    requisitos: [],
    semestre: 3
  },
  {
    id: "PSIQ134",
    nombre: "Psicoantropología Médica",
    creditos: 2,
    requisitos: [],
    semestre: 3
  },
  {
    id: "SALP132",
    nombre: "Introducción a la Salud Pública",
    creditos: 4,
    requisitos: [],
    semestre: 3
  },

  // SEMESTRE IV
  {
    id: "ESME120",
    nombre: "Agresión y Respuesta",
    creditos: 9,
    requisitos: ["ESME125"],
    semestre: 4
  },
  {
    id: "ESME140",
    nombre: "Fisiopatología de Sistemas Integrados I: Endocrino, Reproductor, Locomotor, Digestivo",
    creditos: 11,
    requisitos: ["ESME125"],
    semestre: 4
  },
  {
    id: "SALP142",
    nombre: "Salud Pública Aplicada",
    creditos: 4,
    requisitos: ["SALP132"],
    semestre: 4
  },

  // SEMESTRE V
  {
    id: "ESME133",
    nombre: "Respuesta Orgánica Multisistémica",
    creditos: 3,
    requisitos: ["ESME240", "ESME120", "ESME140"],
    semestre: 5
  },
  {
    id: "ESME155",
    nombre: "Fisiopatología de Sistemas Integrados II: Renal, Respiratorio, Cardiovascular",
    creditos: 17,
    requisitos: ["ESME240", "ESME120", "ESME140"],
    semestre: 5
  },
  {
    id: "HIPA121",
    nombre: "Patología Molecular",
    creditos: 5,
    requisitos: ["ESME125"],
    semestre: 5
  },
  {
    id: "MEDI155",
    nombre: "Semiología Médica Integrada",
    creditos: 5,
    requisitos: [], // Dice “4 primeros semestres aprobados”, se puede modelar como desbloqueo manual o verificar más adelante
    semestre: 5
  },
  {
    id: "PSIQ135",
    nombre: "Bioética I",
    creditos: 2,
    requisitos: [],
    semestre: 5
  },
  {
    id: "SALP192",
    nombre: "Investigación Epidemiológica Aplicada",
    creditos: 3,
    requisitos: ["SALP142"],
    semestre: 5
  }
];

// Estado de aprobación y funciones (igual que antes)...

// Código para crear los cuadros y desbloquear:
const estadoRamos = {};

function crearRamo(ramo) {
  const div = document.createElement("div");
  div.classList.add("ramo");

  if (!ramo.requisitos.length) {
    div.classList.add("desbloqueado");
  } else {
    div.classList.add("bloqueado");
  }

  div.dataset.id = ramo.id;
  div.innerHTML = `
    <div class="nombre">${ramo.nombre}</div>
    <div class="creditos">${ramo.creditos} créditos</div>
  `;

  div.addEventListener("click", () => {
    if (div.classList.contains("bloqueado")) return;

    if (!div.classList.contains("aprobado")) {
      div.classList.add("aprobado");
      estadoRamos[ramo.id] = true;
    } else {
      div.classList.remove("aprobado");
      delete estadoRamos[ramo.id];
    }

    actualizarRamos();
  });

  return div;
}

function actualizarRamos() {
  const grid = document.getElementById("malla");
  grid.innerHTML = "";

  ramos.forEach((ramo) => {
    const div = crearRamo(ramo);

    const requisitosCumplidos = ramo.requisitos.every(req => estadoRamos[req]);

    if (ramo.requisitos.length && requisitosCumplidos) {
      div.classList.remove("bloqueado");
    } else if (ramo.requisitos.length) {
      div.classList.add("bloqueado");
    }

    grid.appendChild(div);
  });
}

actualizarRamos();

// SEMESTRE VI
{
  id: "MEDI234",
  nombre: "Clínica Médica I",
  creditos: 24,
  requisitos: ["HIPA121", "MEDI155", "ESME133", "ESME155"],
  semestre: 6
},
{
  id: "SALP172",
  nombre: "Medicina Familiar y Comunitaria",
  creditos: 2,
  requisitos: ["SALP192"],
  semestre: 6
},

// SEMESTRE VII
{
  id: "ESPE277",
  nombre: "Oftalmología",
  creditos: 3,
  requisitos: ["MEDI234"],
  semestre: 7
},
{
  id: "ESPE278",
  nombre: "Otorrinolaringología",
  creditos: 3,
  requisitos: ["MEDI234"],
  semestre: 7
},
{
  id: "MEDI242",
  nombre: "Clínica Médica II",
  creditos: 22,
  requisitos: ["MEDI234"],
  semestre: 7
},

// SEMESTRE VIII
{
  id: "CIRU263",
  nombre: "Cirugía General y de Urgencia",
  creditos: 17,
  requisitos: ["MEDI242"],
  semestre: 8
},
{
  id: "DPUB172",
  nombre: "Antropología Jurídico Penal",
  creditos: 2,
  requisitos: [],
  semestre: 8
},
{
  id: "NEUR271",
  nombre: "Neurología y Neurocirugía",
  creditos: 6,
  requisitos: ["MEDI242"],
  semestre: 8
},
{
  id: "PSIQ235",
  nombre: "Bioética II",
  creditos: 2,
  requisitos: ["PSIQ135"],
  semestre: 8
},
{
  id: "SALP242",
  nombre: "Políticas y Gestión de Servicios de Salud",
  creditos: 2,
  requisitos: ["SALP172"],
  semestre: 8
},

// SEMESTRE IX
{
  id: "APLO249",
  nombre: "Patología del Aparato Locomotor",
  creditos: 5,
  requisitos: ["NEUR271", "CIRU263"],
  semestre: 9
},
{
  id: "ESPE280",
  nombre: "Dermatología",
  creditos: 3,
  requisitos: ["MEDI242"],
  semestre: 9
},
{
  id: "PEDI259",
  nombre: "Cirugía Infantil",
  creditos: 4,
  requisitos: ["NEUR271", "CIRU263"],
  semestre: 9
},
{
  id: "PEDI261",
  nombre: "Pediatría",
  creditos: 18,
  requisitos: ["NEUR271", "CIRU263"],
  semestre: 9
},
{
  id: "PSIQ245",
  nombre: "Bioética III",
  creditos: 2,
  requisitos: ["PSIQ235"],
  semestre: 9
},
{
  id: "PSIQ263",
  nombre: "Psicopatología y Psiquiatría I",
  creditos: 6,
  requisitos: ["MEDI242", "NEUR271"],
  semestre: 9
},

// SEMESTRE X
{
  id: "ESME250",
  nombre: "Introducción al Internado",
  creditos: 4,
  requisitos: [],
  semestre: 10
},
{
  id: "ESPE248",
  nombre: "Medicina Legal",
  creditos: 3,
  requisitos: ["MEDI242"],
  semestre: 10
},
{
  id: "ESPE250",
  nombre: "Urología",
  creditos: 2,
  requisitos: ["CIRU263"],
  semestre: 10
},
{
  id: "OBGI268",
  nombre: "Obstetricia y Ginecología",
  creditos: 23,
  requisitos: ["MEDI242"],
  semestre: 10
},
{
  id: "PSIQ264",
  nombre: "Psicopatología y Psiquiatría II",
  creditos: 6,
  requisitos: ["PSIQ263"],
  semestre: 10
}

// SEMESTRE VI
{
  id: "MEDI234",
  nombre: "Clínica Médica I",
  creditos: 24,
  requisitos: ["HIPA121", "MEDI155", "ESME133", "ESME155"],
  semestre: 6
},
{
  id: "SALP172",
  nombre: "Medicina Familiar y Comunitaria",
  creditos: 2,
  requisitos: ["SALP192"],
  semestre: 6
},

// SEMESTRE VII
{
  id: "ESPE277",
  nombre: "Oftalmología",
  creditos: 3,
  requisitos: ["MEDI234"],
  semestre: 7
},
{
  id: "ESPE278",
  nombre: "Otorrinolaringología",
  creditos: 3,
  requisitos: ["MEDI234"],
  semestre: 7
},
{
  id: "MEDI242",
  nombre: "Clínica Médica II",
  creditos: 22,
  requisitos: ["MEDI234"],
  semestre: 7
},

// SEMESTRE VIII
{
  id: "CIRU263",
  nombre: "Cirugía General y de Urgencia",
  creditos: 17,
  requisitos: ["MEDI242"],
  semestre: 8
},
{
  id: "DPUB172",
  nombre: "Antropología Jurídico Penal",
  creditos: 2,
  requisitos: [],
  semestre: 8
},
{
  id: "NEUR271",
  nombre: "Neurología y Neurocirugía",
  creditos: 6,
  requisitos: ["MEDI242"],
  semestre: 8
},
{
  id: "PSIQ235",
  nombre: "Bioética II",
  creditos: 2,
  requisitos: ["PSIQ135"],
  semestre: 8
},
{
  id: "SALP242",
  nombre: "Políticas y Gestión de Servicios de Salud",
  creditos: 2,
  requisitos: ["SALP172"],
  semestre: 8
},

// SEMESTRE IX
{
  id: "APLO249",
  nombre: "Patología del Aparato Locomotor",
  creditos: 5,
  requisitos: ["NEUR271", "CIRU263"],
  semestre: 9
},
{
  id: "ESPE280",
  nombre: "Dermatología",
  creditos: 3,
  requisitos: ["MEDI242"],
  semestre: 9
},
{
  id: "PEDI259",
  nombre: "Cirugía Infantil",
  creditos: 4,
  requisitos: ["NEUR271", "CIRU263"],
  semestre: 9
},
{
  id: "PEDI261",
  nombre: "Pediatría",
  creditos: 18,
  requisitos: ["NEUR271", "CIRU263"],
  semestre: 9
},
{
  id: "PSIQ245",
  nombre: "Bioética III",
  creditos: 2,
  requisitos: ["PSIQ235"],
  semestre: 9
},
{
  id: "PSIQ263",
  nombre: "Psicopatología y Psiquiatría I",
  creditos: 6,
  requisitos: ["MEDI242", "NEUR271"],
  semestre: 9
},

// SEMESTRE X
{
  id: "ESME250",
  nombre: "Introducción al Internado",
  creditos: 4,
  requisitos: [],
  semestre: 10
},
{
  id: "ESPE248",
  nombre: "Medicina Legal",
  creditos: 3,
  requisitos: ["MEDI242"],
  semestre: 10
},
{
  id: "ESPE250",
  nombre: "Urología",
  creditos: 2,
  requisitos: ["CIRU263"],
  semestre: 10
},
{
  id: "OBGI268",
  nombre: "Obstetricia y Ginecología",
  creditos: 23,
  requisitos: ["MEDI242"],
  semestre: 10
},
{
  id: "PSIQ264",
  nombre: "Psicopatología y Psiquiatría II",
  creditos: 6,
  requisitos: ["PSIQ263"],
  semestre: 10
}

// SEMESTRE XI
{
  id: "APLO295",
  nombre: "Internado de Ortopedia y Traumatología",
  creditos: 18,
  requisitos: [],
  semestre: 11
},
{
  id: "CIRU296",
  nombre: "Internado de Cirugía",
  creditos: 32,
  requisitos: [],
  semestre: 11
},
{
  id: "ESME299",
  nombre: "Internado de Atención Primaria y Administración en Salud",
  creditos: 21,
  requisitos: [],
  semestre: 11
},
{
  id: "ESPE266",
  nombre: "Internado de Urología",
  creditos: 14,
  requisitos: [],
  semestre: 11
},
{
  id: "PREG293",
  nombre: "Pregrado Cirugía",
  creditos: 2,
  requisitos: [],
  semestre: 11
},

// SEMESTRE XII
{
  id: "ESPE251",
  nombre: "Internado de Anestesia",
  creditos: 18,
  requisitos: [],
  semestre: 12
},
{
  id: "ESPE257",
  nombre: "Internado de Oftalmología",
  creditos: 14,
  requisitos: [],
  semestre: 12
},
{
  id: "ESPE265",
  nombre: "Internado de Otorrinolaringología",
  creditos: 15,
  requisitos: [],
  semestre: 12
},
{
  id: "ESPE270",
  nombre: "Internado de Oncología y Cuidados Paliativos",
  creditos: 14,
  requisitos: [],
  semestre: 12
},
{
  id: "ESPE281",
  nombre: "Internado de Dermatología",
  creditos: 14,
  requisitos: [],
  semestre: 12
},
{
  id: "OBGI294",
  nombre: "Internado de Obstetricia y Ginecología",
  creditos: 32,
  requisitos: [],
  semestre: 12
},
{
  id: "PREG294",
  nombre: "Pregrado Obstetricia y Ginecología",
  creditos: 2,
  requisitos: [],
  semestre: 12
},

// SEMESTRE XIII
{
  id: "MEDI296",
  nombre: "Internado de Medicina Interna",
  creditos: 49,
  requisitos: [],
  semestre: 13
},
{
  id: "NEUR291",
  nombre: "Internado de Neurología y Neurocirugía",
  creditos: 20,
  requisitos: [],
  semestre: 13
},
{
  id: "PREG296",
  nombre: "Pregrado Medicina Interna",
  creditos: 2,
  requisitos: [],
  semestre: 13
},

// SEMESTRE XIV
{
  id: "ELECT01",
  nombre: "Optativo 1",
  creditos: 13,
  requisitos: [],
  semestre: 14
},
{
  id: "PEDI294",
  nombre: "Internado de Pediatría",
  creditos: 42,
  requisitos: [],
  semestre: 14
},
{
  id: "PREG292",
  nombre: "Pregrado Pediatría",
  creditos: 2,
  requisitos: [],
  semestre: 14
},
{
  id: "PSIQ270",
  nombre: "Internado de Psiquiatría",
  creditos: 20,
  requisitos: [],
  semestre: 14
}
