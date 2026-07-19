/**
 * Micro Learning Template API for Google Apps Script.
 *
 * วิธีใช้:
 * 1. สร้าง Google Sheet เปล่า
 * 2. Extensions > Apps Script แล้ววางไฟล์นี้
 * 3. Run: setupTemplate() หนึ่งครั้ง เพื่อสร้างชีตตัวอย่าง
 * 4. Deploy > New deployment > Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. นำ Web app URL ไปใส่ในไฟล์ js/app.js ของเว็บ GitHub Pages
 */

const SHEETS = {
  SETTINGS: 'Settings',
  LESSONS: 'Lessons',
  CONTENTS: 'Contents',
  QUESTIONS: 'Questions',
  LEARNERS: 'Learners',
  PROGRESS: 'Progress',
  RESPONSES: 'Responses',
  RESULTS: 'Results',
  ACTIVITY: 'ActivityLog'
};

const HEADERS = {
  Settings: ['Key', 'Value', 'Note'],
  Lessons: ['LessonID', 'Title', 'Description', 'CoverImageUrl', 'SortOrder', 'IsActive'],
  Contents: ['ContentID', 'LessonID', 'Type', 'Title', 'Body', 'Url', 'AttachmentUrl', 'SortOrder', 'IsRequired', 'IsActive'],
  Questions: ['QuestionID', 'QuizType', 'LessonID', 'Question', 'Choices', 'CorrectAnswer', 'Points', 'Explanation', 'SortOrder', 'IsActive'],
  Learners: ['LearnerID', 'FullName', 'Email', 'School', 'RegisteredAt', 'LastSeenAt'],
  Progress: ['LearnerID', 'ContentID', 'Status', 'UpdatedAt'],
  Responses: ['AttemptID', 'LearnerID', 'QuizType', 'QuestionID', 'Answer', 'Correct', 'Score', 'SubmittedAt'],
  Results: ['AttemptID', 'LearnerID', 'QuizType', 'TotalScore', 'MaxScore', 'Percent', 'Passed', 'SubmittedAt', 'PdfUrl'],
  ActivityLog: ['At', 'LearnerID', 'Action', 'Detail']
};

