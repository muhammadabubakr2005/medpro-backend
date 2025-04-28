
// function extractMedicinesFromText(text) {
//     // Assume the "Prescription" header exists and medicines are listed under it
//     const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
//     const medicines = [];
//     // let foundPrescriptionHeader = false;
  
//     for (const line of lines) {
//       // if (foundPrescriptionHeader) {
//         // After 'Prescription' header, assume every next non-empty line is a medicine name
//         if (line.match(/^[A-Za-z ]+$/)) {
//           medicines.push(line);
//         } else {
//           break; // Stop if a line doesn't look like a medicine anymore
//         }
//       // }
  
//       // if (line.toLowerCase().includes('prescription')) {
//       //   foundPrescriptionHeader = true;
//       // }
//     }
//     console.log("Extracted medicines:", medicines);
//     return medicines;
//   }
  
//   module.exports = { extractMedicinesFromText };
