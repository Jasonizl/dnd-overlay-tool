interface Position {
  x: number;
  y: number;
}

interface Dimension {
  width: number;
  height: number;
}

enum Type {
  Grid = 'Grid',
  CircleAOE = 'CircleAOE',
  // for later
  // cones, rectangle,
}

interface Item {
  name: string;
  id: string;
  type: Type;
  position: Position;
  dimension: Dimension;

  interactable?: boolean;
  // color, interactions etc
}

const createNewItem = (name: string, position: Position, dimension: Dimension, type: Type, interactable = true): Item => {
  return {
    name,
    id: '3',
    dimension,
    position,
    type,
    interactable,
  };
};

const createTableRowEntry = (name: string, type: Type) => {};

const objects: Item[] = [];

objects.push(createNewItem('grid', { x: 0, y: 0 }, { width: 0, height: 0 }, Type.Grid, false));

const tableBody = document.getElementById('tableBody');

const tableRow = document.createElement('tr');
const nameTd = document.createElement('td');
const nameInput = document.createElement('input');
const typeTd = document.createElement('td');
const actionsTd = document.createElement('td');

tableRow.id = '0'; // id
tableRow.className = 'active';
nameInput.value = 'grid';

typeTd.innerText = Type.Grid;

nameTd.appendChild(nameInput);
tableRow.appendChild(nameTd);
tableRow.appendChild(typeTd);
tableRow.appendChild(actionsTd);
tableBody.appendChild(tableRow);

// rerender the list
