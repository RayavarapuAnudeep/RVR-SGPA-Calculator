let data = {};

// ✅ Your updated CSV link (ends in /pub?output=csv)
const publicSpreadsheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJ9RRXIWhzsLVDb6_aog6Epz7QbhkHqRhg4FvZ1MyUmLQAfWkAxvjHGaFwICuiClndRcdkmaq5dXCo/pub?gid=0&single=true&output=csv";

async function init() {
    try {
        const response = await fetch(publicSpreadsheetUrl);
        const csvText = await response.text();
        parseCSVData(csvText);
    } catch (error) {
        console.error("Error loading sheet:", error);
    }
}

function parseCSVData(csvText) {
    data = {};
    // Split text into rows
    const rows = csvText.split(/\r?\n/);
    
    for (let i = 1; i < rows.length; i++) {
        if (!rows[i]) continue;

        // This Regex handles commas INSIDE quotes (like "Probability, Statistics")
        const columns = rows[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        
        if (columns.length >= 3) {
            const branch = columns[0].replace(/"/g, "").trim();
            const subjectName = columns[1].replace(/"/g, "").trim();
            const credits = parseFloat(columns[2].replace(/"/g, "").trim());

            if (!data[branch]) data[branch] = [];
            data[branch].push({
                name: subjectName,
                credits: credits
            });
        }
    }
    console.log("Data successfully processed:", data);
}

// Automatically displays subjects and their credits
function loadSubjects() {
    const branch = document.getElementById("branch").value;
    const container = document.getElementById("subjects");
    container.innerHTML = ""; 

    if (!branch || !data[branch]) return;

    data[branch].forEach((subject, index) => {
        container.innerHTML += `
            <div class="subject-row" style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding: 10px;">
                <p><strong>${subject.name}</strong></p>
                <p style="font-size: 0.9em; color: #555;">Credits: ${subject.credits}</p>
                <select id="grade${index}" class="grade-select">
                    <option value="">-- Select Grade --</option>
                    <option value="10">A+ </option>
                    <option value="9">A </option>
                    <option value="8">B </option>
                    <option value="7">C </option>
                    <option value="6">D </option>
                    <option value="5">E </option>
                    <option value="0">F </option>
                </select>
            </div>
        `;
    });
}

// Math calculation for SGPA
function calculateSGPA() {
    const branch = document.getElementById("branch").value;
    if (!branch || !data[branch]) return alert("Please select a branch first");

    let totalCredits = 0;
    let totalPoints = 0;
    let allSelected = true;

    data[branch].forEach((subject, i) => {
        const gradeVal = document.getElementById("grade" + i).value;
        if (gradeVal === "") {
            allSelected = false;
        } else {
            const grade = Number(gradeVal);
            const credits = parseFloat(subject.credits);
            totalCredits += credits;
            totalPoints += (credits * grade);
        }
    });

    if (!allSelected) {
        return alert("Please select grades for all subjects");
    }

    const sgpa = totalPoints / totalCredits;
    document.getElementById("result").innerText = "Your SGPA is: " + sgpa.toFixed(2);
}

// Start fetching data immediately
window.addEventListener("DOMContentLoaded", init);




