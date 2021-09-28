const url =
  "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";

// Tabla de los eventos ocurridos por día.
let table = document.getElementById("tableEve");

// Tabla de las correlaciones de los eventos.
let table2 = document.getElementById("tableCor");

async function loadEvents() {
  const response = await fetch(url);
  const data = await response.json();

  // Arreglo donde se guardarán los eventos registrados
  let arregloEventos = [];

  /*
  Arreglo donde se guardarán las veces que un evento tiene un fp, fn, tp, tn.
  Esto se hará con una estructura así: [[E1-tn, E1-fn, E1-fp, E1-tp], ...].
  */
  let arregloContador = [];

  // Arreglo donde se guardarán los valores de las correlaciones para cada evento.
  let arregloCor = [];

  /* 
  Primer loop, este se encarga de llenar la primera tabla con los valores que se trajeron del 
  fetch y de registrar los eventos en el arregloEventos y de hacer un esqueleto en arregloContador.
  */
  for (let i = 0; i < data.length; i++) {
    // Llenar tabla.
    let row = table.insertRow(-1);

    const squirrel = await data[i].squirrel;

    if (squirrel) {
      row.style.backgroundColor = "red";
    }

    let cellId = row.insertCell(-1);
    cellId.innerHTML = i + 1;
    let cellEve = row.insertCell(-1);
    const eventos = data[i].events;
    cellEve.innerHTML = eventos;
    let cellSqr = row.insertCell(-1);
    cellSqr.innerHTML = squirrel;

    // Guardar eventos y esqueleto arregloContador.
    for (let j = 0; j < eventos.length; j++) {
      let element = eventos[j];
      if (!arregloEventos.includes(element)) {
        arregloEventos.push(element);
        arregloContador.push([0, 0, 0, 0]);
      }
    }
  }

  /* 
  Segundo loop, este se encarga de llenar el arreglo arregloContador.
  */
  for (let i = 0; i < data.length; i++) {
    const squirrel = await data[i].squirrel;
    const eventos = data[i].events;

    // Copiamos el arreglo de eventos.
    let arregloEventosCopia = copiarArreglo(arregloEventos);

    /* 
    Registramos que el evento pasó ese día eliminándolo del arreglo copia y registramos si fue 
    un tp o un fn.
    */
    for (let j = 0; j < eventos.length; j++) {
      eventIndex = arregloEventos.indexOf(eventos[j]);
      if (squirrel) {
        arregloContador[eventIndex][3] += 1;
      } else {
        arregloContador[eventIndex][1] += 1;
      }
      arregloEventosCopia.splice(arregloEventosCopia.indexOf(eventos[j]), 1);
    }

    /* 
    Registramos si los eventos que faltaron en el día son un fp o tn.
    */
    for (let j = 0; j < arregloEventosCopia.length; j++) {
      eventIndex = arregloEventos.indexOf(arregloEventosCopia[j]);
      if (squirrel) {
        arregloContador[eventIndex][2] += 1;
      } else {
        arregloContador[eventIndex][0] += 1;
      }
    }
  }

  /* 
  Tercer loop, este se encarga de llenar el arreglo arregloCor y de llenar la segunda tabla.
  */

  for (let i = 0; i < arregloEventos.length; i++) {
    // Cálculo arregloCor.
    const tp = arregloContador[i][3];
    const tn = arregloContador[i][0];
    const fp = arregloContador[i][2];
    const fn = arregloContador[i][1];
    const mcc =
      (tp * tn - fp * fn) /
      Math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn));

    // Llenar segunda tabla.
    let row = table2.insertRow(-1);
    let cellId = row.insertCell(-1);
    cellId.innerHTML = i + 1;
    let cellEve = row.insertCell(-1);
    cellEve.innerHTML = arregloEventos[i];
    let cellCor = row.insertCell(-1);
    cellCor.innerHTML = mcc;
  }
}

// Método para copiar arreglos.
function copiarArreglo(arreglo) {
  let nuevoArreglo = [];
  let i = 0;
  while (i < arreglo.length) {
    nuevoArreglo[i] = arreglo[i];
    i++;
  }
  return nuevoArreglo;
}

// Ejecución del script.
loadEvents();
