const API_URL = 'https://script.google.com/macros/s/AKfycbyo09GjBLJQ_-WG6Yzfqv0-fhvbQcNhkWDyGfleQG-boeQLmzjuaqeX2cv-LYKyI3SM/exec';

const state = {
  course: null,
  learner: null,
  reflection: ''
};

const els = {};

document.addEventListener('DOMContentLoaded', init);

async function init() {
  cacheEls();
  bindEvents();
  state.course = await api('course');
  renderCourseInfo();
  applyTheme();
}

function cacheEls() {
  els.courseTitle = document.getElementById('courseTitle');
  els.courseDescription = document.getElementById('courseDescription');
  els.teacherName = document.getElementById('teacherName');
  els.loginForm = document.getElementById('loginForm');
  els.fullName = document.getElementById('fullName');
  els.classroom = document.getElementById('classroom');
  els.registerBtn = document.getElementById('registerBtn');
  els.objectivesContent = document.getElementById('objectivesContent');
  els.objOkBtn = document.getElementById('objOkBtn');
  els.preTestForm = document.getElementById('preTestForm');
  els.lessonContent = document.getElementById('lessonContent');
  els.reflectionInput = document.getElementById('reflectionInput');
  els.finishBtn = document.getElementById('finishBtn');
  els.postTestForm = document.getElementById('postTestForm');
  els.myReport = document.getElementById('myReport');
  els.overviewBtn = document.getElementById('overviewBtn');
  els.overviewReport = document.getElementById('overviewReport');
  els.homeBtn = document.getElementById('homeBtn');
  els.restartBtn = document.getElementById('restartBtn');
  els.exitBtn = document.getElementById('exitBtn');
  els.adminBtn = document.getElementById('adminBtn');
  els.adminCloseBtn = document.getElementById('adminCloseBtn');
  els.adminSaveBtn = document.getElementById('adminSaveBtn');
  els.adminSettings = document.getElementById('adminSettings');
  els.adminLessons = document.getElementById('adminLessons');
  els.adminContents = document.getElementById('adminContents');
  els.adminQuestions = document.getElementById('adminQuestions');
  els.toast = document.getElementById('toast');
  els.progressSteps = document.querySelectorAll('.progress-step');
  els.adminTabs = document.querySelectorAll('.admin-tab');
}

function bindEvents() {
  els.registerBtn.addEventListener('click', onLogin);
  els.fullName.addEventListener('keydown', enterToNext);
  els.classroom.addEventListener('keydown', enterToNext);
  els.objOkBtn.addEventListener('click', () => goToStep(3));
  els.preTestForm.addEventListener('submit', submitPreTest);
  els.finishBtn.addEventListener('click', finishLearning);
  els.postTestForm.addEventListener('submit', submitPostTest);
  els.overviewBtn.addEventListener('click', () => goToStep(7));
  els.homeBtn.addEventListener('click', goHome);
  els.restartBtn.addEventListener('click', restartLearning);
  els.exitBtn.addEventListener('click', exitLearning);
  els.adminBtn.addEventListener('click', openAdmin);
  els.adminCloseBtn.addEventListener('click', closeAdmin);
  els.adminSaveBtn.addEventListener('click', saveAllData);
  els.adminTabs.forEach(tab => {
    tab.addEventListener('click', () => switchAdminTab(tab.dataset.tab));
  });
  els.reflectionInput.addEventListener('input', () => {
    state.reflection = els.reflectionInput.value;
    const len = state.reflection.trim().length;
    document.getElementById('charCount').textContent = len;
  });
}

function renderCourseInfo() {
  const s = state.course.settings;
  els.courseTitle.textContent = s.CourseTitle || 'Micro Learning';
  els.courseDescription.textContent = s.CourseDescription || '';
  els.teacherName.textContent = s.TeacherName || '';
  document.title = s.CourseTitle || 'Micro Learning';
}

function applyTheme() {
  const theme = state.course?.settings?.Theme || 'indigo';
  document.body.className = 'theme-' + theme;
}

