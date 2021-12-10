const API = "http://localhost:8001/students";

//! CREATE

let inpSurname = $(".inp-surname");
let inpName = $(".inp-name");
let inpPhone = $(".inp-phone");
let inpWeek1 = $(".inp-week1");
let inpWeek2 = $(".inp-week2");
let inpWeek3 = $(".inp-week3");
let inpWeek4 = $(".inp-week4");
let addForm = $(".add-form");

async function addStudent(event) {
  event.preventDefault();
  let surname = inpSurname.val().trim();
  let name = inpName.val().trim();
  let phone = inpPhone.val().trim();
  let week1 = inpWeek1.val().trim();
  let week2 = inpWeek2.val().trim();
  let week3 = inpWeek3.val().trim();
  let week4 = inpWeek4.val().trim();

  let newStudent = {
    surname,
    name,
    phone,
    week1,
    week2,
    week3,
    week4,
  };
  for (let key in newStudent) {
    if (!newStudent[key]) {
      alert("Заполните все поля!!!");
      return;
    }
  }

  await axios.post(API, newStudent);
  inpSurname.val("");
  inpName.val("");
  inpPhone.val("");
  inpWeek1.val("");
  inpWeek2.val("");
  inpWeek3.val("");
  inpWeek4.val("");
  getStudents(API);
}

addForm.on("submit", addStudent);

//! READ
let tbody = $("tbody");
let students = [];

async function getStudents(API, showLoader = true) {
  const response = await axios(API);
  students = response.data;
  handlePagination();
}

function render(data) {
  tbody.html("");
  data.forEach((item, index) => {
    const res = (+item.week1 + +item.week2 + +item.week3 + +item.week4) / 4;
    tbody.append(`
    <tr>
          <td>${index + 1}</td>
          <td>${item.surname}</td>
          <td>${item.name}</td>
          <td>${item.phone}</td>
          <td>${item.week1}%</td>
          <td>${item.week2}%</td>
          <td>${item.week3}%</td>
          <td>${item.week4}%</td>
          <td>${res}%</td>
          <td>
          <button class="btn-delete" id="${item.id}">
              <img src="https://cdn-icons-png.flaticon.com/512/3096/3096687.png">
          </button>
          </td>
          <td>
          <button id="${
            item.id
          }" class="btn-edit" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <img src="https://cdn-icons-png.flaticon.com/512/1827/1827933.png">
          </button>
          </td>
          </tr>
    `);
  });
}
getStudents(API);

//!Delete
async function deleteStudent(event) {
  let id = event.currentTarget.id;
  await axios.delete(`${API}/${id}`);
  getStudents(API);
}
$(document).on("click", ".btn-delete", deleteStudent);

//! Update

let editForm = $(".edit-form");
let editSurname = $(".edit-surname");
let editName = $(".edit-name");
let editPhone = $(".edit-phone");
let editWeek1 = $(".edit-week1");
let editWeek2 = $(".edit-week2");
let editWeek3 = $(".edit-week3");
let editWeek4 = $(".edit-week4");

async function getStudentToEdit(event) {
  let id = event.currentTarget.id;
  const response = await axios(`${API}/${id}`);
  let { data } = response;
  editSurname.val(data.surname);
  editName.val(data.name);
  editPhone.val(data.phone);
  editWeek1.val(data.week1);
  editWeek2.val(data.week2);
  editWeek3.val(data.week3);
  editWeek4.val(data.week4);

  editForm.attr("id", id);
}
$(document).on("click", ".btn-edit", getStudentToEdit);

async function saveEditedStudent(event) {
  event.preventDefault();
  let id = event.currentTarget.id;
  let surname = editSurname.val();
  let name = editName.val();
  let phone = editPhone.val();
  let week1 = editWeek1.val();
  let week2 = editWeek2.val();
  let week3 = editWeek3.val();
  let week4 = editWeek4.val();
  let editedStudent = {
    surname,
    name,
    phone,
    week1,
    week2,
    week3,
    week4,
  };
  for (let key in editedStudent) {
    if (!editedStudent[key]) {
      alert("Заполните поля!!!");
      return;
    }
  }
  await axios.patch(`${API}/${id}`, editedStudent);
  getStudents(API);
  $(".modal").modal("hide");
}
editForm.on("submit", saveEditedStudent);

//! Search

let searchInp = $(".search-inp");

async function liveSearch(event) {
  let value = event.target.value;
  let newAPI = `${API}?q=${value}`;
  currentPage = 1;
  getStudents(newAPI, false);
}

searchInp.on("input", liveSearch);

//! Pagination

const studentsPerPage = 5;
let pagesCount = 1;
let currentPage = 1;
let totalStudentsCount = 0;

function handlePagination() {
  let indexOfLastStudent = currentPage * studentsPerPage;
  let indexOfFistStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(
    indexOfFistStudent,
    indexOfLastStudent
  );
  totalStudentsCount = students.length;
  pagesCount = Math.ceil(totalStudentsCount / studentsPerPage);
  addPagination(pagesCount);
  render(currentStudents);
}

let pagination = $(".pagination");
function addPagination(pagesCount) {
  pagination.html("");
  //! Previous button
  pagination.append(`
      <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
        <a class="page-link prev-item" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
  `);
  //! Pages button
  for (let i = 1; i <= pagesCount; i++) {
    if (i == currentPage) {
      pagination.append(`
    <li class="page-item active">
      <a class="page-link pagination-item" href="#">${i}</a>
    </li>
    `);
    } else {
      pagination.append(`
    <li class="page-item">
      <a class="page-link pagination-item" href="#">${i}</a>
    </li>
    `);
    }
  }
  // !Next button
  pagination.append(`
    <li class="page-item ${currentPage === pagesCount ? "disabled" : ""}">
      <a class="page-link next-item" href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  `);
}

function paginate(event) {
  let newPage = event.target.innerText;
  currentPage = newPage;
  handlePagination();
}

$(document).on("click", ".pagination-item", paginate);

function nextPage() {
  if (currentPage == pagesCount) {
    return;
  }
  currentPage++;
  handlePagination();
}
function prevPage() {
  if (currentPage == 1) {
    return;
  }
  currentPage--;
  handlePagination();
}

$(document).on("click", ".next-item", nextPage);
$(document).on("click", ".prev-item", prevPage);
