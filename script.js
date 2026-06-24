// ============================================================
// RED FLAG DEFINITIONS — 20+ CATEGORIES
// ============================================================
const RED_FLAGS = {
  "RF01 — Sender/Display Name Mismatch": {
    weight: 20,
    keywords: ["noreply@", "no-reply@", "donotreply@"],
    desc: "Display name claims a trusted brand but From address does not match official domain.",
    check: (sender, replyto, subject, body) => {
      const big = ["microsoft","google","apple","amazon","paypal","netflix","facebook","instagram","linkedin","twitter","x.com","dropbox","docusign","chase","wells fargo","bank of america","irs","fedex","ups","dhl"];
      const sLow = sender.toLowerCase();
      const bodyLow = body.toLowerCase();
      for (const brand of big) {
        if ((sLow.includes(brand) || bodyLow.includes(brand)) && !sLow.includes(`@${brand}.com`)) {
          // Make sure it actually has an @ (it's an email domain)
          if (sLow.includes("@") && !sLow.includes(`@${brand}.`)) {
            return { hit: true, keyword: brand, loc: "sender" };
          }
        }
      }
      return { hit: false };
    }
  },
  "RF02 — Homoglyph / Typosquatting Domain": {
    weight: 25,
    keywords: [],
    desc: "Domain uses character substitution or subtle misspelling to impersonate a trusted brand.",
    check: (sender) => {
      const patterns = [
        /micros[o0]ft/i, /paypa[l1]/i, /g[o0][o0]gle/i, /arnazon/i, /amaz[o0]n/i,
        /app[l1]e/i, /faceb[o0][o0]k/i, /netf[l1]ix/i, /[il1]nstagram/i,
        /tw[il1]tter/i, /1inkedin/i, /llnkedin/i, /linkedln/i,
        /rnicrosoft/i, /micorsoft/i, /rnicrosofft/i, /rn[il1]crosoft/i,
        /goog1e/i, /go0gle/i, /ch[a4]se/i, /[i1]rs\.gov/i,
        /d[o0]cusign/i, /dr[o0]pb[o0]x/i,
      ];
      const sLow = sender.toLowerCase();
      for (const p of patterns) {
        const m = sLow.match(p);
        if (m) return { hit: true, keyword: m[0], loc: "sender domain" };
      }
      return { hit: false };
    }
  },
  "RF03 — Suspicious Domain Pattern": {
    weight: 18,
    keywords: [],
    desc: "Domain uses deceptive naming conventions (login-, secure-, -update, -alert, -verify).",
    check: (sender) => {
      const bad = ["secure-login","login-update","account-verify","account-alert","logins-","support-desk","helpdesk-","-secure.","-login.","-update.","-verify.","-alerts.","-account.",".xyz","account-","verify-","login-","update-","reset-","auth-","-authentication","portal-","billing-","renew-","renewal-","invoice-"];
      const sLow = sender.toLowerCase();
      for (const p of bad) {
        if (sLow.includes(p)) return { hit: true, keyword: p, loc: "sender domain" };
      }
      return { hit: false };
    }
  },
  "RF04 — Free Email for Corporate Claim": {
    weight: 16,
    keywords: [],
    desc: "Sender uses a free email provider (Gmail, Yahoo, etc.) while claiming to be from a corporation.",
    check: (sender, replyto, subject, body) => {
      const free = ["@gmail.com","@yahoo.com","@hotmail.com","@outlook.com","@protonmail.com","@icloud.com","@aol.com","@ymail.com","@mail.com","@zoho.com","@tutanota.com","@gmx.com","@live.com"];
      const sLow = sender.toLowerCase();
      const bodyLow = body.toLowerCase();
      const corpoClues = ["ceo","director","manager","hr department","it department","helpdesk","admin","support team","billing","payroll","finance","legal","compliance","bank","irs","tax"];
      for (const f of free) {
        if (sLow.includes(f)) {
          for (const c of corpoClues) {
            if (sLow.includes(c) || bodyLow.includes(c)) return { hit: true, keyword: f, loc: "sender" };
          }
        }
      }
      return { hit: false };
    }
  },
  "RF05 — Reply-To Mismatch": {
    weight: 22,
    keywords: [],
    desc: "Reply-To address is different from the From address — a classic email spoofing technique.",
    check: (sender, replyto) => {
      if (!replyto || replyto.trim() === "") return { hit: false };
      const getHost = (e) => { const m = e.match(/@([^>]+)/); return m ? m[1].toLowerCase().trim() : ""; };
      const fromHost = getHost(sender);
      const replyHost = getHost(replyto);
      if (fromHost && replyHost && fromHost !== replyHost) {
        return { hit: true, keyword: `${fromHost} → ${replyHost}`, loc: "reply-to header" };
      }
      return { hit: false };
    }
  },
  "RF06 — Urgency / Fear Trigger": {
    weight: 12,
    keywords: ["urgent","immediately","account will be closed","expires in 24","act now","last warning","immediate action required","your account has been","final notice","within 24 hours","deadline","limited time","time sensitive","respond immediately","failure to","will be terminated","will be suspended","you must","you are required","deadline is","past due","overdue","24-hour","48-hour"],
    desc: "Email uses urgency or fear-of-loss language to pressure the victim into acting without thinking."
  },
  "RF07 — Request for Sensitive Information": {
    weight: 20,
    keywords: ["mfa code","otp","one-time password","your password","update billing","confirm your details","verify your account","enter your credentials","payment detail","ssn","social security","date of birth","mother's maiden","credit card","card number","cvv","pin number","bank account","routing number","taxpayer id","ein","wire transfer","account number","login credentials","username and password","reset your password","verify your identity","security question"],
    desc: "Email directly requests credentials, financial data, or personally identifiable information."
  },
  "RF08 — Activity / Sign-in Alert": {
    weight: 14,
    keywords: ["unusual sign-in","account locked","suspicious activity","security alert","login attempt","verify now","someone tried to sign in","unauthorized access","account has been compromised","we noticed","new device","sign-in blocked","your account was accessed","failed login","multiple failed","account flagged","temporary lock"],
    desc: "Fake security alert claiming account compromise to trigger panic and credential submission."
  },
  "RF09 — MFA Fatigue / Push Bombing": {
    weight: 18,
    keywords: ["approve sign-in","mfa request","authentication request","confirm login","approve this request","authenticator app","push notification","authentication code","approve the request","deny if not you","was this you","did you request","approve or deny","tap approve","mfa approval"],
    desc: "Social engineering targeting MFA approval flows to gain unauthorized access even with 2FA enabled."
  },
  "RF10 — TOAD / Security Callback Scam": {
    weight: 20,
    keywords: ["call 1-800","call us immediately","call this number","subscription charge","call to cancel","call our support","contact us by phone","call our team","toll-free","helpline","call within","please call","contact support at","reach us at","phone number","customer care number","call now","call immediately","contact immediately"],
    desc: "Telephone-Oriented Attack Delivery (TOAD) — forces victim to call a fraudulent phone number."
  },
  "RF11 — QR Code Redirect": {
    weight: 16,
    keywords: ["scan the qr","scan to unlock","scan to verify","qr code","scan this code","qr below","use your camera","scan with phone","quishing","scan to access","scan to login","scan to confirm","qr to reset"],
    desc: "QR code (quishing) is used to redirect to phishing URLs that bypass link scanning tools."
  },
  "RF12 — BEC / Executive Impersonation": {
    weight: 24,
    keywords: ["wire transfer","transfer funds","lost my wallet","urgent wire","immediate transfer","ceo","cfo","chief executive","chief financial","vp of finance","president request","on behalf of ceo","executive team","board of directors","confidential request","personal request","outside of normal","dont discuss","do not involve","direct transfer","internal request","bypass approval","expedite payment","send funds","purchase gift cards","itunes gift","google play gift","amazon gift card","gift card transfer"],
    desc: "Business Email Compromise (BEC) — impersonates executive to authorize fraudulent wire transfers or gift card purchases."
  },
  "RF13 — Dangerous Attachment": {
    weight: 22,
    keywords: [".exe",".bat",".js",".vbs",".ps1",".iso",".img",".scr",".com",".cmd",".msi",".hta",".jse",".wsf",".reg",".lnk",".docm",".xlsm",".pptm",".jar",".apk",".deb","macro enabled","enable content","enable macros","click enable","enable editing","download and run","run the attached","open the attached","execute","installer","setup.exe","update.exe","patch.exe"],
    desc: "Email references or attaches malware-capable file formats that can execute malicious code."
  },
  "RF14 — Fake Forwarded / Thread Hijacking": {
    weight: 10,
    keywords: ["fw:","fwd:","forwarded message","re: re: re:","---------- forwarded","original message","begin forwarded","from the desk of","as discussed","following up on our call","as we discussed","per our previous"],
    desc: "Message mimics a forwarded chain or hijacks an existing email thread to appear legitimate."
  },
  "RF15 — Unusual Secrecy / Bypass Request": {
    weight: 20,
    keywords: ["do not discuss","strictly confidential","bypass procedure","bypass standard","do not tell","keep this secret","between us","do not forward","do not share","don't tell","personal and confidential","eyes only","need discretion","confidential matter","outside normal channels","unusual request","unusual process","one time exception","make an exception","skip the usual"],
    desc: "Attacker asks victim to bypass security procedures or keep the request secret to prevent detection."
  },
  "RF16 — Lookalike URL / Shortened Link": {
    weight: 18,
    keywords: ["bit.ly","tinyurl","goo.gl","t.co","ow.ly","is.gd","buff.ly","rebrand.ly","shorturl","tiny.cc","cutt.ly","clck.ru","click here","verify here","update here","login here","confirm here","click the link","click below","access here","submit here","open this link","click the button","visit the link","follow the link","link below","http://","clicking here"],
    desc: "Email uses URL shorteners or deceptively-worded anchor text to hide malicious destinations."
  },
  "RF17 — Vishing / Pretexting Language": {
    weight: 14,
    keywords: ["we tried to reach you","we've been trying","as per our last attempt","left a voicemail","left you a message","attempted to contact","reach you by phone","regarding your case","regarding your account","case number","reference number","ticket number","your case is pending","your file","your application","your claim","your refund","you are owed","you have a refund","unclaimed funds","unclaimed package","pending delivery","package held"],
    desc: "Voice phishing (vishing) pretexts or fake case/package scenarios to add false legitimacy."
  },
  "RF18 — Geo / IP Anomaly Claims": {
    weight: 12,
    keywords: ["sign-in from","logged in from","new location","unusual location","different country","ip address","russia","china","nigeria","new ip","foreign login","unrecognized device","new browser","login from different","not recognize this device","if this wasn't you","wasn't you"],
    desc: "Fake geo-location or device alerts designed to trigger immediate fear and credential re-entry."
  },
  "RF19 — Deepfake / AI-Generated Claim": {
    weight: 16,
    keywords: ["listen to my voice message","voice message attached","voice note","audio message","video verification","video call required","ai-generated","deepfake","voice cloning","voice authentication","i recorded","listen to this"],
    desc: "Emerging AI-powered phishing using fake voice messages, deepfake video, or AI-generated content."
  },
  "RF20 — Tax / Government Impersonation": {
    weight: 22,
    keywords: ["irs","internal revenue","income tax","tax refund","tax notice","tax alert","income tax department","tax department","government notice","court order","legal action","arrest warrant","summons","federal bureau","fbi","cia","department of justice","social security administration","ssa","medicare","medicaid","penalty","fine","legal action will","warrant has been","sheriff","law enforcement","police"],
    desc: "Impersonates tax authorities or government agencies to invoke legal fear and compliance."
  },
  "RF21 — Password Reset / Account Recovery": {
    weight: 16,
    keywords: ["password reset","reset your password","forgot password","account recovery","recover your account","temporary password","new password","password expired","password will expire","change your password","update your password","reset link","recovery link","click to reset","request a reset","verify to reset"],
    desc: "Fake password reset emails attempt to harvest credentials through a fake reset flow."
  },
};

