const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// In-memory sessions
const sessions = {};

// Hardcoded Clinic Profile
const clinicProfile = {
  timings: "We are open from 9 AM to 7 PM, Monday through Saturday. Closed on Sundays.",
  doctors: "We have Dr. Sharma (General Physician) and Dr. Gupta (Pediatrician) available.",
  insurance: "Yes, we accept most major health insurance plans, including HDFC ERGO, Star Health, and Bajaj Allianz.",
  location: "We are located at 123 Health Ave, Koramangala, Bengaluru."
};

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: process.platform === 'linux' ? '/usr/bin/chromium' : undefined
  }
});

client.on('qr', (qr) => {
  console.log('\n=============================================');
  console.log('SCAN THIS QR CODE WITH WHATSAPP TO LOGIN:');
  console.log('=============================================\n');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('ClinicAI WhatsApp Bot is ready and connected!');
});

client.on('message', async (message) => {
  const senderId = message.from;
  const text = message.body.trim();
  const lowerText = text.toLowerCase();

  // Skip group messages or broadcast statuses
  if (message.isGroupMsg || senderId.includes('@broadcast')) return;

  // Handle Visit Summary Command (Doctor Only - but anyone can use it for demo)
  if (lowerText.startsWith("summary:")) {
    const details = text.substring(8).trim();
    if (!process.env.GEMINI_API_KEY) {
      await message.reply("Error: GEMINI_API_KEY is not set.");
      return;
    }
    
    await message.reply("Generating summary with AI, please wait...");
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `
        You are an AI Clinic Assistant.
        Given the following patient details, generate a JSON object with two fields:
        1. "clinicalSummary": A professional, concise clinical summary.
        2. "whatsappMessage": A friendly WhatsApp message for the patient.

        Patient Details: ${details}

        Return ONLY raw JSON, with no markdown formatting.
        Format:
        {
          "clinicalSummary": "...",
          "whatsappMessage": "..."
        }
      `;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let aiText = response.text().trim();
      aiText = aiText.replace(/```json/gi, "").replace(/```/gi, "").trim();
      const parsed = JSON.parse(aiText);

      await message.reply(`*🩺 Clinical Summary:*\n${parsed.clinicalSummary}\n\n*📱 Message for Patient:*\n${parsed.whatsappMessage}`);
    } catch (e) {
      await message.reply("Sorry, failed to generate summary. Please ensure details are correct.");
      console.error(e);
    }
    return;
  }

  // Session Management
  if (!sessions[senderId]) {
    sessions[senderId] = { step: 0 };
  }
  const session = sessions[senderId];

  // Global Reset
  if (lowerText === "reset" || lowerText === "cancel") {
    sessions[senderId] = { step: 0 };
    await message.reply("Session reset. How can I help you? Reply with:\n1. Book Appointment\n2. Ask FAQ");
    return;
  }

  // Main Menu
  if (session.step === 0) {
    if (lowerText.includes("book") || lowerText === "1") {
      session.step = 1;
      session.booking = {};
      await message.reply("Welcome to ClinicAI Booking! What is the patient's name?");
    } else if (lowerText.includes("faq") || lowerText.includes("ask") || lowerText === "2") {
      session.step = 10;
      await message.reply("Sure! I can answer questions about Dr. Sharma's Clinic. Ask me about timings, doctors, location, or insurance.");
    } else {
      await message.reply("Welcome to ClinicAI! How can I help you today? Reply with:\n1. Book Appointment\n2. Ask FAQ\n\n(Doctors: start a message with 'Summary: [details]' to generate AI summaries)");
    }
    return;
  }

  // Booking Flow
  if (session.step > 0 && session.step < 10) {
    if (session.step === 1) {
      session.booking.name = text;
      session.step = 2;
      await message.reply(`Nice to meet you, ${text}. When would you like the appointment? (e.g. Tomorrow morning)`);
    } else if (session.step === 2) {
      session.booking.date = text;
      session.step = 3;
      await message.reply(`Got it. Which doctor would you prefer? Dr. Sharma or Dr. Gupta?`);
    } else if (session.step === 3) {
      session.booking.doctor = text;
      session.step = 0; // reset
      await message.reply(`Perfect! Your appointment is confirmed with ${text} for ${session.booking.date}. We'll send a reminder to ${session.booking.name} soon!`);
    }
    return;
  }

  // FAQ Flow
  if (session.step >= 10) {
    if (lowerText.includes("timing") || lowerText.includes("time") || lowerText.includes("open")) {
      await message.reply(clinicProfile.timings);
    } else if (lowerText.includes("doctor") || lowerText.includes("who")) {
      await message.reply(clinicProfile.doctors);
    } else if (lowerText.includes("insurance")) {
      await message.reply(clinicProfile.insurance);
    } else if (lowerText.includes("location") || lowerText.includes("where")) {
      await message.reply(clinicProfile.location);
    } else {
      await message.reply("I'm sorry, I don't have the answer to that. You can ask me about timings, doctors, location, or insurance! (Type 'reset' to go back to main menu)");
    }
    return;
  }
});

client.initialize();
