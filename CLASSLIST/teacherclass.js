// Select a class
function selectClass(className) {
    window.location.href = "https://haruki-ss.github.io/Qrcode/STUDENTLIST/teacherstudent.html";
    alert("Selected class: " + className);
}


// Student Join Class QR
function joinClass(className) {
    alert(
        "Student Join Class QR for " +
        className +
        " will open here."
    );
}


// Delete a class
function deleteClass(button) {

    const confirmed = confirm(
        "Are you sure you want to delete this class?"
    );

    if (confirmed) {
        button.closest(".class-row").remove();
    }
}


// Create a new class
function createClass() {

    const className = prompt(
        "Enter the name of the new class:"
    );

    if (!className || className.trim() === "") {
        return;
    }

    const row = document.createElement("div");

    row.className = "class-row";

    row.innerHTML = `

        <button
            class="class-name"
            onclick="selectClass('${className}')">

            ${className}

        </button>


        <button
            class="action-btn"
            onclick="joinClass('${className}')">

            STUDENT JOIN CLASS<br>
            QR

        </button>


        <button
            class="action-btn"
            onclick="deleteClass(this)">

            DELETE CLASS

        </button>

    `;

    document
        .getElementById("classList")
        .appendChild(row);
}


// Logout
function logout() {

    window.location.href = "http://127.0.0.1:5500/TEACHER%20INTERFACE/LOGIN/teacherLogin1.html";

}
