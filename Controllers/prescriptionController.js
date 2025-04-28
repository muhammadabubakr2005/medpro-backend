const Prescription = require('../models/prescriptionModel');
// const Medicine = require('../models/medicineModel');
// const {extractMedicinesFromText}=require('../Utils/helperOCR');
const Tesseract = require('tesseract.js');
const { OpenAI } = require('openai');

// Initialize OpenAI API
const openai = new OpenAI({ apiKey: 'your_openai_key' });

exports.uploadPrescription = async (req, res) => {
  try {
    // 1. Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imagePath = req.file.path; // Assuming multer stores file path here

    // 2. Extract text from image using Tesseract
    const ocrResult = await Tesseract.recognize(imagePath, 'eng');
    const extractedText = ocrResult.data.text;

    if (!extractedText || extractedText.trim() === '') {
      return res.status(400).json({ error: 'No readable text found in image' });
    }

    // 3. Send extracted text to OpenAI for medicine extraction
    const prompt = `
You are a prescription reader.
Extract only the medicine names from the following prescription text:
"${extractedText}"
Return the output as a JSON array of medicine names like ["Paracetamol", "Ibuprofen", "Amoxicillin"].
Ignore dosages, instructions, and frequencies.
`;

    const llmResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Or 'gpt-3.5-turbo'
      messages: [{ role: 'user', content: prompt }],
    });

    let medicines = llmResponse.choices[0].message.content.trim();

    // 4. Try to parse LLM response
    try {
      medicines = JSON.parse(medicines);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to parse LLM response', rawResponse: medicines });
    }

    // 5. Send medicines back
    return res.status(200).json({ medicines });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while processing prescription' });
  }
};




// exports.uploadPrescription = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No image uploaded' });
//     }

//     // OCR: Extract text from the uploaded image file
//     const { data: { text } } = await Tesseract.recognize(req.file.buffer, 'eng');

//     // const medicinesList = extractMedicinesFromText(text);
//     console.log("Extracted text:", text); // Debugging line to check the extracted text
//     if (medicinesList.length === 0) {
//       return res.status(400).json({ message: 'No medicines found in the prescription' });
//     }

//     const relatedMedicines = await Medicine.find({
//       name: { $in: medicinesList.map(name => new RegExp(name, 'i')) }
//     });

//     const relatedMedicineIds = relatedMedicines.map(med => med._id);

//     const prescription = new Prescription({
//       userId: req.user.id,
//       imageUrl: 'uploaded-from-device', // optional: you can also save file info
//       relatedMedicineIds,
//     });

//     await prescription.save();

//     res.status(201).json({ 
//       message: 'Prescription uploaded and medicines linked',
//       medicinesDetected: medicinesList,
//       medicinesMatched: relatedMedicines.length,
//       prescription 
//     });
//   } catch (error) {
//     console.error('OCR/Upload error:', error);
//     res.status(500).json({ message: 'Error uploading prescription', error });
//   }
// };
// exports.uploadPrescription = async (req, res) => {
//     try {
//       const { imageUrl } = req.file.buffer;
  
//       if (!imageUrl) {
//         return res.status(400).json({ message: 'Image URL is required' });
//       }
  
//       // OCR: Extract text from the prescription image
//       const { data: { text } } = await Tesseract.recognize(imageUrl, 'eng');
  
//       // Extract medicine names from the text
//       const medicinesList = extractMedicinesFromText(text);
  
//       if (medicinesList.length === 0) {
//         return res.status(400).json({ message: 'No medicines found in the prescription' });
//       }
  
//       // Search medicines in the database
//       const relatedMedicines = await Medicine.find({
//         name: { $in: medicinesList.map(name => new RegExp(name, 'i')) }
//       });
  
//       const relatedMedicineIds = relatedMedicines.map(med => med._id);
  
//       // Save prescription
//       const prescription = new Prescription({
//         userId: req.user.id,
//         imageUrl,
//         relatedMedicineIds,
//       });
  
//       await prescription.save();
  
//       res.status(201).json({ 
//         message: 'Prescription uploaded and medicines linked',
//         medicinesDetected: medicinesList,
//         medicinesMatched: relatedMedicines.length,
//         prescription 
//       });
  
//     } catch (error) {
//       console.error('OCR/Upload error:', error);
//       res.status(500).json({ message: 'Error uploading prescription', error });
//     }
//   };
  
  
  exports.getUserPrescriptions = async (req, res) => {
    try {
      const prescriptions = await Prescription.find({ userId: req.user.id });
      res.json(prescriptions);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching prescriptions', error });
    }
  };
  
//   exports.getAllPrescriptions = async (req, res) => {
//     try {
//       const prescriptions = await Prescription.find().populate('userId', 'name email');
//       res.json(prescriptions);
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching all prescriptions', error });
//     }
//   };
  