function goToStep(n) {
  document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
  const target = document.getElementById('step' + n);
  if (!target) return;
  target.classList.add('active');
  window.scrollTo({ top: 0 });
  updateProgress(n);
  if (!state.course && n >= 2) {
    els.objectivesContent.innerHTML = '<p class="empty-msg">กำลังโหลดข้อมูล...</p>';
    return;
  }
  if (n === 2) renderObjectives();
  else if (n === 3) openQuiz('pre', els.preTestForm);
  else if (n === 4) renderLearningRoom();
  else if (n === 5) openQuiz('post', els.postTestForm);
  else if (n === 6) loadMyReport();
  else if (n === 7) loadOverview();
}

function updateProgress(current) {
  els.progressSteps.forEach(el => {
    const step = parseInt(el.dataset.step);
    el.classList.toggle('active', step === current);
    el.classList.toggle('done', step < current);
  });
}

function enterToNext(e) {
  if (e.key === 'Enter') {
    if (e.target.id === 'fullName') els.classroom.focus();
    else if (e.target.id === 'classroom') els.registerBtn.click();
  }
}

async function onLogin() {
  const name = els.fullName.value.trim();
  const room = els.classroom.value.trim();
  if (!name || !room) {
    toast('กรุณากรอกชื่อ-สกุล และห้องเรียน');
    if (!name) els.fullName.focus();
    else els.classroom.focus();
    return;
  }
  if (!state.course) {
    toast('กำลังโหลดข้อมูล กรุณารอสักครู่');
    return;
  }
  const payload = {
    fullName: name,
    school: room,
    email: name.replace(/\s+/g, '') + '@learner.local'
  };
  await withButtonLoading(els.registerBtn, 'กำลังลงทะเบียน...', async () => {
    const result = await api('register', payload);
    state.learner = result.learner;
    await alertBox('ลงทะเบียนเรียบร้อย', 'ยินดีต้อนรับ สู่การเรียนรู้', 'success');
    goToStep(2);
  });
}

function renderObjectives() {
  const contents = state.course.contents || [];
  const textContent = contents.find(c => c.Type === 'text');
  els.objectivesContent.innerHTML = `
    <div class="obj-icon">&#x1F4D6;</div>
    <h3>${escapeHtml(textContent ? textContent.Title : 'วัตถุประสงค์การเรียนรู้')}</h3>
    <p>${escapeHtml(textContent ? textContent.Body : state.course.settings.CourseDescription || '')}</p>
  `;
}

