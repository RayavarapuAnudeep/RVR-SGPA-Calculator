let data = {};

// ✅ Your published Google Sheet link
const publicSpreadsheetUrl = 
"https://docs.google.com/spreadsheets/d/e/2PACX-1vThfreak7XcoDEANIKO054MGdcqflS6UN2-7MmaEUtnfS2tV1f5z6kpxpI6dShGvbdBCW-P0jifmULM/pubhtml";

// Initialize Tabletop
function init() {
    Tabletop.init({
        key: publicSpreadsheetUrl,
        simpleSheet: true,
        callback: onDataLoaded
    });
}

// Runs after data is loaded from Google Sheet
function onDataLoaded(sheetData) {
    data = {};

    sheetData.forEach(row => {
        const branch = row.Branch; // must match column name exactly
        if (!data[branch]) data[branch] = [];

        data[branch].push({
            name: row.Subject,
            credits: Number(row.Credits)
        });
    });

    console.log("Data loaded:", data); // check in browser console
}

// Load subjects for selected branch
function loadSubjects() {
    const branch = document.getElementById("branch").value;
    const container = document.getElementById("subjects");
    container.innerHTML = "";

    if (!branch || !data[branch]) return;

    data[branch].forEach((subject, index) => {
        container.innerHTML += `
            <div class="subject">
                <b>${subject.name}</b>
                <input type="text" value="${subject.credits}" readonly>
                <select id="grade${index}">
                    <option value="">Grade</option>
                    <option value="10">A+</option>
                    <option value="9">A</option>
                    <option value="8">B</option>
                    <option value="7">C</option>
                    <option value="6">D</option>
                    <option value="5">E</option>
                    <option value="0">F</option>
                </select>
            </div>
        `;
    });
}

// Calculate SGPA
function calculateSGPA() {
    const branch = document.getElementById("branch").value;
    if (!branch || !data[branch]) return alert("Select a branch");

    let totalCredits = 0, totalPoints = 0;

    data[branch].forEach((subject, i) => {
        const grade = document.getElementById("grade" + i).value;
        if (!grade) return alert("Select all grades");

        totalCredits += subject.credits;
        totalPoints += subject.credits * grade;
    });

    const sgpa = totalPoints / totalCredits;
    document.getElementById("result").innerText =
        "Your SGPA is: " + sgpa.toFixed(2);
}

// Run Tabletop on page load
window.addEventListener("DOMContentLoaded", init);
