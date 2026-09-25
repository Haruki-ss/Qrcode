/* =========================================
   ATTENDANCE SYSTEM
========================================= */


/* =========================================
   VARIABLES
========================================= */

let selectedCell = null;

let selectedStudentId = null;

let selectedDate = null;


/* =========================================
   ELEMENTS
========================================= */

const startDateInput =
    document.getElementById("startDate");

const attendanceModal =
    document.getElementById(
        "attendanceModal"
    );

const modalDate =
    document.getElementById(
        "modalDate"
    );


/* =========================================
   GET TODAY
========================================= */

function getToday() {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


/* =========================================
   DATE TO STRING
========================================= */

function dateToString(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateString) {

    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* =========================================
   FORMAT HEADER DATE
========================================= */

function formatHeaderDate(dateString) {

    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return {
        month:
            date.toLocaleDateString(
                "en-US",
                {
                    month: "short"
                }
            ),

        day:
            date.getDate(),

        weekday:
            date.toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            )
    };

}


/* =========================================
   INITIALIZE PAGE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* -----------------------------
           SET DEFAULT DATE
        ----------------------------- */

        const savedStartDate =
            localStorage.getItem(
                "classStartDate"
            );


        if (savedStartDate) {

            startDateInput.value =
                savedStartDate;

        } else {

            startDateInput.value =
                getToday();

        }


        /* -----------------------------
           CREATE DATE HEADERS
        ----------------------------- */

        updateDateHeaders();


        /* -----------------------------
           LOAD ATTENDANCE
        ----------------------------- */

        loadAllAttendance();


        /* -----------------------------
           UPDATE TOTALS
        ----------------------------- */

        updateAllTotals();


    }
);


/* =========================================
   UPDATE DATE HEADERS
========================================= */

function updateDateHeaders() {

    const startDate =
        startDateInput.value;


    if (!startDate) {
        return;
    }


    const date =
        new Date(
            startDate +
            "T00:00:00"
        );


    const headers =
        document.querySelectorAll(
            ".date-header"
        );


    headers.forEach(
        function (header) {

            const index =
                parseInt(
                    header.dataset.index
                );


            const headerDate =
                new Date(date);


            headerDate.setDate(
                date.getDate() +
                index
            );


            const dateString =
                dateToString(
                    headerDate
                );


            const formatted =
                formatHeaderDate(
                    dateString
                );


            header.dataset.date =
                dateString;


            header.innerHTML =

                formatted.month +
                " " +
                formatted.day +

                "<small>" +
                formatted.weekday +
                "</small>";


        }
    );


    highlightSelectedDate();

}


/* =========================================
   START DATE CHANGED
========================================= */

startDateInput.addEventListener(
    "change",
    function () {

        const newDate =
            startDateInput.value;


        if (!newDate) {
            return;
        }


        localStorage.setItem(
            "classStartDate",
            newDate
        );


        updateDateHeaders();


        loadAllAttendance();


        updateAllTotals();

    }
);


/* =========================================
   CLICK DATE HEADER
========================================= */

document.addEventListener(
    "click",
    function (event) {


        const header =
            event.target.closest(
                ".date-header"
            );


        if (!header) {
            return;
        }


        const date =
            header.dataset.date;


        if (!date) {
            return;
        }


        /* Set selected date */

        selectedDate = date;


        /* Update date input */

        startDateInput.value =
            date;


        /* Highlight header */

        highlightSelectedDate();


        /* Load attendance */

        loadAllAttendance();


        updateAllTotals();

    }
);


/* =========================================
   HIGHLIGHT SELECTED DATE
========================================= */

function highlightSelectedDate() {

    const headers =
        document.querySelectorAll(
            ".date-header"
        );


    headers.forEach(
        function (header) {

            header.classList.remove(
                "selected"
            );

        }
    );


    if (!selectedDate) {
        return;
    }


    headers.forEach(
        function (header) {

            if (
                header.dataset.date ===
                selectedDate
            ) {

                header.classList.add(
                    "selected"
                );

            }

        }
    );

}


/* =========================================
   ATTENDANCE CELL CLICK
========================================= */

