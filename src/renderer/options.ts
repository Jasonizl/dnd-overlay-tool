

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.electron.resetActiveElement(() => {
  const tableBody = document.getElementById('tableBody');

  for (let i = 0; i < tableBody.children.length; i++) {
    tableBody.children[i].classList.remove('active')
  }

  const tableRow = document.getElementById('table-row-item-id-0');

  tableRow.className = 'active';
});


const initializeTableList = () => {
  const tableBody = document.getElementById('tableBody');

  const tableRow = document.createElement('tr');
  const nameTd = document.createElement('td');
  const nameInput = document.createElement('input');
  const typeTd = document.createElement('td');
  const actionsTd = document.createElement('td');

  tableRow.id = 'table-row-item-id-0'; // id
  tableRow.className = 'active';
  nameInput.value = 'grid';

  typeTd.innerText = Type.Grid;

  nameTd.appendChild(nameInput);
  tableRow.appendChild(nameTd);
  tableRow.appendChild(typeTd);
  tableRow.appendChild(actionsTd);
  tableBody.appendChild(tableRow);
}

initializeTableList()