function openQuiz(type, formEl) {
  const label = type === 'pre' ? 'ก่อนเรียน' : 'หลังเรียน';
  const questions = state.course.questions.filter(q => q.QuizType === type);
  if (!questions.length) {
    formEl.innerHTML = `<p class="empty-msg">ไม่มีแบบทดสอบ${label}</p>`;
    return;
  }
  formEl.innerHTML = questions.map((q, i) => `
    <div class="question">
      <div class="q-header">
        <span class="q-num">${i + 1}</span>
        <h3>${escapeHtml(q.Question)}</h3>
      </div>
      <div class="choices">
        ${q.Choices.map(c => `
          <label class="choice">
            <input type="radio" name="${escapeAttr(q.QuestionID)}" value="${escapeAttr(c)}" required>
            <span class="choice-mark"></span>
            <span>${escapeHtml(c)}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `).join('') + '<button type="submit" class="btn-primary btn-full">&#x270F;&#xFE0F; ส่งคำตอบ</button>';
}

async function submitPreTest(event) {
  event.preventDefault();
  const btn = event.submitter || els.preTestForm.querySelector('button');
  await submitQuiz(btn, 'pre');
  goToStep(4);
}

async function submitPostTest(event) {
  event.preventDefault();
  const btn = event.submitter || els.postTestForm.querySelector('button');
  await submitQuiz(btn, 'post');
  goToStep(6);
}

async function submitQuiz(button, quizType) {
  const questions = state.course.questions.filter(q => q.QuizType === quizType);
  const form = quizType === 'pre' ? els.preTestForm : els.postTestForm;
  const formData = new FormData(form);
  const answers = questions.map(q => ({
    questionId: q.QuestionID,
    answer: formData.get(q.QuestionID) || ''
  }));
  await withButtonLoading(button, 'กำลังส่ง...', async () => {
    const result = await api('submitQuiz', {
      learnerId: state.learner.learnerId,
      quizType,
      answers
    });
    const status = quizType === 'post'
      ? (result.passed ? 'ผ่านเกณฑ์' : 'ยังไม่ผ่านเกณฑ์')
      : 'บันทึกคะแนนก่อนเรียนแล้ว';
    const icon = result.passed === false ? 'warning' : 'success';
    await alertBox('ส่งคำตอบแล้ว', `คุณได้ ${result.percent}% (${status})`, icon);
  });
}

function renderLearningRoom() {
  const lessons = state.course.lessons || [];
  const contents = state.course.contents || [];
  els.lessonContent.innerHTML = lessons.map(lesson => {
    const lessonContents = contents.filter(c => c.LessonID === lesson.LessonID);
    return `
      <div class="lesson-block">
        <div class="lesson-header">
          <div class="lesson-icon">&#x1F4DA;</div>
          <div>
            <h3>${escapeHtml(lesson.Title)}</h3>
            ${lesson.Description ? `<p class="lesson-desc">${escapeHtml(lesson.Description)}</p>` : ''}
          </div>
        </div>
        ${lessonContents.map(renderContentItem).join('')}
      </div>
    `;
  }).join('');
  els.reflectionInput.value = state.reflection || '';
}

function renderContentItem(item) {
  const media = mediaFor(item);
  const iconMap = { text: '&#x1F4C4;', youtube: '&#x1F3AC;', image: '&#x1F5BC;&#xFE0F;', file: '&#x1F4C1;', worksheet: '&#x1F4DD;' };
  const icon = iconMap[item.Type] || '&#x1F4C4;';
  return `
    <div class="content-item">
      <div class="content-icon">${icon}</div>
      <div class="content-body">
        <h4>${escapeHtml(item.Title)}</h4>
        ${item.Body ? `<p>${escapeHtml(item.Body)}</p>` : ''}
        ${media}
      </div>
    </div>
  `;
}

function mediaFor(item) {
  if (item.Type === 'youtube' && item.Url) {
    const id = youtubeId(item.Url);
    return id ? `<div class="media-wrapper"><iframe class="youtube-frame" src="https://www.youtube.com/embed/${id}" allowfullscreen></iframe></div>` : '';
  }
  if (item.Type === 'image' && item.Url) {
    return `<div class="media-wrapper"><img class="content-image" src="${escapeAttr(item.Url)}" alt="${escapeAttr(item.Title)}"></div>`;
  }
  if ((item.Type === 'file' || item.Type === 'worksheet') && item.AttachmentUrl) {
    return `<a class="file-link" href="${escapeAttr(item.AttachmentUrl)}" target="_blank" rel="noopener">&#x1F4CE; เปิดไฟล์ประกอบ</a>`;
  }
  return '';
}

async function finishLearning() {
  const text = (els.reflectionInput.value || '').trim();
  if (text.length < 20) {
    toast('กรุณาเขียนสะท้อนคิดอย่างน้อย 20 ตัวอักษร');
    els.reflectionInput.focus();
    return;
  }
  await alertBox('&#x2705; บันทึกการเรียนรู้แล้ว', 'คุณได้เรียนรู้ครบทุกเนื้อหาแล้ว ไปทำแบบทดสอบหลังเรียนกัน!', 'success');
  goToStep(5);
}

async function loadMyReport() {
  if (!state.learner) return;
  const result = await api('report', { learnerId: state.learner.learnerId });
  renderIndividual(result.individual);
}

function calcImprovement(pre, post) {
  if (!pre || !post) return { diff: null, normGain: null };
  const prePct = pre.Percent;
  const postPct = post.Percent;
  const diff = postPct - prePct;
  const normGain = prePct < 100 ? Math.round((postPct - prePct) / (100 - prePct) * 100) : 0;
  return { diff, normGain };
}