function setupTemplate() {
  const ss = SpreadsheetApp.getActive();
  Object.keys(HEADERS).forEach((name) => {
    const sheet = ss.getSheetByName(name) || ss.insertSheet(name);
    sheet.clear();
    sheet.getRange(1, 1, 1, HEADERS[name].length).setValues([HEADERS[name]]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS[name].length).setFontWeight('bold').setBackground('#e8f0fe');
  });

  rows_(SHEETS.SETTINGS, [
    ['CourseTitle', 'ชุดการเรียนรู้ Micro Learning', 'ชื่อรายวิชาหรือชุดการเรียนรู้'],
    ['CourseDescription', 'เรียนสั้น เข้าใจง่าย วัดผลได้รายบุคคล', 'คำอธิบายหน้าแรก'],
    ['TeacherName', 'ครูผู้สอน', 'ชื่อผู้สอน'],
    ['PassPercent', '70', 'เกณฑ์ผ่านแบบทดสอบหลังเรียน'],
    ['AdminKey', Utilities.getUuid().slice(0, 8), 'ใช้ดูรายงานรวมแบบไม่เปิดเผยในเว็บ'],
    ['Theme', 'indigo', 'ธีมสี: indigo, emerald, violet, amber, rose, minimal']
  ]);

  rows_(SHEETS.LESSONS, [
    ['L001', 'บทนำ', 'ทำความเข้าใจภาพรวมและเป้าหมายการเรียนรู้', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200', 1, true],
    ['L002', 'กิจกรรมฝึกปฏิบัติ', 'เรียนรู้ผ่านตัวอย่าง ใบงาน และแบบฝึกหัด', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200', 2, true]
  ]);

  rows_(SHEETS.CONTENTS, [
    ['C001', 'L001', 'text', 'วัตถุประสงค์ของชุดการเรียนรู้นี้', 'เมื่อเรียนจบ ผู้เรียนสามารถอธิบายแนวคิดหลัก ปฏิบัติตามใบงาน และสะท้อนผลการเรียนรู้ของตนเองได้', '', '', 1, true, true],
    ['C002', 'L001', 'youtube', 'คลิปประกอบการเรียนรู้', 'ชมคลิปสั้นแล้วจดประเด็นสำคัญ 3 ข้อ', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '', 2, true, true],
    ['C003', 'L002', 'image', 'ภาพตัวอย่างสถานการณ์', 'พิจารณาภาพและตอบคำถามในใบงาน', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200', '', 1, true, true],
    ['C004', 'L002', 'worksheet', 'ใบงานฝึกปฏิบัติ', 'ดาวน์โหลดใบงาน ทำกิจกรรม แล้วบันทึกคำตอบตามที่ครูกำหนด', '', 'https://docs.google.com/document/', 2, true, true]
  ]);

  rows_(SHEETS.QUESTIONS, [
    ['QPRE001', 'pre', '', 'ข้อใดคือจุดเด่นของ micro learning', 'เรียนเป็นช่วงสั้นๆ|ต้องเรียนทั้งวัน|ไม่มีการวัดผล|ใช้ได้เฉพาะวิดีโอ', 'เรียนเป็นช่วงสั้นๆ', 1, 'Micro learning เน้นบทเรียนสั้น กระชับ และมีเป้าหมายชัดเจน', 1, true],
    ['QPRE002', 'pre', '', 'ก่อนเรียนควรทำสิ่งใดเป็นอันดับแรก', 'ลงชื่อเรียน|ข้ามไปสอบหลังเรียน|ปิดหน้าเว็บ|ลบข้อมูล', 'ลงชื่อเรียน', 1, 'ระบบต้องรู้ตัวตนผู้เรียนเพื่อบันทึกผลรายบุคคล', 2, true],
    ['QPOST001', 'post', '', 'การออกแบบบทเรียนควรเริ่มจากสิ่งใด', 'วัตถุประสงค์|สีพื้นหลัง|จำนวนปุ่ม|ชื่อไฟล์', 'วัตถุประสงค์', 1, 'วัตถุประสงค์ช่วยกำหนดเนื้อหา กิจกรรม และการวัดผล', 1, true],
    ['QPOST002', 'post', '', 'ข้อมูลใดใช้ดูพัฒนาการรายบุคคลได้ดีที่สุด', 'คะแนนก่อนและหลังเรียน|ชื่อโรงเรียนเท่านั้น|สีที่ชอบ|เวลาเปิดเว็บอย่างเดียว', 'คะแนนก่อนและหลังเรียน', 1, 'คะแนนก่อน/หลังเรียนช่วยเปรียบเทียบผลการเรียนรู้', 2, true]
  ]);

  autoResizeAll_();
  return 'Template created. Deploy this Apps Script as a web app.';
}

function doGet(e) {
  return handleRequest_(e);
}

function doPost(e) {
  return handleRequest_(e);
}

function handleRequest_(e) {
  const params = (e && e.parameter) || {};
  const action = params.action || 'course';
  const callback = params.callback || '';
  let payload = {};

  try {
    payload = parsePayload_(e);
    const result = route_(action, payload, params);
    return output_(result, callback);
  } catch (err) {
    return output_({ ok: false, error: String(err && err.message ? err.message : err) }, callback);
  }
}

function route_(action, payload, params) {
  if (action === 'course') return getCourse_();
  if (action === 'register') return registerLearner_(payload);
  if (action === 'saveProgress') return saveProgress_(payload);
  if (action === 'submitQuiz') return submitQuiz_(payload);
  if (action === 'report') return getReport_(payload, params);
  if (action === 'exportPdf') return exportPdf_(payload, params);
  if (action === 'verifyAdmin') return verifyAdmin_(payload);
  if (action === 'saveAll') return saveAll_(payload);
  throw new Error('Unknown action: ' + action);
}

function getCourse_() {
  const settings = settings_();
  return {
    ok: true,
    settings,
    lessons: records_(SHEETS.LESSONS).filter(active_).sort(bySort_),
    contents: records_(SHEETS.CONTENTS).filter(active_).sort(bySort_),
    questions: records_(SHEETS.QUESTIONS).filter(active_).sort(bySort_).map((q) => ({
      QuestionID: q.QuestionID,
      QuizType: q.QuizType,
      LessonID: q.LessonID,
      Question: q.Question,
      Choices: splitChoices_(q.Choices),
      Points: Number(q.Points || 1),
      SortOrder: Number(q.SortOrder || 0)
    }))
  };
}

function registerLearner_(payload) {
  const fullName = required_(payload.fullName, 'FullName');
  const email = String(required_(payload.email, 'Email')).trim().toLowerCase();
  const school = payload.school || '';
  const now = new Date();
  const sheet = sheet_(SHEETS.LEARNERS);
  const data = records_(SHEETS.LEARNERS);
  const found = data.find((r) => String(r.Email).trim().toLowerCase() === email);

  if (found) {
    updateByKey_(SHEETS.LEARNERS, 'LearnerID', found.LearnerID, { FullName: fullName, School: school, LastSeenAt: now });
    log_(found.LearnerID, 'login', email);
    return { ok: true, learner: { learnerId: found.LearnerID, fullName, email, school } };
  }

  const learnerId = 'LRN-' + Utilities.getUuid().slice(0, 8).toUpperCase();
  sheet.appendRow([learnerId, fullName, email, school, now, now]);
  log_(learnerId, 'register', email);
  return { ok: true, learner: { learnerId, fullName, email, school } };
}

function saveProgress_(payload) {
  const learnerId = required_(payload.learnerId, 'LearnerID');
  const contentId = required_(payload.contentId, 'ContentID');
  const status = payload.status || 'done';
  const now = new Date();
  const existing = records_(SHEETS.PROGRESS).find((r) => r.LearnerID === learnerId && r.ContentID === contentId);

  if (existing) {
    const rowIndex = rowIndexByComposite_(SHEETS.PROGRESS, { LearnerID: learnerId, ContentID: contentId });
    sheet_(SHEETS.PROGRESS).getRange(rowIndex, 3, 1, 2).setValues([[status, now]]);
  } else {
    sheet_(SHEETS.PROGRESS).appendRow([learnerId, contentId, status, now]);
  }
  log_(learnerId, 'progress', contentId + ':' + status);
  return { ok: true };
}

function submitQuiz_(payload) {
  const learnerId = required_(payload.learnerId, 'LearnerID');
  const quizType = required_(payload.quizType, 'QuizType');
  const answers = payload.answers || [];
  const submittedAt = new Date();
  const attemptId = 'ATT-' + Utilities.getUuid().slice(0, 8).toUpperCase();
  const questions = records_(SHEETS.QUESTIONS).filter((q) => active_(q) && q.QuizType === quizType);
  const passPercent = Number(settings_().PassPercent || 70);
  let totalScore = 0;
  let maxScore = 0;

  const answerMap = {};
  answers.forEach((a) => {
    answerMap[a.questionId] = String(a.answer || '');
  });

  const responseRows = questions.map((q) => {
    const scoreMax = Number(q.Points || 1);
    const answer = answerMap[q.QuestionID] || '';
    const correct = normalize_(answer) === normalize_(q.CorrectAnswer);
    const score = correct ? scoreMax : 0;
    totalScore += score;
    maxScore += scoreMax;
    return [attemptId, learnerId, quizType, q.QuestionID, answer, correct, score, submittedAt];
  });

  if (responseRows.length) {
    appendRows_(SHEETS.RESPONSES, responseRows);
  }

  const percent = maxScore ? Math.round((totalScore / maxScore) * 10000) / 100 : 0;
  const passed = quizType === 'post' ? percent >= passPercent : '';
  sheet_(SHEETS.RESULTS).appendRow([attemptId, learnerId, quizType, totalScore, maxScore, percent, passed, submittedAt, '']);
  log_(learnerId, 'submitQuiz', quizType + ':' + percent);

  return { ok: true, attemptId, totalScore, maxScore, percent, passed };
}

function getReport_(payload, params) {
  const settings = settings_();
  const adminKey = String(payload.adminKey || params.adminKey || '');
  const learnerId = payload.learnerId || params.learnerId || '';
  const learners = records_(SHEETS.LEARNERS);
  const results = records_(SHEETS.RESULTS);
  const progress = records_(SHEETS.PROGRESS);
  const contents = records_(SHEETS.CONTENTS).filter(active_);

  const individual = learnerId ? buildIndividual_(learnerId, learners, results, progress, contents) : null;
  const overview = adminKey && adminKey === String(settings.AdminKey)
    ? buildOverview_(learners, results, progress, contents)
    : null;

  return { ok: true, individual, overview };
}

function exportPdf_(payload, params) {
  const settings = settings_();
  const type = payload.type || params.type || 'individual';
  const learnerId = payload.learnerId || params.learnerId || '';
  const adminKey = String(payload.adminKey || params.adminKey || '');
  const report = getReport_(payload, params);

  if (type === 'overview' && adminKey !== String(settings.AdminKey)) {
    throw new Error('Invalid AdminKey');
  }
  if (type === 'individual' && !report.individual) {
    throw new Error('Learner report not found');
  }

  const html = type === 'overview'
    ? overviewHtml_(settings, report.overview)
    : individualHtml_(settings, report.individual);
  const name = (type === 'overview' ? 'overview' : learnerId) + '-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmm') + '.pdf';
  const file = DriveApp.createFile(Utilities.newBlob(html, 'text/html', name + '.html').getAs(MimeType.PDF)).setName(name);

  if (type === 'individual') {
    const attempt = latestResult_(records_(SHEETS.RESULTS).filter((r) => r.LearnerID === learnerId && r.QuizType === 'post'));
    if (attempt) updateByKey_(SHEETS.RESULTS, 'AttemptID', attempt.AttemptID, { PdfUrl: file.getUrl() });
  }

  return { ok: true, url: file.getUrl(), fileId: file.getId() };
}

function buildIndividual_(learnerId, learners, results, progress, contents) {
  const learner = learners.find((l) => l.LearnerID === learnerId);
  if (!learner) return null;
  const learnerResults = results.filter((r) => r.LearnerID === learnerId);
  const done = progress.filter((p) => p.LearnerID === learnerId && p.Status === 'done').length;
  return {
    learner,
    pre: latestResult_(learnerResults.filter((r) => r.QuizType === 'pre')),
    post: latestResult_(learnerResults.filter((r) => r.QuizType === 'post')),
    progress: { done, total: contents.length, percent: contents.length ? Math.round((done / contents.length) * 100) : 0 }
  };
}

function buildOverview_(learners, results, progress, contents) {
  const summaries = learners.map((learner) => buildIndividual_(learner.LearnerID, learners, results, progress, contents));
  const postScores = summaries.map((s) => s && s.post ? Number(s.post.Percent || 0) : null).filter((n) => n !== null);
  const passed = summaries.filter((s) => s && s.post && String(s.post.Passed) === 'true').length;
  return {
    learnerCount: learners.length,
    completedPostCount: postScores.length,
    averagePostPercent: postScores.length ? Math.round((postScores.reduce((a, b) => a + b, 0) / postScores.length) * 100) / 100 : 0,
    passedCount: passed,
    summaries
  };
}

function individualHtml_(settings, report) {
  const learner = report.learner;
  return htmlPage_('รายงานผลรายบุคคล', `
    <h1>${esc_(settings.CourseTitle)}</h1>
    <h2>รายงานผลรายบุคคล</h2>
    <p><strong>ชื่อ:</strong> ${esc_(learner.FullName)} &nbsp; <strong>อีเมล:</strong> ${esc_(learner.Email)}</p>
    <p><strong>โรงเรียน:</strong> ${esc_(learner.School || '-')}</p>
    <table>
      <tr><th>รายการ</th><th>คะแนน</th><th>ร้อยละ</th><th>สถานะ</th></tr>
      <tr><td>ก่อนเรียน</td><td>${scoreText_(report.pre)}</td><td>${percentText_(report.pre)}</td><td>-</td></tr>
      <tr><td>หลังเรียน</td><td>${scoreText_(report.post)}</td><td>${percentText_(report.post)}</td><td>${report.post ? (String(report.post.Passed) === 'true' ? 'ผ่าน' : 'ยังไม่ผ่าน') : '-'}</td></tr>
      <tr><td>ความก้าวหน้าเนื้อหา</td><td>${report.progress.done}/${report.progress.total}</td><td>${report.progress.percent}%</td><td>-</td></tr>
    </table>
  `);
}

function overviewHtml_(settings, overview) {
  const rows = (overview.summaries || []).map((s) => `
    <tr>
      <td>${esc_(s.learner.FullName)}</td>
      <td>${esc_(s.learner.School || '-')}</td>
      <td>${percentText_(s.pre)}</td>
      <td>${percentText_(s.post)}</td>
      <td>${s.progress.percent}%</td>
      <td>${s.post ? (String(s.post.Passed) === 'true' ? 'ผ่าน' : 'ยังไม่ผ่าน') : '-'}</td>
    </tr>`).join('');
  return htmlPage_('รายงานภาพรวม', `
    <h1>${esc_(settings.CourseTitle)}</h1>
    <h2>รายงานภาพรวม</h2>
    <p>ผู้เรียนทั้งหมด ${overview.learnerCount} คน | ทำแบบทดสอบหลังเรียนแล้ว ${overview.completedPostCount} คน | ค่าเฉลี่ย ${overview.averagePostPercent}% | ผ่าน ${overview.passedCount} คน</p>
    <table>
      <tr><th>ชื่อ</th><th>โรงเรียน</th><th>ก่อนเรียน</th><th>หลังเรียน</th><th>ความก้าวหน้า</th><th>สถานะ</th></tr>
      ${rows}
    </table>
  `);
}

function htmlPage_(title, body) {
  return `
  <!doctype html><html><head><meta charset="utf-8">
  <style>
    body{font-family:Arial,"Noto Sans Thai",sans-serif;color:#1f2937;padding:32px}
    h1{font-size:24px;margin:0 0 8px} h2{font-size:18px;margin:0 0 20px;color:#2563eb}
    table{width:100%;border-collapse:collapse;margin-top:20px} th,td{border:1px solid #d1d5db;padding:8px;text-align:left}
    th{background:#eff6ff}
  </style></head><body><title>${esc_(title)}</title>${body}</body></html>`;
}

function settings_() {
  const out = {};
  records_(SHEETS.SETTINGS).forEach((r) => {
    out[r.Key] = r.Value;
  });
  return out;
}

function records_(name) {
  const sheet = sheet_(name);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0];
  return values.slice(1).filter((row) => row.some((cell) => cell !== '')).map((row) => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i];
    });
    return obj;
  });
}

