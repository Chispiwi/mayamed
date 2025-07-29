const ramos = [
  // SOLO ALGUNOS EJEMPLOS — aquí debes pegar la lista completa de ramos desde el script que ya generamos
  {
    id: "QUIM020",
    nombre: "Biología Humana I: Bases Biofísicas y Moleculares",
    creditos: 12,
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
    id: "ESME115",
    nombre: "Biología Humana II: Bases Estructurales y Funcionales",
    creditos: 24,
    requisitos: ["QUIM020", "ESME001"],
    semestre: 2
  }
  // Aquí irían los demás ramos (por motivos de espacio, solo se incluyen algunos en este ejemplo)
];

const estadoRamos = {};

function guardarEstado() {
  localStorage.setItem("ramosAprobados", JSON.stringify(estadoRamos));
}

function cargarEstado() {
  const datos = localStorage.getItem("ramosAprobados");
  if (datos) {
    Object.assign(estadoRamos, JSON.parse(datos));
  }
}

function crearRamo(ramo) {
  const div = document.createElement("div");
  div.classList.add("ramo");

  const requisitosCumplidos = ramo.requisitos.every(req => estadoRamos[req]);
  if (ramo.requisitos.length && !requisitosCumplidos) {
    div.classList.add("bloqueado");
  }

  div.dataset.id = ramo.id;
  div.innerHTML = `
    <div class="nombre">${ramo.nombre}</div>
    <div class="creditos">${ramo.creditos} créditos</div>
  `;

  if (!div.classList.contains("bloqueado")) {
    div.addEventListener("click", () => {
      if (div.classList.contains("aprobado")) {
        div.classList.remove("aprobado");
        delete estadoRamos[ramo.id];
      } else {
        div.classList.add("aprobado");
        estadoRamos[ramo.id] = true;
      }
      actualizarRamos();
      guardarEstado();
    });
  }

  if (estadoRamos[ramo.id]) {
    div.classList.add("aprobado");
  }

  return div;
}

function actualizarRamos() {
  const grid = document.getElementById("malla");
  grid.innerHTML = "";

  ramos.forEach((ramo) => {
    const div = crearRamo(ramo);
    grid.appendChild(div);
  });
}

cargarEstado();
actualizarRamos();