function renderIndividual(report) {
  if (!report) {
    els.myReport.innerHTML = '<p class="empty-msg">ยังไม่มีข้อมูล</p>';
    return;
  }
  const passed = report.post ? (String(report.post.Passed) === 'true') : false;
  const imp = calcImprovement(report.pre, report.post);
  const impDiff = imp.diff !== null ? `${imp.diff >= 0 ? '+' : ''}${imp.diff}` : '-';
  const impGain = imp.normGain !== null ? `Gain ${imp.normGain}%` : (report.pre ? 'รอสอบหลังเรียน' : 'รอสอบ');
  const impClass = imp.diff === null ? '' : (imp.diff >= 20 ? 'metric-green' : (imp.diff >= 0 ? 'metric-blue' : 'metric-orange'));
  els.myReport.innerHTML = `
    <div class="metrics">
      <div class="metric metric-blue">
        <div class="metric-icon">&#x1F4DD;</div>
        <span>ก่อนเรียน</span>
        <strong>${percent(report.pre)}</strong>
      </div>
      <div class="metric metric-green">
        <div class="metric-icon">&#x1F4CA;</div>
        <span>หลังเรียน</span>
        <strong>${percent(report.post)}</strong>
      </div>
      <div class="metric ${impClass || 'metric-purple'}">
        <div class="metric-icon">&#x1F4C8;</div>
        <span>คะแนนพัฒนา</span>
        <strong>${impDiff}</strong>
        <small>${impGain}</small>
      </div>
      <div class="metric ${passed ? 'metric-green' : 'metric-orange'}">
        <div class="metric-icon">${passed ? '&#x2705;' : '&#x23F3;'}</div>
        <span>สถานะ</span>
        <strong>${passed ? 'ผ่าน' : 'ยังไม่ผ่าน'}</strong>
      </div>
    </div>
    ${report.reflection ? `<div class="reflection-note"><strong>&#x1F4AD; สะท้อนคิด:</strong> ${escapeHtml(report.reflection)}</div>` : ''}
  `;
}

async function loadOverview() {
  const adminKey = state.course?.settings?.AdminKey;
  if (!adminKey) {
    els.overviewReport.innerHTML = '<p class="empty-msg">ไม่พบข้อมูล</p>';
    return;
  }
  const result = await api('report', { adminKey });
  if (!result.overview) {
    els.overviewReport.innerHTML = '<p class="empty-msg">ยังไม่มีข้อมูลผู้เรียน</p>';
    return;
  }
  renderOverview(result.overview);
}

function renderOverview(overview) {
  const rows = overview.summaries.map(item => {
    const imp = calcImprovement(item.pre, item.post);
    const impStr = imp.diff !== null ? `${imp.diff >= 0 ? '+' : ''}${imp.diff}` : '-';
    return `
    <tr>
      <td>${escapeHtml(item.learner.FullName)}</td>
      <td>${escapeHtml(item.learner.SubdistrictCenter || item.learner.School || '-')}</td>
      <td class="num">${percent(item.pre)}</td>
      <td class="num">${percent(item.post)}</td>
      <td class="num">${impStr}</td>
      <td class="status">${item.post ? (String(item.post.Passed) === 'true' ? '&#x2705; ผ่าน' : '&#x274C; ไม่ผ่าน') : '-'}</td>
    </tr>`;
  }).join('');
  els.overviewReport.innerHTML = `
    <div class="metrics">
      <div class="metric metric-blue">
        <div class="metric-icon">&#x1F465;</div>
        <span>ผู้เรียนทั้งหมด</span>
        <strong>${overview.learnerCount}</strong>
      </div>
      <div class="metric metric-green">
        <div class="metric-icon">&#x2705;</div>
        <span>ส่งหลังเรียน</span>
        <strong>${overview.completedPostCount}</strong>
      </div>
      <div class="metric metric-purple">
        <div class="metric-icon">&#x1F4C8;</div>
        <span>ค่าเฉลี่ย</span>
        <strong>${overview.averagePostPercent}%</strong>
      </div>
      <div class="metric metric-green">
        <div class="metric-icon">&#x1F3C6;</div>
        <span>ผ่านเกณฑ์</span>
        <strong>${overview.passedCount}</strong>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>ชื่อ</th><th>ศกร.</th><th>ก่อนเรียน</th><th>หลังเรียน</th><th>พัฒนา</th><th>สถานะ</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function percent(result) {
  return result ? `${result.Percent}%` : '-';
}

function goHome() {
  goToStep(1);
}

function restartLearning() {
  goToStep(2);
  renderObjectives();
}

function exitLearning() {
  state.learner = null;
  state.reflection = '';
  els.fullName.value = '';
  els.classroom.value = '';
  goToStep(1);
  renderCourseInfo();
}

/* === Admin Panel === */
let adminData = null;
let adminPassword = '';

async function openAdmin() {
  if (!state.course?.settings?.AdminKey) {
    toast('ไม่พบ AdminKey ในระบบ');
    return;
  }
  const { value: pw, isConfirmed } = await Swal.fire({
    title: 'รหัสผ่านผู้ดูแล',
    text: 'กรอกรหัสผ่านเพื่อเข้าใช้งาน',
    input: 'password',
    inputPlaceholder: 'รหัสผ่าน',
    confirmButtonText: 'เข้าสู่ระบบ',
    showCancelButton: true,
    cancelButtonText: 'ยกเลิก',
    inputValidator: v => v ? null : 'กรุณากรอกรหัสผ่าน'
  });
  if (!isConfirmed || !pw) return;
  const result = await api('verifyAdmin', { adminKey: pw });
  if (!result.ok) {
    await alertBox('รหัสผ่านไม่ถูกต้อง', 'กรุณาลองอีกครั้ง', 'error');
    return;
  }
  adminPassword = pw;
  if (!adminData) adminData = JSON.parse(JSON.stringify(state.course));
  renderAdminTabs();
  document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
  document.getElementById('step8').classList.add('active');
  switchAdminTab('settings');
}

function closeAdmin() {
  adminData = null;
  document.getElementById('step8').classList.remove('active');
  const activeStep = document.querySelector('.step.active');
  if (!activeStep) document.getElementById('step1').classList.add('active');
}

function switchAdminTab(name) {
  els.adminTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('admin' + name.charAt(0).toUpperCase() + name.slice(1)).classList.add('active');
  if (name === 'lessons') renderAdminLessons();
  else if (name === 'contents') renderAdminContents();
  else if (name === 'questions') renderAdminQuestions();
}

function renderAdminTabs() {
  renderAdminSettings();
}

const THEMES = [
  { id: 'indigo', label: 'Indigo', color: '#6366f1' },
  { id: 'emerald', label: 'Emerald', color: '#10b981' },
  { id: 'violet', label: 'Violet', color: '#8b5cf6' },
  { id: 'amber', label: 'Amber', color: '#f59e0b' },
  { id: 'rose', label: 'Rose', color: '#f43f5e' }
];

function renderAdminSettings() {
  const s = adminData.settings;
  const currentTheme = s.Theme || 'indigo';
  els.adminSettings.innerHTML = `
    <div class="field"><label>ชื่อรายวิชา</label><input id="adCourseTitle" value="${escapeAttr(s.CourseTitle || '')}"></div>
    <div class="field"><label>คำอธิบาย</label><input id="adCourseDesc" value="${escapeAttr(s.CourseDescription || '')}"></div>
    <div class="field"><label>ชื่อครู</label><input id="adTeacher" value="${escapeAttr(s.TeacherName || '')}"></div>
    <div class="field"><label>เกณฑ์ผ่าน (%)</label><input id="adPass" type="number" value="${s.PassPercent || 70}"></div>
    <div class="field"><label>AdminKey</label><input id="adAdminKey" value="${escapeAttr(s.AdminKey || '')}" readonly style="background:#f3f4f6;color:#6b7280"></div>
    <div class="theme-picker">
      <label>ธีมสี</label>
      <div class="theme-options">
        ${THEMES.map(t => `
          <button class="theme-btn${t.id === currentTheme ? ' active' : ''}" data-theme="${t.id}" title="${t.label}" style="background:${t.color}"></button>
        `).join('')}
      </div>
    </div>
  `;
  els.adminSettings.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      els.adminSettings.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      adminData.settings.Theme = btn.dataset.theme;
      document.body.className = 'theme-' + btn.dataset.theme;
    });
  });
}

