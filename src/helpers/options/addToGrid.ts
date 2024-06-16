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
  RectangleAOE = "RectangleAOE",
  CircleImage = "CircleImage",
  RectangleImage = "RectangleImage",
  // for later
  // cones, rectangle,
}

interface Item {
  name: string;
  id: number;
  type: Type;
  position?: Position;
  dimension?: Dimension;
  color?: string;
  imageSrcUrl?: string;

  // color, interactions etc
}

// https://stackoverflow.com/a/1484514/22217480
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


const createNewItem = (item: Item): Item => {
  const { name, id, dimension, position, type, imageSrcUrl } = item;

  return {
    name,
    id,
    dimension,
    position,
    type,
    color: getRandomColor(),
    imageSrcUrl
  };
};

/* END REDECLARATION OF TYPES AND HELPER FUNCTIONS */

const addNewCircleButton = document.getElementById('newCircleButton');
const addNewRectangleButton = document.getElementById('newRectangleButton');

const addNewImageCircleInput = document.getElementById('newImageCircle') as HTMLInputElement;
const addNewImageRectangleInput = document.getElementById('newImageRectangle') as HTMLInputElement;

addNewCircleButton.addEventListener('click', () => {
  const tableBody = document.getElementById('tableBody');

  const newItem = createNewItem({ name: 'Circle AOE', id: tableBody.children.length, type: Type.CircleAOE });
  addElementToTable(newItem.id, newItem.name, newItem.type, newItem.color);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.electron.addGridElement(newItem);
});

addNewRectangleButton.addEventListener('click', () => {
  const tableBody = document.getElementById('tableBody');

  const newItem = createNewItem({ name: 'Rectangle AOE', id: tableBody.children.length, type: Type.RectangleAOE });
  addElementToTable(newItem.id, newItem.name, newItem.type, newItem.color);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.electron.addGridElement(newItem);
});


// event handler for adding images, can handle multiple
addNewImageCircleInput.addEventListener('change', () => {
  const currentFiles = addNewImageCircleInput.files;

  if (currentFiles.length === 0) {
    return
  }

  for (const file of Array.from(currentFiles)) {
    const tableBody = document.getElementById('tableBody');
    const imageSrc = URL.createObjectURL(file);

    const newItem = createNewItem({ name: file.name.split('.')[0], id: tableBody.children.length, type: Type.CircleImage, imageSrcUrl: imageSrc });
    addElementToTable(newItem.id, newItem.name, newItem.type, newItem.color);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.electron.addGridElement(newItem);
  }
});

// event handler for adding images, can handle multiple
addNewImageRectangleInput.addEventListener('change', () => {
  const currentFiles = addNewImageRectangleInput.files;

  if (currentFiles.length === 0) {
    return
  }

  for (const file of Array.from(currentFiles)) {
    const tableBody = document.getElementById('tableBody');
    const imageSrc = URL.createObjectURL(file);

    const newItem = createNewItem({ name: file.name.split('.')[0], id: tableBody.children.length, type: Type.RectangleImage, imageSrcUrl: imageSrc });
    addElementToTable(newItem.id, newItem.name, newItem.type, newItem.color);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.electron.addGridElement(newItem);
  }
});

function addElementToTable(id: number, name: string, type: Type, color: string) {
  const tableBody = document.getElementById('tableBody');


  for (let i = 0; i < tableBody.children.length; i++) {
    tableBody.children[i].classList.remove('active')
  }

  const tableRow = document.createElement('tr');
  const nameTd = document.createElement('td');
  const nameInput = document.createElement('input');
  const typeTd = document.createElement('td');
  const actionsTd = document.createElement('td');

  nameInput.addEventListener('click', (e) => {
    // stop onclick from row getting event bubble
    e.stopImmediatePropagation();
  });

  const changeColorButton = document.createElement('input')
  changeColorButton.type = "color";
  changeColorButton.value = color;
  changeColorButton.addEventListener('click', (e) => {
    // stop onclick from row getting event bubble
    e.stopImmediatePropagation();
  });
  changeColorButton.addEventListener('input', (e) => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.electron.changeGridElementColor(id, `${e.target.value}`)
  });

  const deleteButton = document.createElement('button')
  deleteButton.innerText = "Delete";

  // remove item also from table after we fire electron event for main window
  deleteButton.addEventListener('click', (e) => {
    e.stopImmediatePropagation();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.electron.deleteGridElement(id);
    setTimeout(() => {
      const toBeDeletedRow = document.getElementById(`table-row-item-id-${id}`).remove();
    }, 150 );
  });

  tableRow.id = `table-row-item-id-${id}`; // id
  tableRow.className = 'active';

  // if row is clicked, we want to select it to be able to move it again
  tableRow.addEventListener('click', () => {
    for (let i = 0; i < tableBody.children.length; i++) {
      tableBody.children[i].classList.remove('active')
    }

    tableRow.className = 'active';


    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.electron.moveGridElement(id)
  });


  nameInput.value = name;

  typeTd.innerText = type;

  actionsTd.className='actions-td'

  nameTd.appendChild(nameInput);
  actionsTd.appendChild(changeColorButton);
  actionsTd.appendChild(deleteButton);
  tableRow.appendChild(nameTd);
  tableRow.appendChild(typeTd);
  tableRow.appendChild(actionsTd);
  tableBody.appendChild(tableRow);
}