// ============================================================
// WEIGHTED SCORING
// ============================================================
function getSeverity(weight) {
  if (weight >= 22) return "CRITICAL";
  if (weight >= 18) return "HIGH";
  if (weight >= 12) return "MEDIUM";
  return "LOW";
}

function analyzeEmail(sender, replyto, subject, body) {
  const foundFlags = [];
  const senderL = sender.toLowerCase();
  const subjectL = subject.toLowerCase();
  const bodyL = body.toLowerCase();
  const fullText = [sender, replyto, subject, body].join(" ").toLowerCase();

  for (const [flagName, rule] of Object.entries(RED_FLAGS)) {
    let hit = false, matchedKw = "", matchedLoc = "body";

    // Custom check function if defined
    if (rule.check) {
      const result = rule.check(sender, replyto, subject, body);
      if (result.hit) {
        hit = true; matchedKw = result.keyword; matchedLoc = result.loc;
      }
    }

    // Keyword scan
    if (!hit && rule.keywords && rule.keywords.length > 0) {
      for (const kw of rule.keywords) {
        if (fullText.includes(kw.toLowerCase())) {
          hit = true; matchedKw = kw;
          if (senderL.includes(kw.toLowerCase())) matchedLoc = "sender";
          else if (subjectL.includes(kw.toLowerCase())) matchedLoc = "subject";
          else matchedLoc = "body";
          break;
        }
      }
    }

    if (hit) {
      foundFlags.push({
        name: flagName,
        keyword: matchedKw,
        loc: matchedLoc,
        weight: rule.weight,
        severity: getSeverity(rule.weight),
        desc: rule.desc
      });
    }
  }

  let score = Math.min(100, foundFlags.reduce((s, f) => s + f.weight, 0));
  // Bonus if multiple critical flags
  const criticals = foundFlags.filter(f => f.severity === "CRITICAL").length;
  if (criticals >= 2) score = Math.min(100, score + 15);

  let verdict, verdictClass, action, reason;
  if (score === 0) {
    verdict = "SAFE"; verdictClass = "v-safe";
    action = "No phishing indicators detected. Still verify the sender through an alternate channel if unexpected.";
    reason = "No red flags matched against the provided email content. The email appears clean based on available indicators.";
  } else if (score <= 30) {
    verdict = "SUSPICIOUS"; verdictClass = "v-suspicious";
    action = "Verify the sender through a trusted alternate channel. Do not click links or open attachments until verified.";
    reason = "A small number of phishing indicators were matched. Manual verification is recommended before acting.";
  } else if (score <= 60) {
    verdict = "SUSPICIOUS"; verdictClass = "v-suspicious";
    action = "Treat as likely phishing. Do not submit credentials, click links, or open attachments. Report to your security team.";
    reason = "Multiple phishing indicators detected. Risk level is elevated — probable social engineering or credential theft attempt.";
  } else {
    verdict = "MALICIOUS"; verdictClass = "v-malicious";
    action = "Quarantine immediately. Do not click, reply, or engage. Report to security team and delete from inbox.";
    reason = "High-confidence phishing detected. Multiple critical indicators are consistent with advanced threat actor tactics.";
  }

  return { verdict, verdictClass, score, action, reason, flags: foundFlags };
}

