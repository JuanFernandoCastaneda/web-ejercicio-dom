const url =
  "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";

let table = document.getElementById("tableEve");
let table2 = document.getElementById("tableCor");

async function loadEvents() {
  const response = await fetch(url);
  const data = await response.json();

  let arregloEventos = [];
  let arregloContador = [];

  for (let i = 0; i < data.length; i++) {
    let row = table.insertRow(-1);

    const squirrel = await data[i].squirrel;

    if (squirrel) {
      row.style.backgroundColor = "red";
    }

    let cellId = row.insertCell(-1);
    cellId.innerHTML = i+1;
    let cellEve = row.insertCell(-1);
    const eventos = data[i].events;
    cellEve.innerHTML = eventos;
    let cellSqr = row.insertCell(-1);
    cellSqr.innerHTML = squirrel;

    for(let j = 0; j < eventos.length; j++) {
      let element = eventos[j];
      if(!arregloEventos.includes(element)) {
        arregloEventos.push(element);
        arregloContador.push([0, 0, 0, 0]);
      }
    }
  }

  for (let i = 0; i < data.length; i++) {
    const squirrel = await data[i].squirrel;
    const eventos = data[i].events;
    
    let arregloEventosCopia = copiarArreglo(arregloEventos);

    for(let j = 0; j < eventos.length; j++) {
      eventIndex = arregloEventos.indexOf(eventos[j]);
      if(squirrel) {
        arregloContador[eventIndex][3] += 1;
      } 
      else {
        arregloContador[eventIndex][1] += 1;
      }
      arregloEventosCopia.splice(arregloEventosCopia.indexOf(eventos[j]), 1);
    }

    for(let j = 0; j < arregloEventosCopia.length; j++) {
      eventIndex = arregloEventos.indexOf(arregloEventosCopia[j]);
      if(squirrel) {
        arregloContador[eventIndex][2] += 1;
      } 
      else {
        arregloContador[eventIndex][0] += 1;
      }
    }
  }

  let arregloCor = [];

  for(let i = 0; i < arregloEventos.length; i++) {
    const tp = arregloContador[i][3];
    const tn = arregloContador[i][0];
    const fp = arregloContador[i][2];
    const fn = arregloContador[i][1];
    const mcc = (tp*tn - fp*fn)/Math.sqrt((tp+fp)*(tp+fn)*(tn+fp)*(tn+fn));

    let row = table2.insertRow(-1);
    let cellId = row.insertCell(-1);
    cellId.innerHTML = i+1;
    let cellEve = row.insertCell(-1);
    cellEve.innerHTML = arregloEventos[i];
    let cellCor = row.insertCell(-1);
    cellCor.innerHTML = mcc;
  }
}

function copiarArreglo(arreglo) {
  let nuevoArreglo = [];
  let i = 0;
  while(i < arreglo.length) {
    nuevoArreglo[i] = arreglo[i]
    i++;
  }
  return nuevoArreglo;
}

loadEvents();
