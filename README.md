Advanced Phishing Detection Suite is a browser-based cybersecurity project that analyzes suspicious emails using a custom phishing rules engine, weighted risk scoring, attack-simulation samples, 
and optional AI-assisted threat analysis to identify modern phishing tactics such as BEC, TOAD, quishing, credential theft, and domain impersonation.

![HTML5](https://img.shields.io/badge/HTML5-Structure-orange?style=for-the-badge&logo=html5)
![CSS3](https://img.shields.io/badge/CSS3-Styling-blue?style=for-the-badge&logo=css3)
![JavaScript](https://img.shields.io/badge/JavaScript-Logic-yellow?style=for-the-badge&logo=javascript)
![Cybersecurity](https://img.shields.io/badge/Project-Cybersecurity-red?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Advanced-green?style=for-the-badge)

# 🛡️ Advanced Phishing Detection Suite

An advanced cybersecurity web project that detects and analyzes phishing emails using **20+ red-flag detection rules**, **risk scoring**, **sample attack simulations**, and **optional AI-powered threat analysis**.

This project is designed as a **portfolio-grade phishing detection system** for demonstrating practical cybersecurity awareness, phishing triage logic, suspicious email analysis, and modern front-end project structuring using **HTML, CSS, and JavaScript**.

---

## 🚀 Project Overview

**Advanced Phishing Detection Suite** is a browser-based phishing analysis platform built to identify suspicious and malicious email patterns using a weighted rule-based detection engine.

The application allows a user to paste email content such as:

- Sender email / display name
- Reply-To address
- Subject line
- Email body

The system then scans the email against a custom phishing ruleset and generates a **risk score**, **verdict**, **matched red flags**, and **recommended action**.

This project was built to simulate how a phishing triage or email analysis tool could work in a cybersecurity awareness, SOC, or analyst-style environment.

---

## ✨ Key Features

- 🔍 **Email Phishing Analyzer**
  - Analyze sender, reply-to, subject, and email body
  - Detect suspicious phishing patterns in real time

- 🚩 **20+ Red Flag Detection Categories**
  - Sender/display-name mismatch
  - Homoglyph / typosquatting domains
  - Suspicious login/update domains
  - Reply-To mismatch
  - Urgency / fear-based language
  - Credential harvesting attempts
  - Fake account security alerts
  - MFA fatigue / push bombing indicators
  - TOAD callback scams
  - QR phishing / quishing
  - Business Email Compromise (BEC)
  - Dangerous attachment references
  - Thread hijacking patterns
  - Secrecy / bypass procedure requests
  - Shortened / hidden phishing links
  - Vishing / pretexting language
  - Fake geo-login alerts
  - AI/deepfake phishing indicators
  - Government / tax impersonation
  - Password reset phishing patterns

- 📊 **Risk Scoring Engine**
  - Weighted scoring system based on matched phishing indicators
  - Final verdict categories:
    - **SAFE**
    - **SUSPICIOUS**
    - **MALICIOUS**

- 🤖 **Optional AI Deep Analysis Mode**
  - AI-based threat explanation layer
  - Can be used to generate deeper context about attacker intent, phishing technique, and social engineering behavior

- 📚 **Sample Phishing Attack Library**
  - Built-in phishing scenarios for testing and demonstration
  - Includes examples such as:
    - CEO wire fraud / BEC
    - Microsoft credential theft
    - IRS tax scam
    - QR phishing
    - TOAD callback phishing
    - Fake password reset
    - Deepfake voice phishing

- 🎓 **Phishing Awareness Education Section**
  - Explains modern phishing techniques such as:
    - Spear phishing
    - BEC
    - MFA fatigue
    - Quishing
    - Homoglyph attacks
    - Thread hijacking
    - AI-generated phishing

- 💻 **Fully Front-End Based**
  - Runs directly in the browser
  - No database required
  - No backend required for core rule-based analysis

---

## 🧠 How the Detection Works

The phishing analyzer uses a **rule-based detection engine** with a **weighted scoring model**.

### Detection flow:
1. The user enters email details:
   - Sender
   - Reply-To
   - Subject
   - Body

2. The application scans the content against predefined phishing rules.

3. Each matched rule adds a specific **weight / risk score**.

4. The total score is calculated and capped.

5. Based on the final score, the email is classified as:
   - **SAFE**
   - **SUSPICIOUS**
   - **MALICIOUS**

6. The system displays:
   - Risk score
   - Verdict
   - Matched red flags
   - Severity level
   - Recommended response

---

## 🚨 Red Flag Categories Included

This project includes detection logic for more than **20 phishing red-flag categories**, including:

- Sender / display name mismatch
- Homoglyph and typosquatting domains
- Suspicious sender domain patterns
- Free email abuse for corporate impersonation
- Reply-To mismatch
- Urgency and fear triggers
- Sensitive information requests
- Fake sign-in / security alerts
- MFA fatigue indicators
- Callback scam / TOAD patterns
- QR phishing / quishing prompts
- Executive impersonation / BEC requests
- Dangerous file attachment references
- Fake forwarded or hijacked thread patterns
- Secrecy and bypass procedure instructions
- Shortened or disguised phishing links
- Vishing / pretext-based scam wording
- Geo-login / foreign IP scare tactics
- AI-generated / deepfake lure patterns
- Tax / government impersonation
- Fake password reset flows

---

## 🖥️ Tech Stack

### Languages Used
- **HTML5**
- **CSS3**
- **JavaScript (Vanilla JS)**

### Concepts Used
- DOM manipulation
- Rule-based phishing detection logic
- Weighted risk scoring
- Conditional rendering
- Dynamic UI updates
- Front-end event handling
- Cybersecurity awareness simulation
- Pattern matching and keyword detection

---

## 📂 Project Structure

```bash
Advanced-Phishing-Detection-Suite/
│
├── index.html       # Main application structure
├── style.css        # UI styling, layout, animations, theme
├── script.js        # Phishing rules engine, scoring logic, rendering, samples
└── README.md        # Project documentation
```

> If your project is currently inside a single `index.html` file, you can later separate it into `index.html`, `style.css`, and `script.js` for cleaner project structure.

---

## 🧪 Sample Scenarios Included

The project includes demo phishing samples for testing the analyzer, such as:

- **BEC / CEO Wire Fraud**
- **Microsoft Credential Theft**
- **TOAD Callback Scam**
- **IRS Tax Fraud Email**
- **QR Phishing (Quishing)**
- **Deepfake Voice Message Scam**
- **Fake Password Reset**
- **Legitimate Safe Email Example**

These scenarios help simulate real-world phishing attempts and make the project more useful for awareness demonstrations and portfolio presentation.

---

## 🎯 Use Cases

This project can be used for:

- Cybersecurity portfolio showcase
- Phishing awareness demonstrations
- College / academic cybersecurity project submission
- Front-end security project practice
- Email threat triage simulation
- Rule-based phishing detection concept demo
- Security awareness training prototype

---

## 📸 Interface Highlights

The interface includes:

- Modern glassmorphism-inspired dashboard UI
- Email analysis panel
- AI toggle option
- Risk score progress bar
- Verdict badge system
- Red-flag explanation cards
- Sample attack cards
- Educational phishing awareness section
- Responsive design for multiple screen sizes

---

## ⚠️ Important Note

This project is built for **educational, awareness, and portfolio purposes**.

It demonstrates how phishing detection logic can be implemented in a front-end web environment, but it is **not intended to replace enterprise-grade email security solutions** or production threat intelligence systems.

---

## 👨‍💻 Author

**Saurabh Pandey**  
Cybersecurity / Web Security Project

GitHub: [saurabhpandey0924-sys](https://github.com/saurabhpandey0924-sys)

---

## 🌐 Future Improvements

Possible future upgrades for this project:

- Backend integration for report storage
- Upload `.eml` email file analysis
- Suspicious URL extraction and parsing
- Domain reputation / WHOIS checks
- Attachment risk inspection module
- PDF report export
- Dashboard analytics for multiple analyzed emails
- Threat intelligence API integration
- Admin panel / login system
- Database support for storing phishing cases

---

## 📌 Final Summary

**Advanced Phishing Detection Suite** is a portfolio-grade cybersecurity project that combines:

- phishing awareness,
- rule-based email threat detection,
- weighted scoring logic,
- phishing scenario simulation,
- interactive UI design,
- and optional AI-based analysis

into one modern browser-based security demonstration platform.