// ============================================================
// AI ANALYSIS VIA CLAUDE API
// ============================================================
async function getAIAnalysis(sender, replyto, subject, body, flags) {
  const flagSummary = flags.map(f => `- ${f.name}: matched "${f.keyword}" in ${f.loc}`).join("\n");
  const prompt = `You are an expert cybersecurity analyst specializing in phishing email detection and threat intelligence.

Analyze this email for phishing threats:
FROM: ${sender}
REPLY-TO: ${replyto || "(same as from)"}
SUBJECT: ${subject}
BODY:
${body}

My rule engine already detected these red flags:
${flagSummary || "None detected by rules"}

Provide:
1. THREAT ASSESSMENT: What specific attack technique is being used? (BEC, spear phishing, vishing, TOAD, etc.)
2. ATTACKER INTENT: What is the attacker trying to achieve?
3. SOCIAL ENGINEERING ANALYSIS: What psychological manipulation techniques are used?
4. MISSED INDICATORS: Any subtle red flags the rule engine may have missed?
5. RECOMMENDED ACTIONS: Specific steps for the victim and IT security team.

Be concise, technical, and direct. Max 250 words.`;

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await resp.json();
  return data.content?.map(c => c.text || "").join("") || "AI analysis unavailable.";
}

// ============================================================
// UI RENDERING
// ============================================================
function esc(s) {
  return String(s)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}