function sheet_(name) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(name);
  if (!sheet) throw new Error('Missing sheet: ' + name + '. Run setupTemplate() first.');
  return sheet;
}

function rows_(name, rows) {
  appendRows_(name, rows);
}

function appendRows_(name, rows) {
  if (!rows.length) return;
  const sheet = sheet_(name);
  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
}

function parsePayload_(e) {
  const params = (e && e.parameter) || {};
  if (params.payload) {
    const padded = String(params.payload) + '==='.slice((String(params.payload).length + 3) % 4);
    const text = Utilities.newBlob(Utilities.base64DecodeWebSafe(padded)).getDataAsString();
    return JSON.parse(text);
  }
  if (e && e.postData && e.postData.contents) {
    return JSON.parse(e.postData.contents);
  }
  return params;
}

function output_(data, callback) {
  const json = JSON.stringify(data);
  const body = callback ? callback + '(' + json + ');' : json;
  return ContentService.createTextOutput(body).setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}

function updateByKey_(sheetName, keyName, keyValue, updates) {
  const sheet = sheet_(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const keyCol = headers.indexOf(keyName);
  if (keyCol < 0) throw new Error('Missing key column: ' + keyName);
  for (let r = 1; r < values.length; r++) {
    if (String(values[r][keyCol]) === String(keyValue)) {
      Object.keys(updates).forEach((name) => {
        const col = headers.indexOf(name);
        if (col >= 0) sheet.getRange(r + 1, col + 1).setValue(updates[name]);
      });
      return;
    }
  }
}

function rowIndexByComposite_(sheetName, keys) {
  const values = sheet_(sheetName).getDataRange().getValues();
  const headers = values[0];
  for (let r = 1; r < values.length; r++) {
    const match = Object.keys(keys).every((key) => String(values[r][headers.indexOf(key)]) === String(keys[key]));
    if (match) return r + 1;
  }
  throw new Error('Row not found');
}

function active_(row) {
  return row.IsActive === true || String(row.IsActive).toLowerCase() === 'true' || row.IsActive === 1;
}

function bySort_(a, b) {
  return Number(a.SortOrder || 0) - Number(b.SortOrder || 0);
}

function splitChoices_(text) {
  return String(text || '').split('|').map((x) => x.trim()).filter(Boolean);
}

function latestResult_(items) {
  return items.sort((a, b) => new Date(b.SubmittedAt).getTime() - new Date(a.SubmittedAt).getTime())[0] || null;
}

function required_(value, label) {
  if (value === undefined || value === null || value === '') throw new Error(label + ' is required');
  return value;
}

function normalize_(value) {
  return String(value || '').trim().toLowerCase();
}

function scoreText_(result) {
  return result ? result.TotalScore + '/' + result.MaxScore : '-';
}

function percentText_(result) {
  return result ? result.Percent + '%' : '-';
}

function esc_(value) {
  return String(value || '').replace(/[&<>"']/g, (s) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]));
}

function log_(learnerId, action, detail) {
  sheet_(SHEETS.ACTIVITY).appendRow([new Date(), learnerId, action, detail || '']);
}

function autoResizeAll_() {
  Object.keys(HEADERS).forEach((name) => {
    const sheet = sheet_(name);
    sheet.autoResizeColumns(1, HEADERS[name].length);
  });
}

function verifyAdmin_(payload) {
  const adminKey = String(payload.adminKey || '');
  const settings = settings_();
  return { ok: adminKey === String(settings.AdminKey) };
}

function saveAll_(payload) {
  const data = payload.data;
  const adminKey = payload.adminKey;
  const settings = settings_();
  if (!adminKey || adminKey !== String(settings.AdminKey)) {
    return { ok: false, error: 'AdminKey ไม่ถูกต้อง' };
  }
  const ss = SpreadsheetApp.getActive();
  const sets = ss.getSheetByName(SHEETS.SETTINGS);
  const setData = sets.getDataRange().getValues();
  const seenKeys = {};
  for (let r = 1; r < setData.length; r++) {
    const key = String(setData[r][0] || '');
    if (data.settings[key] !== undefined) {
      sets.getRange(r + 1, 2).setValue(String(data.settings[key]));
      seenKeys[key] = true;
    }
  }
  Object.keys(data.settings).forEach((key) => {
    if (!seenKeys[key]) sets.appendRow([key, String(data.settings[key]), '']);
  });
  saveSheetFromArray_(SHEETS.LESSONS, HEADERS.Lessons, data.lessons, (l, i) => [
    l.LessonID || 'L' + Utilities.getUuid().slice(0, 8).toUpperCase(),
    l.Title || '', l.Description || '', l.CoverImageUrl || '', i + 1, true
  ]);
  saveSheetFromArray_(SHEETS.CONTENTS, HEADERS.Contents, data.contents, (c, i) => [
    c.ContentID || 'C' + Utilities.getUuid().slice(0, 8).toUpperCase(),
    c.LessonID || '', c.Type || 'text', c.Title || '', c.Body || '',
    c.Url || '', c.AttachmentUrl || c.Url || '', i + 1, true, true
  ]);
  saveSheetFromArray_(SHEETS.QUESTIONS, HEADERS.Questions, data.questions, (q, i) => {
    const choices = Array.isArray(q.Choices) ? q.Choices.join('|') : String(q.Choices || '');
    return [
      q.QuestionID || 'Q' + Utilities.getUuid().slice(0, 8).toUpperCase(),
      q.QuizType || 'pre', q.LessonID || '', q.Question || '',
      choices, '', q.Points || 1, '', i + 1, true
    ];
  });
  return { ok: true, message: 'บันทึกข้อมูลทั้งหมดสำเร็จ' };
}

function saveSheetFromArray_(sheetName, headers, items, mapper) {
  const sheet = sheet_(sheetName);
  sheet.clearContents();
  const rows = items.map((item, i) => mapper(item, i));
  if (!rows.length) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    return;
  }
  sheet.getRange(1, 1, rows.length + 1, headers.length).setValues([headers].concat(rows));
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#e8f0fe');
}