document.addEventListener(
    "click",
    function (event) {


        const cell =
            event.target.closest(
                ".attendance-cell"
            );


        if (!cell) {
            return;
        }


        /* Get row */

        const row =
            cell.closest("tr");


        if (!row) {
            return;
        }


        /* Get student ID */

        selectedStudentId =
            row.dataset.studentId;


        /* Get date index */

        const dateIndex =
            parseInt(
                cell.dataset.dateIndex
            );


        /* Get date header */

        const header =
            document.querySelector(
                `.date-header[data-index="${dateIndex}"]`
            );


        if (!header) {
            return;
        }


        /* Get actual date */

        selectedDate =
            header.dataset.date;


        /* Remember selected cell */

        selectedCell = cell;


        /* Show modal date */

        modalDate.textContent =
            "Date: " +
            formatDate(
                selectedDate
            );


        /* Show modal */

        attendanceModal.classList.add(
            "show"
        );

    }
);


/* =========================================
   STATUS BUTTONS
========================================= */

const statusButtons =
    document.querySelectorAll(
        ".status-button"
    );


statusButtons.forEach(
    function (button) {


        button.addEventListener(
            "click",
            function () {


                const status =
                    button.dataset.status;


                setAttendance(
                    status
                );


            }
        );

    }
);


/* =========================================
   SET ATTENDANCE
========================================= */

function setAttendance(status) {


    if (!selectedCell) {
        return;
    }


    /* Remove old classes */

    selectedCell.classList.remove(
        "present",
        "late",
        "absent"
    );


    /* Set text */

    selectedCell.textContent =
        status;


    /* Add color */

    if (status === "P") {

        selectedCell.classList.add(
            "present"
        );

    }


    if (status === "L") {

        selectedCell.classList.add(
            "late"
        );

    }


    if (status === "A") {

        selectedCell.classList.add(
            "absent"
        );

    }


    /* Save */

    saveAttendance();


    /* Update total */

    updateAllTotals();


    /* Close modal */

    closeModal();

}


/* =========================================
   SAVE ATTENDANCE
========================================= */

function saveAttendance() {


    if (
        !selectedCell ||
        !selectedStudentId ||
        !selectedDate
    ) {

        return;

    }


    const key =
        "attendance_" +
        selectedDate +
        "_" +
        selectedStudentId;


    const data = {

        status:
            selectedCell.textContent.trim()

    };


    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

}


/* =========================================
   LOAD ALL ATTENDANCE
========================================= */

function loadAllAttendance() {


    const cells =
        document.querySelectorAll(
            ".attendance-cell"
        );


    cells.forEach(
        function (cell) {


            const row =
                cell.closest("tr");


            const studentId =
                row.dataset.studentId;


            const dateIndex =
                parseInt(
                    cell.dataset.dateIndex
                );


            const header =
                document.querySelector(
                    `.date-header[data-index="${dateIndex}"]`
                );


            if (!header) {
                return;
            }


            const date =
                header.dataset.date;


            const key =
                "attendance_" +
                date +
                "_" +
                studentId;


            const saved =
                localStorage.getItem(
                    key
                );


            /* Reset */

            cell.textContent = "";

            cell.classList.remove(
                "present",
                "late",
                "absent"
            );


            if (!saved) {
                return;
            }


            try {


                const data =
                    JSON.parse(
                        saved
                    );


                const status =
                    data.status;


                cell.textContent =
                    status;


                if (
                    status === "P"
                ) {

                    cell.classList.add(
                        "present"
                    );

                }


                if (
                    status === "L"
                ) {

                    cell.classList.add(
                        "late"
                    );

                }


                if (
                    status === "A"
                ) {

                    cell.classList.add(
                        "absent"
                    );

                }


            }

            catch (error) {

                console.log(
                    "Error loading attendance:",
                    error
                );

            }

        }
    );

}


/* =========================================
   UPDATE ALL TOTALS
========================================= */

function updateAllTotals() {


    const rows =
        document.querySelectorAll(
            "#studentTableBody tr"
        );


    rows.forEach(
        function (row) {


            const cells =
                row.querySelectorAll(
                    ".attendance-cell"
                );


            const totalCell =
                row.querySelector(
                    ".total-present"
                );


            let total = 0;


            cells.forEach(
                function (cell) {


                    const status =
                        cell.textContent.trim();


                    /*
                       ONLY PRESENT COUNTS
                       AS TOTAL PRESENT
                    */

                    if (
                        status === "P"
                    ) {

                        total++;

                    }

                }
            );


            totalCell.textContent =
                total;

        }
    );

}