function renderResult(report, aiText) {
  const area = document.getElementById("resultArea");
  const { verdict, verdictClass, score, action, reason, flags } = report;

  const now = new Date();
  document.getElementById("resultTimestamp").textContent = now.toLocaleTimeString();

  let flagsHTML = "";
  if (flags.length === 0) {
    flagsHTML = `<div style="color:var(--muted);font-size:0.9rem;padding:12px;background:rgba(30,215,96,0.06);border:1px solid rgba(30,215,96,0.15);border-radius:12px;">
      ✅ No phishing indicators matched in the current ruleset.
    </div>`;
  } else {
    // Sort by weight desc
    const sorted = [...flags].sort((a,b) => b.weight - a.weight);
    flagsHTML = sorted.map(f => `
      <div class="flag-item sev-${f.severity.toLowerCase()}">
        <div class="flag-title">
          <span>${esc(f.name)}</span>
          <span class="sev-pill ${esc(f.severity)}">${esc(f.severity)}</span>
        </div>
        <div class="flag-meta">
          <span>Matched:</span> ${esc(f.keyword || "pattern")} &nbsp;|&nbsp;
          <span>Location:</span> ${esc(f.loc)} &nbsp;|&nbsp;
          <span>Weight:</span> +${f.weight}<br>
          <span>Why:</span> ${esc(f.desc)}
        </div>
      </div>
    `).join("");
    flagsHTML = `<div class="flags-list">${flagsHTML}</div>`;
  }

  let aiBlock = "";
  if (aiText === "loading") {
    aiBlock = `<div class="ai-result"><div class="ai-result-head"><span class="loading-spinner"></span> Requesting AI deep analysis...</div></div>`;
  } else if (aiText) {
    aiBlock = `<div class="ai-result">
      <div class="ai-result-head">🤖 Claude AI — Threat Intelligence Report</div>
      <p>${esc(aiText)}</p>
    </div>`;
  }

  area.innerHTML = `
    <div class="result-header">
      <div class="verdict-badge ${verdictClass}">
        ${verdict === "SAFE" ? "✅" : verdict === "SUSPICIOUS" ? "⚠️" : "🔴"} ${verdict}
      </div>
      <div style="color:var(--muted);font-size:0.85rem;">${flags.length} indicator${flags.length !== 1 ? "s" : ""} matched</div>
    </div>

    <div class="score-bar-wrap">
      <div class="score-row">
        <h4>Risk Score</h4>
        <strong class="score-num" style="color:${score < 30 ? "var(--success)" : score < 60 ? "var(--warning)" : "var(--danger)"}">${score}/100</strong>
      </div>
      <div class="progress">
        <div class="progress-bar" style="width:${score}%"></div>
      </div>
    </div>

    <div class="result-cards">
      <div class="rcard">
        <h4>📊 Verdict Summary</h4>
        <p>${esc(reason)}</p>
      </div>
      <div class="rcard">
        <h4>🛡️ Recommended Action</h4>
        <p>${esc(action)}</p>
      </div>
      <div class="rcard">
        <h4>🚩 Matched Red Flags (${flags.length})</h4>
        ${flagsHTML}
      </div>
    </div>
    ${aiBlock}
  `;
}