function renderAdminLessons() {
  const lessons = adminData.lessons || [];
  els.adminLessons.innerHTML = lessons.map((l, i) => `
    <div class="admin-item">
      <div class="field"><label>ชื่อบทเรียน</label><input class="ad-lesson-title" value="${escapeAttr(l.Title)}"></div>
      <div class="field"><label>คำอธิบาย</label><input class="ad-lesson-desc" value="${escapeAttr(l.Description || '')}"></div>
      <div class="field"><label>URL ปก</label><input class="ad-lesson-cover" value="${escapeAttr(l.CoverImageUrl || '')}"></div>
      <button class="btn-outline ad-del" data-idx="${i}">&#x1F5D1; ลบ</button>
    </div>
  `).join('') + '<button id="adAddLesson" class="btn-outline">&#x2795; เพิ่มบทเรียน</button>';
  document.querySelectorAll('.ad-del').forEach(b => b.addEventListener('click', () => {
    adminData.lessons.splice(parseInt(b.dataset.idx), 1);
    renderAdminLessons();
  }));
  document.getElementById('adAddLesson')?.addEventListener('click', () => {
    adminData.lessons.push({ LessonID: 'L' + Date.now(), Title: '', Description: '', CoverImageUrl: '' });
    renderAdminLessons();
  });
}

