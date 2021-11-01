// VARIABLES ====================================================================
const search = document.querySelector('.search-container');
const gallery = document.getElementById('gallery');
let employees;

// HELPERS ====================================================================
const getEmployees = (endpoint, params = null, callback = null) =>
 fetch(`${endpoint}${params ? `?${params}` : ''}`)
    .then(res => res.json())
    .then(data => callback ? callback(data.results) : data.results)
    .catch(err => {
      document.body.innerHTML += '<p>Failed to load employees</p>'
      console.error(`API request failed: ${err}`);
    });

const createEmployeeCard = ({ id, picture, name, location, email }) => (
  `<section class="card" data-key="${id.value}">
    <div class="card-img-container">
      <img class="card-img" src="${picture.large}" alt="Picture of ${name.first} ${name.last}">
    </div>
    <div class="card-info-container">
      <h3 id="name" class="card-name cap">${name.first} ${name.last}</h3>
      <p class="card-text">${email}</p>
      <p class="card-text cap">${location.city}, ${location.state}</p>
    </div>
  </section>`
);

const displayEmployeeModal = id => {
  const employee = employees.filter(employee => employee.id.value === id)[0];
  const { picture, name, email, cell, location, dob } = employee;
  const date = new Date(dob.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const container = document.querySelector('.modal-container');

  if (container) document.body.removeChild(container); // check if modal already exists and remove

  const modal = `<div class="modal-container">
        <section class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
            <img class="modal-img" src="${picture.large}" alt="Picture of ${name.first} ${name.last}">
            <h3 id="name" class="card-name cap">${name.first} ${name.last}</h3>
            <p class="card-text">${email}</p>
            <p class="card-text cap">${location.city}</p>
            <hr>
            <p class="card-text">${cell}</p>
            <p class="card-text">${location.street.number} ${location.street.name}, ${location.city}, ${location.state}, ${location.postcode}</p>
            <p class="card-text">Birthday: ${date}</p>
          </div>
        </section>
        <div class="modal-btn-container">
          <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
          <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
      </div>`;

  document.body.insertAdjacentHTML('beforeend', modal);
  handleModal(employees.indexOf(employee));
}

const displayEmployees = data => {
  employees = data;
  employees.map(employee => gallery.innerHTML += createEmployeeCard(employee));
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => card.addEventListener('click', () => displayEmployeeModal(card.dataset.key)));
}

const handleModal = index => {
  const container = document.querySelector('.modal-container');
  const modalClose = container.querySelector('.modal-close-btn');
  const btns = container.querySelectorAll('.btn');

  modalClose.addEventListener('click', () => document.body.removeChild(container));
  btns.forEach(btn => btn.addEventListener('click', () => {
    let newIndex = index;
    btn.classList.contains('modal-prev') ? newIndex-- : newIndex++;
    if (employees[newIndex]) displayEmployeeModal(employees[newIndex].id.value);
  }));
}

const addSearch = () => {
  search.innerHTML += `<form action="#">
      <input type="search" id="search-input" class="search-input" placeholder="Search...">
      <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`;

  const input = search.querySelector('.search-input');
  input.addEventListener('keyup', () => {
    const value = input.value.toLowerCase();
    const employees = document.querySelectorAll('.card-name');

    employees.forEach(employee => {
      const name = employee.textContent.toLowerCase();
      const employeeCard = employee.parentElement.parentElement;

      value !== ''
        ? name.indexOf(value) > -1
          ? employeeCard.style.display = ''
          : employeeCard.style.display = 'none'
        : employeeCard.style.display = '';
    });
  });
}

getEmployees('https://randomuser.me/api', 'results=12&nat=us,gb', displayEmployees);
addSearch();