async function runAnalysis() {
  const sender  = document.getElementById("sender").value.trim();
  const replyto = document.getElementById("replyto").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const body    = document.getElementById("body").value.trim();
  const useAI   = document.getElementById("aiToggle").checked;

  if (!sender && !subject && !body) {
    alert("Please enter at least sender, subject, or body before running the analysis.");
    return;
  }

  const report = analyzeEmail(sender, replyto, subject, body);

  if (useAI) {
    renderResult(report, "loading");
    document.getElementById("resultArea").scrollIntoView({ behavior: "smooth", block: "start" });
    try {
      const aiText = await getAIAnalysis(sender, replyto, subject, body, report.flags);
      renderResult(report, aiText);
    } catch (e) {
      renderResult(report, "AI analysis failed. Rule-based results are shown above.");
    }
  } else {
    renderResult(report, null);
    document.getElementById("resultArea").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function clearForm() {
  ["sender","replyto","subject","body"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("resultTimestamp").textContent = "";
  document.getElementById("resultArea").innerHTML = `
    <div class="empty-state">
      <span class="empty-icon">🔍</span>
      Form cleared. Paste an email and click <strong>Run Analysis</strong>.
    </div>`;
}

// ============================================================
// SAMPLE EMAILS
// ============================================================
const SAMPLES = [
  {
    label: "BEC — CEO Wire Fraud",
    tag: "CRITICAL", tagClass: "danger",
    sender: "David Chen CEO <d.chen.ceo@gmail.com>",
    replyto: "hacker.collect@protonmail.com",
    subject: "URGENT: Wire Transfer — Confidential",
    body: "I'm in a board meeting and lost my wallet at the airport. I need you to urgently wire transfer $42,000 to our partner. Do not discuss this with anyone — bypass standard procedure. This is strictly confidential. Immediate action required. Reply only to my personal email. — David Chen, CEO"
  },
  {
    label: "Microsoft Credential Theft",
    tag: "HIGH", tagClass: "danger",
    sender: "Microsoft Support <support@micros0ft-logins.net>",
    replyto: "",
    subject: "FW: URGENT: Your Account Has Been Compromised",
    body: "We detected an unusual sign-in from Russia on a new device. Your account will be locked within 24 hours. Immediate action required. Click here to verify your account and enter your credentials to restore access. Failure to act will result in permanent suspension. Download the security patch: Security_Update.iso"
  },
  {
    label: "TOAD Callback Scam",
    tag: "HIGH", tagClass: "warning",
    sender: "Microsoft Billing <billing@microsofft-renewal.com>",
    replyto: "",
    subject: "PAYMENT OVERDUE: Subscription Renewal $189.99",
    body: "Your Microsoft 365 subscription auto-renewal of $189.99 has been processed. If you did not authorize this charge, call our customer care number immediately at 1-800-642-7676 to cancel and get a full refund. Call within 24 hours or the charge will be final. Call to cancel now."
  },
  {
    label: "IRS Tax Scam",
    tag: "CRITICAL", tagClass: "danger",
    sender: "IRS Internal Revenue <notice@irs-taxdept-alert.com>",
    replyto: "irs.case@gmail.com",
    subject: "FINAL NOTICE — Tax Penalty & Legal Action",
    body: "This is your final notice from the Internal Revenue Service. You owe $4,832 in unpaid taxes. Failure to respond within 24 hours will result in arrest warrant and legal action. A sheriff will be dispatched to your address. To settle your case, call 1-800-XXX-XXXX immediately with your SSN and bank account details."
  },
  {
    label: "QR Code Phishing (Quishing)",
    tag: "HIGH", tagClass: "warning",
    sender: "IT Security Team <itsecurity@company-hr-portal.xyz>",
    replyto: "",
    subject: "Action Required: Update Your MFA — Scan QR Code",
    body: "Dear employee, our MFA system is being upgraded. To maintain access, please scan the QR code below using your phone camera within 24 hours. This will link your new authenticator app. If you do not scan to verify, your account access will be suspended. Approve this request to continue."
  },
  {
    label: "Legitimate Internal Email",
    tag: "SAFE", tagClass: "safe",
    sender: "Sarah Lee <sarah.lee@company.com>",
    replyto: "",
    subject: "Q3 Project Status Update",
    body: "Hi Team, Please find the Q3 project status attached for your review. No immediate action is required — this is just for your awareness ahead of Monday's meeting. Let me know if you have questions. Thanks, Sarah."
  },
  {
    label: "Deepfake Voice Message",
    tag: "HIGH", tagClass: "warning",
    sender: "CFO James Park <jpark.cfo.external@gmail.com>",
    replyto: "jpark.reply@protonmail.com",
    subject: "Listen to my voice message — Urgent",
    body: "Hi, I tried calling but couldn't reach you. Please listen to my voice message attached (VoiceNote_JP.exe). I need you to transfer funds to a new vendor account urgently. Do not discuss this with anyone — handle it personally. This is a confidential executive request. Between us only."
  },
  {
    label: "Fake Password Reset",
    tag: "MEDIUM", tagClass: "warning",
    sender: "Google Accounts <no-reply@google.accounts-alert.com>",
    replyto: "",
    subject: "Action Required: Your password will expire soon",
    body: "Your Google account password is about to expire. To keep your account secure, please click here to reset your password now. If you don't reset your password within 24 hours, your account will be locked. Click the link below to update your credentials and verify your identity."
  }
];

function loadSample(i) {
  const s = SAMPLES[i];
  document.getElementById("sender").value = s.sender;
  document.getElementById("replyto").value = s.replyto;
  document.getElementById("subject").value = s.subject;
  document.getElementById("body").value = s.body;
  window.location.hash = "#analyzer";
  setTimeout(runAnalysis, 100);
}

function renderSamples() {
  document.getElementById("sampleGrid").innerHTML = SAMPLES.map((s, i) => `
    <div class="sample-card" onclick="loadSample(${i})">
      <h3>${esc(s.label)}</h3>
      <p>${esc(s.body.slice(0,110))}…</p>
      <span class="sample-tag ${s.tagClass}">${s.tag}</span>
    </div>
  `).join("");
}

// ============================================================
// RENDER RULES
// ============================================================
function renderRules() {
  const entries = Object.entries(RED_FLAGS);
  document.getElementById("rulesGrid").innerHTML = entries.map(([name, rule]) => `
    <div class="rule-card">
      <div class="rule-num">${name.split("—")[0].trim()}</div>
      <h3>${name.split("—")[1]?.trim() || name}</h3>
      <p>${esc(rule.desc)}</p>
      <div class="chips">
        ${(rule.keywords || []).slice(0, 5).map(k => `<span class="chip">${esc(k)}</span>`).join("")}
        ${(rule.keywords || []).length > 5 ? `<span class="chip">+${(rule.keywords||[]).length - 5} more</span>` : ""}
        ${rule.check && !(rule.keywords||[]).length ? `<span class="chip">🔍 Pattern-based detection</span>` : ""}
      </div>
    </div>
  `).join("");
}

// ============================================================
// EDUCATION CARDS
// ============================================================
const EDU = [
  { icon: "🐟", title: "Spear Phishing", body: "Highly targeted attacks using personal info about the victim (name, role, colleagues) sourced from LinkedIn or data breaches. Far more convincing than generic phishing." },
  { icon: "💼", title: "BEC — Business Email Compromise", body: "Attacker impersonates a CEO, CFO, or vendor to authorize wire transfers or gift card purchases. BEC caused $2.9B in losses in 2023 alone (FBI IC3)." },
  { icon: "📞", title: "TOAD — Callback Phishing", body: "Email impersonates a subscription charge or tech alert to make victim call a fake support number. The phone agent then harvests credentials or installs remote access tools." },
  { icon: "📱", title: "MFA Fatigue / Push Bombing", body: "Attacker bombards the victim with MFA push notifications until they approve out of frustration. Then used in combination with stolen credentials." },
  { icon: "🔲", title: "Quishing (QR Phishing)", body: "QR codes bypass email link scanners and redirect mobile devices to credential harvesting pages. Increasingly used since 2023 as traditional URL filters improved." },
  { icon: "🤖", title: "AI-Generated Phishing", body: "LLMs can generate grammatically perfect phishing emails with personalized details, bypassing old detection signals like poor spelling. Deepfake audio/video adds another layer." },
  { icon: "🔤", title: "Homoglyph / Punycode Attacks", body: "Attackers replace characters with visually identical Unicode alternatives (е vs e) or register Punycode domains (xn--pple-43d.com for аpple.com) to fool the human eye." },
  { icon: "🪄", title: "Thread Hijacking", body: "Attacker compromises an inbox and replies to real email threads with malicious links, making the phishing look like a legitimate conversation continuation." },
];

function renderEdu() {
  document.getElementById("eduGrid").innerHTML = EDU.map(e => `
    <div class="edu-card">
      <div class="edu-icon">${e.icon}</div>
      <h3>${esc(e.title)}</h3>
      <p>${esc(e.body)}</p>
    </div>
  `).join("");
}

// INIT
renderSamples();
renderRules();
renderEdu();
