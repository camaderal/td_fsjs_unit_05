// Global Variables
let employeeObjects = [];   // contains all information on employees
let employeeCards = [];     // contains pre-created employee cards

// Gallery
const galleryDiv = document.getElementById("gallery");

// Search Container
const searchContainerDiv = document.querySelector(".search-container");

const searchForm = document.createElement("form");
searchForm.action = "#";
searchForm.method = "get";
searchContainerDiv.appendChild(searchForm);

const searchInput = document.createElement("input");
searchInput.type = "search";
searchInput.id = "search-input";
searchInput.className = "search-input";
searchInput.placeholder = "Search...";
searchForm.appendChild(searchInput);

const searchButton = document.createElement("input");
searchButton.type = "submit";
searchButton.id = "search-submit";
searchButton.className = "search-submit";
searchButton.value = "\u{1F50D}"
searchForm.appendChild(searchButton);

searchInput.addEventListener("keyup", filter);
searchInput.addEventListener("change", filter);

// Fetch data
fetch("https://randomuser.me/api/?results=12&nat=us")
    .then(response => response.json())
    .then(responseJson => generateGallery(responseJson.results));   

/**
 * Parse response 
 * Create a list of employee objects
 * And show them on screen
 * 
 * @param JSON apiResponse 
 */
function generateGallery(apiResponse){

    // reset 
    employeeObjects = [];
    employeeCards = [];
    galleryDiv.innerHTML = "";

    // loop through response
    apiResponse.forEach( (employee, index) => {
        // Create an employee object
        let employeeObj = {
            index : index,
            profilePicUrl: employee.picture.large,
            firstName: employee.name.first,
            lastName: employee.name.last,
            email: employee.email,
            streetNumber: employee.location.street.number,
            streetName: employee.location.street.name,
            city: employee.location.city,
            state: employee.location.state,
            country: employee.location.country,
            postCode: employee.location.postcode,
            cell: employee.cell,
            birthday: new Date(employee.dob.date).toLocaleDateString()
        };
        employeeObjects.push(employeeObj);

        // create employee card
        const employeeCard = createCard(employeeObj);
        employeeCards.push(employeeCard);
        galleryDiv.appendChild(employeeCard);
    });
}

/**
 * Create an individual employee card from an employee object
 * 
 * @param Object employeeObj 
 */
function createCard(employeeObj){
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";

    const cardImageDiv = document.createElement("div");
    cardImageDiv.className = "card-img-container";
    cardDiv.appendChild(cardImageDiv);

    const cardImageImg = document.createElement("img");
    cardImageImg.className = "card-img"; 
    cardImageImg.src = employeeObj.profilePicUrl;
    cardImageImg.alt = "profile picture";
    cardImageDiv.appendChild(cardImageImg);

    const cardInfoDiv = document.createElement("div");
    cardInfoDiv.className = "card-info-container";
    cardInfoDiv.innerHTML = `
        <h3 id="name" class="card-name cap">${employeeObj.firstName} ${employeeObj.lastName}</h3>
        <p class="card-text">${employeeObj.email}</p>
        <p class="card-text cap">${employeeObj.city}, ${employeeObj.state}</p>
    `;

    cardDiv.appendChild(cardInfoDiv);
    cardDiv.addEventListener("click", (e) => {
        showModalWindow(employeeObj.index);
    });
    return cardDiv;
}

/**
 * Creates and shows the modal window
 * 
 * @param int index 
 */