/* =========================================
   CLOSE MODAL
========================================= */

function closeModal() {

    attendanceModal.classList.remove(
        "show"
    );


    selectedCell = null;

    selectedStudentId = null;

}


/* =========================================
   CANCEL BUTTON
========================================= */

document
    .getElementById(
        "cancelButton"
    )
    .addEventListener(
        "click",
        function () {

            closeModal();

        }
    );


/* =========================================
   CLICK OUTSIDE MODAL
========================================= */

attendanceModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            attendanceModal
        ) {

            closeModal();

        }

    }
);


/* =========================================
   ADD STUDENT
========================================= */

document
    .getElementById(
        "addStudentButton"
    )
    .addEventListener(
        "click",
        function () {


            const studentId =
                prompt(
                    "Enter Student ID:"
                );


            if (!studentId) {
                return;
            }


            /* Check duplicate */

            const existing =
                document.querySelector(
                    `tr[data-student-id="${studentId}"]`
                );


            if (existing) {

                alert(
                    "Student ID already exists."
                );

                return;

            }


            const studentName =
                prompt(
                    "Enter Student Name:"
                );


            if (!studentName) {
                return;
            }


            const tbody =
                document.getElementById(
                    "studentTableBody"
                );


            const row =
                document.createElement(
                    "tr"
                );


            row.dataset.studentId =
                studentId;


            let cells = "";


            for (
                let i = 0;
                i < 8;
                i++
            ) {

                cells += `

                    <td
                        class="attendance-cell"
                        data-date-index="${i}"
                    ></td>

                `;

            }


            row.innerHTML = `

                <td>
                    ${studentId}
                </td>

                <td>
                    ${studentName.toUpperCase()}
                </td>

                ${cells}

                <td
                    class="total-present"
                >
                    0
                </td>

            `;


            tbody.appendChild(
                row
            );


            alert(
                "Student added successfully!"
            );

        }
    );


/* =========================================
   DELETE STUDENT
========================================= */

document
    .getElementById(
        "deleteStudentButton"
    )
    .addEventListener(
        "click",
        function () {


            const studentId =
                prompt(
                    "Enter Student ID to delete:"
                );


            if (!studentId) {
                return;
            }


            const row =
                document.querySelector(
                    `tr[data-student-id="${studentId}"]`
                );


            if (!row) {

                alert(
                    "Student ID not found."
                );

                return;

            }


            const confirmDelete =
                confirm(
                    "Delete this student?"
                );


            if (!confirmDelete) {
                return;
            }


            /* Remove student */

            row.remove();


            /*
                Remove saved attendance
                for this student.
            */

            for (
                let i = 0;
                i < 8;
                i++
            ) {


                const header =
                    document.querySelector(
                        `.date-header[data-index="${i}"]`
                    );


                if (!header) {
                    continue;
                }


                const date =
                    header.dataset.date;


                const key =
                    "attendance_" +
                    date +
                    "_" +
                    studentId;


                localStorage.removeItem(
                    key
                );

            }


            alert(
                "Student deleted successfully."
            );


        }
    );


/* =========================================
   BACK BUTTON
========================================= */

document
    .getElementById(
        "backButton"
    )
    .addEventListener(
        "click",
        function () {

            window.history.back();

        }
    );


/* =========================================
   LOGOUT
========================================= */

document
    .getElementById(
        "logoutButton"
    )
    .addEventListener(
        "click",
        function () {


            const answer =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (answer) {

                alert(
                    "You have been logged out."
                );

                /*
                    Change this to your
                    actual login page.

                    Example:

                    window.location.href =
                        "login.html";
                */

            }

        }
    );


/* =========================================
   QR BUTTON
========================================= */

document
    .getElementById(
        "qrButton"
    )
    .addEventListener(
        "click",
        function () {


            alert(
                "QR Attendance feature will be added here."
            );


        }
    );
