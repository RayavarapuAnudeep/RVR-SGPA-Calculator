let data = {};

// ✅ Use your NEW CSV Link here
const publicSpreadsheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vThfreak7XcoDEANIKO054MGdcqflS6UN2-7MmaEUtnfS2tV1f5z6kpxpI6dShGvbdBCW-P0jifmULM/pub?gid=0&single=true&output=csv";

async function init() {
    try {
        const response = await fetch(publicSpreadsheetUrl);
        const csvText = await response.text();
        parseCSVData(csvText);
    } catch (error) {
        console.error("Error loading sheet:", error);
        alert("Failed to load data from Google Sheets.");
    }
}

// Replaces onDataLoaded for CSV format
function parseCSVData(csvText) {
    data = {};
    // Split text into rows and remove empty lines
    const rows = csvText.split("\n").filter(row => row.trim() !== "");
    
    // Skip the first row (headers) and loop through data
    for (let i = 1; i < rows.length; i++) {
        const columns = rows[i].split(",");
        
        // Match your Google Sheet columns: A=Branch, B=Subject, C=Credits
        const branch = columns[0] ? columns[0].trim() : "";
        const subjectName = columns[1] ? columns[1].trim() : "";
        const credits = columns[2] ? Number(columns[2].trim()) : 0;

        if (branch && subjectName) {
            if (!data[branch]) data[branch] = [];
            data[branch].push({
                name: subjectName,
                credits: credits
            });
        }
    }

    console.log("Data successfully processed:", data);
}

// ✅ Keep your existing loadSubjects function
function loadSubjects() {
    const branch = document.getElementById("branch").value;
    const container = document.getElementById("subjects");
    container.innerHTML = "";

    if (!branch || !data[branch]) return;

    data[branch].forEach((subject, index) => {
        container.innerHTML += `
            <div class="subject">
                <p><b>${subject.name}</b> (Credits: ${subject.credits})</p>
                <select id="grade${index}">
                    <option value="">Select Grade</option>
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

// ✅ Keep your existing calculateSGPA function
function calculateSGPA() {
    const branch = document.getElementById("branch").value;
    if (!branch || !data[branch]) return alert("Select a branch first");

    let totalCredits = 0, totalPoints = 0;
    let allGradesSelected = true;

    data[branch].forEach((subject, i) => {
        const gradeValue = document.getElementById("grade" + i).value;
        if (gradeValue === "") {
            allGradesSelected = false;
            return;
        }

        const grade = Number(gradeValue);
        totalCredits += subject.credits;
        totalPoints += (subject.credits * grade);
    });

    if (!allGradesSelected) {
        return alert("Please select grades for all subjects");
    }

    const sgpa = totalPoints / totalCredits;
    document.getElementById("result").innerText = "Your SGPA is: " + sgpa.toFixed(2);
}

window.addEventListener("DOMContentLoaded", init);