function renderAdminContents() {
  const contents = adminData.contents || [];
  els.adminContents.innerHTML = contents.map((c, i) => `
    <div class="admin-item">
      <div class="field"><label>ชื่อเนื้อหา</label><input class="ad-cont-title" value="${escapeAttr(c.Title)}"></div>
      <div class="field"><label>ประเภท</label>
        <select class="ad-cont-type">
          ${['text','youtube','image','worksheet'].map(t => `<option ${c.Type === t ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
      </div>
      <div class="field"><label>เนื้อหา (Body)</label><textarea class="ad-cont-body" rows="2">${escapeHtml(c.Body || '')}</textarea></div>
      <div class="field"><label>URL/Link</label><input class="ad-cont-url" value="${escapeAttr(c.Url || '')}"></div>
      <button class="btn-outline ad-del" data-idx="${i}">&#x1F5D1; ลบ</button>
    </div>
  `).join('') + '<button id="adAddContent" class="btn-outline">&#x2795; เพิ่มเนื้อหา</button>';
  document.querySelectorAll('#adminContents .ad-del').forEach(b => b.addEventListener('click', () => {
    adminData.contents.splice(parseInt(b.dataset.idx), 1);
    renderAdminContents();
  }));
  document.getElementById('adAddContent')?.addEventListener('click', () => {
    adminData.contents.push({ ContentID: 'C' + Date.now(), LessonID: '', Type: 'text', Title: '', Body: '', Url: '', AttachmentUrl: '' });
    renderAdminContents();
  });
}

function renderAdminQuestions() {
  const questions = adminData.questions || [];
  els.adminQuestions.innerHTML = questions.map((q, i) => `
    <div class="admin-item">
      <div class="field"><label>คำถาม</label><input class="ad-q-text" value="${escapeAttr(q.Question)}"></div>
      <div class="field"><label>ประเภท</label>
        <select class="ad-q-type">
          ${['pre','post'].map(t => `<option ${q.QuizType === t ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
      </div>
      <div class="field"><label>ตัวเลือก (คั่นด้วย | )</label><input class="ad-q-choices" value="${escapeAttr((q.Choices || []).join(' | '))}"></div>
      <button class="btn-outline ad-del" data-idx="${i}">&#x1F5D1; ลบ</button>
    </div>
  `).join('') + '<button id="adAddQuestion" class="btn-outline">&#x2795; เพิ่มคำถาม</button>';
  document.querySelectorAll('#adminQuestions .ad-del').forEach(b => b.addEventListener('click', () => {
    adminData.questions.splice(parseInt(b.dataset.idx), 1);
    renderAdminQuestions();
  }));
  document.getElementById('adAddQuestion')?.addEventListener('click', () => {
    adminData.questions.push({ QuestionID: 'Q' + Date.now(), QuizType: 'pre', Question: '', Choices: ['ตัวเลือก1','ตัวเลือก2'], Points: 1 });
    renderAdminQuestions();
  });
}

function collectAdminData() {
  const s = adminData.settings;
  s.CourseTitle = document.getElementById('adCourseTitle')?.value || s.CourseTitle;
  s.CourseDescription = document.getElementById('adCourseDesc')?.value || s.CourseDescription;
  s.TeacherName = document.getElementById('adTeacher')?.value || s.TeacherName;
  s.PassPercent = parseInt(document.getElementById('adPass')?.value) || 70;
  s.AdminKey = document.getElementById('adAdminKey')?.value || s.AdminKey;

  document.querySelectorAll('#adminLessons .admin-item').forEach((item, i) => {
    const l = adminData.lessons[i];
    if (!l) return;
    l.Title = item.querySelector('.ad-lesson-title')?.value || l.Title;
    l.Description = item.querySelector('.ad-lesson-desc')?.value || l.Description;
    l.CoverImageUrl = item.querySelector('.ad-lesson-cover')?.value || l.CoverImageUrl;
  });

  document.querySelectorAll('#adminContents .admin-item').forEach((item, i) => {
    const c = adminData.contents[i];
    if (!c) return;
    c.Title = item.querySelector('.ad-cont-title')?.value || c.Title;
    c.Type = item.querySelector('.ad-cont-type')?.value || c.Type;
    c.Body = item.querySelector('.ad-cont-body')?.value || c.Body;
    c.Url = item.querySelector('.ad-cont-url')?.value || c.Url;
    c.AttachmentUrl = c.Url;
  });

  document.querySelectorAll('#adminQuestions .admin-item').forEach((item, i) => {
    const q = adminData.questions[i];
    if (!q) return;
    q.Question = item.querySelector('.ad-q-text')?.value || q.Question;
    q.QuizType = item.querySelector('.ad-q-type')?.value || q.QuizType;
    q.Choices = (item.querySelector('.ad-q-choices')?.value || '').split('|').map(s => s.trim()).filter(Boolean);
  });
}

async function saveAllData() {
  collectAdminData();
  const key = adminPassword || adminData.settings.AdminKey;
  if (!key) { toast('กรุณาใส่ AdminKey'); return; }
  els.adminSaveBtn.disabled = true;
  els.adminSaveBtn.textContent = 'กำลังบันทึก...';
  try {
    const res = await api('saveAll', { adminKey: key, data: adminData });
    if (!res.ok) throw new Error(res.error || 'บันทึกไม่สำเร็จ');
    state.course = JSON.parse(JSON.stringify(adminData));
    renderCourseInfo();
    applyTheme();
    await alertBox('&#x2705; บันทึกสำเร็จ', 'ข้อมูลทั้งหมดอัปเดตแล้ว', 'success');
  } catch (e) {
    await alertBox('&#x274C; ไม่สำเร็จ', e.message || 'ลองใหม่อีกครั้ง', 'error');
  } finally {
    els.adminSaveBtn.disabled = false;
    els.adminSaveBtn.textContent = '&#x1F4BE; บันทึกข้อมูลทั้งหมด';
  }
}

async function api(action, payload = {}) {
  return jsonp(API_URL, { action, payload });
}

function jsonp(url, data) {
  return new Promise((resolve, reject) => {
    const callback = `ml_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const script = document.createElement('script');
    const params = new URLSearchParams({
      action: data.action,
      callback,
      payload: btoa(unescape(encodeURIComponent(JSON.stringify(data.payload || {}))))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    });
    window[callback] = response => {
      cleanup();
      if (!response || response.ok === false) reject(new Error(response && response.error ? response.error : 'API error'));
      else resolve(response);
    };
    script.onerror = () => { cleanup(); reject(new Error('Cannot connect to API')); };
    script.src = `${url}?${params.toString()}`;
    document.body.appendChild(script);
    function cleanup() { delete window[callback]; script.remove(); }
  });
}

function youtubeId(url) {
  const match = String(url).match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
  return match ? match[1] : '';
}

function toast(message) {
  if (window.Swal) {
    Swal.fire({ toast: true, position: 'top-end', icon: 'info', title: message, showConfirmButton: false, timer: 2400, timerProgressBar: true });
    return;
  }
  els.toast.textContent = message;
  els.toast.classList.add('show');
  setTimeout(() => els.toast.classList.remove('show'), 2800);
}

function alertBox(title, text, icon = 'info') {
  if (window.Swal) {
    return Swal.fire({
      title, text, icon,
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#6366f1',
      background: '#1e1e2f',
      color: '#e2e8f0'
    });
  }
  toast(`${title}: ${text}`);
  return Promise.resolve();
}

async function withButtonLoading(button, loadingText, task) {
  if (!button) return task();
  const original = button.textContent;
  button.disabled = true;
  button.innerHTML = `<span class="spinner"></span> ${loadingText}`;
  try { return await task(); } catch (error) {
    await alertBox('ไม่สำเร็จ', error.message || 'ลองใหม่อีกครั้ง', 'error');
  } finally {
    button.disabled = false;
    button.textContent = original;
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}
