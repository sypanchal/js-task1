const form = document.querySelector("#student-registration-form");

const addIcon = document.querySelector(".add-icon");
const addEduRow = document.querySelector(".dynamic");

const displayDataContainer = document.querySelector(".display-container");
const displayData = document.querySelector(".display__container-table");

////////////////////////////////////////////////////
// Validations

const getFullDate = (date, year) => {
  const currentDate = date;

  return new Date(
    currentDate.getFullYear() + year,
    currentDate.getMonth(),
    currentDate.getDate() + 1
  )
    .toISOString()
    .split("T")[0];
};

const getYearMonth = (date, year, month = 11) => {
  const currentDate = date;
  let maxGradYear = new Date();

  maxGradYear.setFullYear(currentDate.getFullYear() + year);
  maxGradYear.setMonth(month);

  return maxGradYear.toISOString().slice(0, 7);
};

// Email
function validateEmail(e) {
  const email = e.value;
  const emailPattern = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,5}$/;

  if (!emailPattern.test(email)) {
    alert("Invalid email address. Please enter a valid email.");
  }
}

// Calculate the minimum date allowed (18 years ago from today)
document
  .getElementById("dob")
  .setAttribute("max", getFullDate(new Date(), -18));

// On DOB change event
document.getElementById("dob").addEventListener("change", function () {
  // Get the value of the date of birth input
  const dob = this.value;

  // Graduation Year
  document
    .getElementById("graduationYear")
    .setAttribute("max", getYearMonth(new Date(), 5));

  document
    .getElementById("graduationYear")
    .setAttribute("min", getYearMonth(new Date(dob), 16));

  // Start Date
  document.querySelectorAll('input[id^="startDate"]').forEach((input) => {
    input.setAttribute("min", getYearMonth(new Date(dob), 0, 0));
    input.setAttribute("max", getYearMonth(new Date(), 5));
  });
});

// Passout Year
const setMinPassoutYear = (e) => {
  const passoutYear = e.parentNode.parentNode.children[3].children[0];

  passoutYear.setAttribute("min", getYearMonth(new Date(e.value), 1, 0));
  passoutYear.setAttribute("max", getYearMonth(new Date(), 5));
};

// Percentage and Backlog
const onNegativeInputChange = (e) => {
  // Convert the input value to a number
  let val = parseFloat(e.value);

  // Check if the value is negative zero
  if (Object.is(val, -0) || Object.is(val, +0)) {
    // Reset the input value to 0
    e.value = "0";
  }
};

////////////////////////////////////////////////////

const dobString = (dobDate) => {
  const date = new Date(dobDate);

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  return `${day}/${month}/${year}`;
};

const gradString = (gardDate) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date(gardDate);
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${year}`;
};

const buildJSONFormData = (form) => {
  let jsonFormData = {};

  for (const pair of new FormData(form)) {
    if (
      pair[0] === "firstName" ||
      pair[0] === "lastName" ||
      pair[0] === "dob" ||
      pair[0] === "email" ||
      pair[0] === "address" ||
      pair[0] === "graduationYear"
    ) {
      jsonFormData[pair[0]] = pair[1];
    }
  }

  return jsonFormData;
};

let displayRawID = 0;
const addRawtoDisplay = (formData) => {
  formData.forEach((item) => {
    let tr = document.createElement("tr");

    Object.keys(item).forEach((key) => {
      if (key === "dob") {
        let td = document.createElement("td");
        td.innerText = dobString(item[key]);
        tr.appendChild(td);
      } else if (key === "graduationYear") {
        let td = document.createElement("td");
        td.innerText = gradString(item[key]);
        tr.appendChild(td);
      } else if (key !== "educationData" && key !== "studentID") {
        let td = document.createElement("td");
        td.innerText = item[key];
        tr.appendChild(td);
      }
    });

    tr.setAttribute("id", displayRawID);
    displayRawID++;
    displayData.appendChild(tr);
  });
};

let formData = [];

// form.addEventListener("submit", function (e) {
//   e.preventDefault();
//   const data = buildJSONFormData(form);

//   let educationData = [];

//   for (let i = 1; i < count; i++) {
//     educationData.push({
//       degree: document.getElementById(`degree-${i}`)?.value,
//       school: document.getElementById(`school-${i}`)?.value,
//       startDate: document.getElementById(`startDate-${i}`)?.value,
//       passoutYear: document.getElementById(`passoutYear-${i}`)?.value,
//       percentage: document.getElementById(`percentage-${i}`)?.value,
//       backlog: document.getElementById(`backlog-${i}`)?.value,
//     });
//   }

//   //   data.educationData = educationData;

//   const formData = [];

//   formData.push(data);

//   console.log(formData);
//   console.log(educationData);

//   displayDataContainer.style.visibility = "visible";
//   displayDataContainer.style.opacity = "1";
//   addRawtoDisplay(formData);
// });

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = buildJSONFormData(form);

  let personEducationData = [];
  let educationData = [];

  for (let i = 1; i < count; i++) {
    let rawData = {
      degree: document.getElementById(`degree-${i}`).value,
      school: document.getElementById(`school-${i}`).value,
      startDate: document.getElementById(`startDate-${i}`).value,
      passoutYear: document.getElementById(`passoutYear-${i}`).value,
      percentage: document.getElementById(`percentage-${i}`).value,
      backlog: document.getElementById(`backlog-${i}`).value,
    };

    if (rawData.degree != "") {
      personEducationData.push(rawData);
    }
  }

  educationData.push(personEducationData);
  data.educationData = educationData;
  data.studentID = displayRawID;

  formData.push(data);

  addRawtoDisplay([data]);
  console.log(formData);
  displayDataContainer.classList.remove("hidden");
});

// Create New Education Raw
let count = 3;
const addNewEducation = () => {
  if (document.getElementById("dob").value === "") {
    alert("Enter student details first");
    return;
  }

  const html = `
      <tr>
        <td>
          <input type="text" id="degree-${count}" name="degree-${count}"  required/>
        </td>
        <td>
          <input type="text" id="school-${count}" name="school-${count}" required />
        </td>
        <td>
          <input 
              type="month" 
              id="startDate-${count}" 
              name="startDate-${count}" 
              min="${getYearMonth(
                new Date(document.getElementById("dob").value),
                0
              )}" 
              max="${getYearMonth(new Date(), 5)}" 
              onchange="setMinPassoutYear(this)"
              required
          />
        </td>
        <td>
          <input 
              type="month" 
              id="passoutYear-${count}" 
              name="passoutYear-${count}"
              max="${getYearMonth(new Date(), 5)}"  
              required              
          />
        </td>
        <td>
          <input
              type="number"
              id="percentage-${count}"
              name="percentage-${count}"
              max="100"
              min="0"
              step="0.01"
              placeholder="Don't use % sign"
              oninput="onNegativeInputChange(this)"
              required
          />
        </td>
        <td>
          <input
              type="number"
              min="0"
              id="backlog-${count}"
              name="backlog-${count}"
              placeholder="If any enter number"
              oninput="onNegativeInputChange(this)"
              required
          />
        </td>
        <td>
          <div class="icon remove-icon" onClick="removeEducation(this)">
            <iconify-icon icon="ep:remove-filled"></iconify-icon>
          </div>
        </td>
      </tr>
    `;

  addEduRow.insertAdjacentHTML("beforebegin", html);
  count++;
};

// Delete Education Raw
const removeEducation = (e) => {
  e.closest("tr").remove();
};