function showModalWindow(index){
    const modalContainerDiv = document.createElement("div");
    modalContainerDiv.className = "modal-container";

    const modalDiv = document.createElement("div");
    modalDiv.className = "modal";
    modalContainerDiv.appendChild(modalDiv);
    document.body.appendChild(modalContainerDiv);

    // Create close button
    const closeModalButton = document.createElement("button");
    closeModalButton.id = "modal-close-btn";
    closeModalButton.className = "modal-close-btn";
    closeModalButton.innerHTML = `<strong>X</strong>`;
    closeModalButton.addEventListener("click", () => {
        document.body.removeChild(modalContainerDiv);
    });
    modalDiv.appendChild(closeModalButton);
    document.body.appendChild(modalContainerDiv);

    // create info div
    const modalInfoContainerDiv = document.createElement("div");
    modalInfoContainerDiv.className = "modal-info-container";
    modalDiv.appendChild(modalInfoContainerDiv);
   
    // create navigation div
    const modalBtnContainer = document.createElement("div");
    modalContainerDiv.appendChild(modalBtnContainer);
    modalBtnContainer.className = "modal-btn-container";
    modalBtnContainer.innerHTML = `
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    `
    // add functionalities to navigation
    document.getElementById("modal-prev").addEventListener("click", e => {
        prev(modalInfoContainerDiv)
    });
    document.getElementById("modal-next").addEventListener("click", e => {
        next(modalInfoContainerDiv)
    });

    // change employee info on the modal window
    changeModalEmployeeInfo(modalInfoContainerDiv, index);
    changeNavigationDisplay();
}

/**
 * Change the employee info shown in the modal window
 * 
 * @param divElement modalInfoContainerDiv 
 * @param int index 
 */
function changeModalEmployeeInfo(modalInfoContainerDiv, index){
    const employee = employeeObjects[index];
    modalInfoContainerDiv.innerHTML = `
        <input type="hidden" id="currentModalIndex" value="${employee.index}">
        <img class="modal-img" src="${employee.profilePicUrl}" alt="profile picture">
        <h3 id="name" class="modal-name cap">${employee.firstName} ${employee.lastName}</h3>
        <p class="modal-text">${employee.email}</p>
        <p class="modal-text cap">${employee.city}</p>
        <hr>
        <p class="modal-text">${employee.cell}</p>
        <p class="modal-text">${employee.streetNumber} ${employee.streetName}, ${employee.state}, ${employee.country}, OR  ${employee.postCode}</p>
        <p class="modal-text">Birthday: ${employee.birthday}</p>
    `;
}

/**
 * Display previous employee in modal window
 * 
 * @param divElement modalInfoContainerDiv 
 */
function prev(modalInfoContainerDiv){
    const currentIndex = parseInt(document.getElementById("currentModalIndex").value);
    const prevIndex = Math.max(0,currentIndex-1);

    // change employee info on the modal window
    changeModalEmployeeInfo(modalInfoContainerDiv, prevIndex);
    changeNavigationDisplay();
}

/**
 * Display next employee in modal window
 * 
 * @param divElement modalInfoContainerDiv 
 */
function next(modalInfoContainerDiv){
    const currentIndex = parseInt(document.getElementById("currentModalIndex").value);
    const nextIndex = Math.min(employeeObjects.length-1, currentIndex+1);

    // change employee info on the modal window
    changeModalEmployeeInfo(modalInfoContainerDiv, nextIndex);
    changeNavigationDisplay();
}

/**
 * Disable modal buttons based on displayed employee index
 */
function changeNavigationDisplay(){
    const currentIndex = parseInt(document.getElementById("currentModalIndex").value);
    if(currentIndex <= 0){
        document.getElementById("modal-prev").disabled = true;
    }else{
        document.getElementById("modal-prev").disabled = false;
    }
    
    if(currentIndex >= employeeObjects.length-1){
        document.getElementById("modal-next").disabled = true;
    }else{
        document.getElementById("modal-next").disabled = false;
    }
}

/**
 * Filter employees by name
 */
function filter(){
    const filterKey = searchInput.value.trim().toUpperCase();
    galleryDiv.innerHTML = "";

    employeeObjects.forEach( (employeeObj) => {
        if(employeeObj.firstName.toUpperCase().includes(filterKey) 
            || employeeObj.lastName.toUpperCase().includes(filterKey)){
            galleryDiv.appendChild(employeeCards[employeeObj.index]);
        }
    });
}