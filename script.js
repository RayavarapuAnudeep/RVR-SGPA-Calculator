let data = {};

// ✅ Use your NEW CSV Link here
const publicSpreadsheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vThfreak7XcoDEANIKO054MGdcqflS6UN2-7MmaEUtnfS2tV1f5z6kpxpI6dShGvbdBCW-P0jifmULM/pub?output=csv";

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
    // This regex correctly handles commas inside quotes
    const rows = csvText.split(/\r?\n/);
    
    for (let i = 1; i < rows.length; i++) {
        // Advanced split to ignore commas inside "quotes"
        const columns = rows[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        
        if (columns && columns.length >= 3) {
            const branch = columns[0].replace(/"/g, "").trim();
            const subjectName = columns[1].replace(/"/g, "").trim();
            const credits = parseFloat(columns[2].replace(/"/g, "").trim());

            if (!data[branch]) data[branch] = [];
            data[branch].push({ name: subjectName, credits: credits });
        }
    }
    console.log("Calculated Data:", data);
}

// ... Keep your loadSubjects and calculateSGPA functions below ...
