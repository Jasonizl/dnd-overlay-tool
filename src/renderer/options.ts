

const initializeTableList = () => {
  const tableBody = document.getElementById('tableBody');

  const tableRow = document.createElement('tr');
  const nameTd = document.createElement('td');
  const nameInput = document.createElement('input');
  const typeTd = document.createElement('td');
  const actionsTd = document.createElement('td');

  tableRow.id = 'table-row-item-0'; // id
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
