const ramos = [
  // Ciclo Básico - Solo algunos de ejemplo
  {
    id: "QUIM020",
    nombre: "Biología Humana I",
    creditos: 12,
    requisitos: [],
    semestre: 1
  },
  {
    id: "ESME001",
    nombre: "Intro a los Estudios Médicos",
    creditos: 4,
    requisitos: [],
    semestre: 1
  },
  {
    id: "ESME115",
    nombre: "Biología Humana II",
    creditos: 24,
    requisitos: ["QUIM020", "ESME001"],
    semestre: 2
  },
  {
    id: "ESME125",
    nombre: "Biología Humana III",
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
  // Agrega todos los ramos aquí...
];

const estadoRamos = {}; // Guarda los ramos aprobados

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
