const API_URL = 'https://script.google.com/macros/s/AKfycbyo09GjBLJQ_-WG6Yzfqv0-fhvbQcNhkWDyGfleQG-boeQLmzjuaqeX2cv-LYKyI3SM/exec';

const state = {
  course: null,
  learner: JSON.parse(localStorage.getItem('microLearner') || 'null'),
  currentQuiz: null,
  adminKey: ''
};

const els = {
  courseTitle: document.querySelector('#courseTitle'),
  courseDescription: document.querySelector('#courseDescription'),
  teacherName: document.querySelector('#teacherName'),
  loginForm: document.querySelector('#loginForm'),
  loginStatus: document.querySelector('#loginStatus'),
  lessons: document.querySelector('#lessons'),
  preQuizBtn: document.querySelector('#preQuizBtn'),
  postQuizBtn: document.querySelector('#postQuizBtn'),
  backToLearn: document.querySelector('#backToLearn'),
  quizForm: document.querySelector('#quizForm'),
  quizLabel: document.querySelector('#quizLabel'),
  quizTitle: document.querySelector('#quizTitle'),
  myReport: document.querySelector('#myReport'),
  adminForm: document.querySelector('#adminForm'),
  overviewReport: document.querySelector('#overviewReport'),
  exportMyPdf: document.querySelector('#exportMyPdf'),
  exportOverviewPdf: document.querySelector('#exportOverviewPdf'),
  toast: document.querySelector('#toast')
};

document.addEventListener('DOMContentLoaded', init);

async function init() {
  bindEvents();
  if (API_URL.includes('PASTE_YOUR')) {
    toast('กรุณาใส่ Web app URL ใน app.js ก่อนใช้งานจริง');
  }
  state.course = await api('course');
  renderCourse();
  renderLoginState();
}

function bindEvents() {
  els.loginForm.addEventListener('submit', onLogin);
  els.preQuizBtn.addEventListener('click', () => openQuiz('pre'));
  els.postQuizBtn.addEventListener('click', () => openQuiz('post'));
  els.backToLearn.addEventListener('click', () => showView('learn'));
  els.quizForm.addEventListener('submit', submitQuiz);
  els.adminForm.addEventListener('submit', loadOverview);
  els.exportMyPdf.addEventListener('click', exportMyPdf);
  els.exportOverviewPdf.addEventListener('click', exportOverviewPdf);

  document.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => {
      const view = button.dataset.view;
      if (view === 'report') loadMyReport();
      if (view === 'admin') showView('admin');
      if (view === 'learn') showView('learn');
    });
  });
}

async function onLogin(event) {
  event.preventDefault();
  const button = event.submitter || els.loginForm.querySelector('button[type="submit"]');
  const form = new FormData(els.loginForm);
  const payload = Object.fromEntries(form.entries());
  await withButtonLoading(button, 'กำลังลงชื่อ...', async () => {
    const result = await api('register', payload);
    state.learner = result.learner;
    localStorage.setItem('microLearner', JSON.stringify(state.learner));
    renderLoginState();
    await alertBox('ลงชื่อเรียนเรียบร้อย', `เข้าสู่บทเรียนในชื่อ ${state.learner.fullName}`, 'success');
  });
}

function renderCourse() {
  const { settings, lessons, contents } = state.course;
  els.courseTitle.textContent = settings.CourseTitle || 'ชุดการเรียนรู้ออนไลน์';
  els.courseDescription.textContent = settings.CourseDescription || '';
  els.teacherName.textContent = settings.TeacherName || '';
  document.title = settings.CourseTitle || 'Micro Learning Template';

  els.lessons.innerHTML = lessons.map((lesson) => {
    const lessonContents = contents.filter((item) => item.LessonID === lesson.LessonID);
    return `
      <article class="lesson">
        <img src="${escapeAttr(lesson.CoverImageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200')}" alt="">
        <div class="lesson-body">
          <h3>${escapeHtml(lesson.Title)}</h3>
          <p class="muted">${escapeHtml(lesson.Description || '')}</p>
          <div class="content-list">
            ${lessonContents.map(renderContent).join('')}
          </div>
        </div>
      </article>
    `;
  }).join('');

  document.querySelectorAll('[data-content-id]').forEach((button) => {
    button.addEventListener('click', () => markDone(button.dataset.contentId));
  });
}

function renderContent(item) {
  const media = mediaFor(item);
  return `
    <div class="content-item">
      <div>
        <h4>${escapeHtml(item.Title)}</h4>
        <p>${escapeHtml(item.Body || '')}</p>
      </div>
      <button data-content-id="${escapeAttr(item.ContentID)}">เสร็จแล้ว</button>
      ${media}
    </div>
  `;
}

function mediaFor(item) {
  if (item.Type === 'youtube' && item.Url) {
    const id = youtubeId(item.Url);
    return id ? `<iframe class="content-media youtube-frame" src="https://www.youtube.com/embed/${id}" allowfullscreen title="${escapeAttr(item.Title)}"></iframe>` : '';
  }
  if (item.Type === 'image' && item.Url) {
    return `<img class="content-media" src="${escapeAttr(item.Url)}" alt="${escapeAttr(item.Title)}">`;
  }
  if ((item.Type === 'file' || item.Type === 'worksheet') && item.AttachmentUrl) {
    return `<p class="content-media"><a href="${escapeAttr(item.AttachmentUrl)}" target="_blank" rel="noopener">เปิดไฟล์ประกอบ</a></p>`;
  }
  return '';
}

async function markDone(contentId) {
  if (!requireLearner()) return;
  const button = document.querySelector(`[data-content-id="${CSS.escape(contentId)}"]`);
  await withButtonLoading(button, 'บันทึก...', async () => {
    await api('saveProgress', { learnerId: state.learner.learnerId, contentId, status: 'done' });
    await alertBox('บันทึกแล้ว', 'ระบบบันทึกความก้าวหน้าของคุณเรียบร้อย', 'success');
  });
}

function openQuiz(type) {
  if (!requireLearner()) return;
  state.currentQuiz = type;
  const label = type === 'pre' ? 'Pre-test' : 'Post-test';
  els.quizLabel.textContent = label;
  els.quizTitle.textContent = type === 'pre' ? 'แบบทดสอบก่อนเรียน' : 'แบบทดสอบหลังเรียน';
  const questions = state.course.questions.filter((q) => q.QuizType === type);
  els.quizForm.innerHTML = questions.map((q, index) => `
    <fieldset class="question">
      <h3>${index + 1}. ${escapeHtml(q.Question)}</h3>
      ${q.Choices.map((choice) => `
        <label class="choice">
          <input type="radio" name="${escapeAttr(q.QuestionID)}" value="${escapeAttr(choice)}" required>
          <span>${escapeHtml(choice)}</span>
        </label>
      `).join('')}
    </fieldset>
  `).join('') + '<button type="submit">ส่งคำตอบ</button>';
  showView('quiz');
}

async function submitQuiz(event) {
  event.preventDefault();
  const button = event.submitter || els.quizForm.querySelector('button[type="submit"]');
  const questions = state.course.questions.filter((q) => q.QuizType === state.currentQuiz);
  const form = new FormData(els.quizForm);
  const answers = questions.map((q) => ({ questionId: q.QuestionID, answer: form.get(q.QuestionID) || '' }));
  await withButtonLoading(button, 'กำลังส่ง...', async () => {
    const result = await api('submitQuiz', { learnerId: state.learner.learnerId, quizType: state.currentQuiz, answers });
    const status = state.currentQuiz === 'post'
      ? (result.passed ? 'ผ่านเกณฑ์' : 'ยังไม่ผ่านเกณฑ์')
      : 'บันทึกคะแนนก่อนเรียนแล้ว';
    await alertBox('ส่งคำตอบแล้ว', `คุณได้ ${result.percent}% (${status})`, result.passed === false ? 'warning' : 'success');
    await loadMyReport();
  });
}

async function loadMyReport() {
  if (!requireLearner()) return;
  const result = await api('report', { learnerId: state.learner.learnerId });
  renderIndividual(result.individual);
  showView('report');
}

function renderIndividual(report) {
  if (!report) {
    els.myReport.innerHTML = '<p class="muted">ยังไม่มีข้อมูลรายงาน</p>';
    return;
  }
  els.myReport.innerHTML = `
    ${metric('ก่อนเรียน', percent(report.pre))}
    ${metric('หลังเรียน', percent(report.post))}
    ${metric('ความก้าวหน้า', `${report.progress.percent}%`)}
    ${metric('สถานะ', report.post ? (String(report.post.Passed) === 'true' ? 'ผ่าน' : 'ยังไม่ผ่าน') : '-')}
  `;
}

async function loadOverview(event) {
  event.preventDefault();
  const button = event.submitter || els.adminForm.querySelector('button[type="submit"]');
  state.adminKey = document.querySelector('#adminKey').value.trim();
  await withButtonLoading(button, 'กำลังตรวจ...', async () => {
    const result = await api('report', { adminKey: state.adminKey });
    if (!result.overview) {
      await alertBox(
        'รหัสครูไม่ถูกต้อง',
        'ให้เปิด Google Sheet แท็บ Settings แล้วคัดลอกค่าในแถว AdminKey มาใส่ช่องนี้ ตัวพิมพ์เล็ก/ใหญ่ต้องตรงกัน',
        'error'
      );
      return;
    }
    renderOverview(result.overview);
    els.exportOverviewPdf.classList.remove('hidden');
    await alertBox('เปิดรายงานภาพรวมแล้ว', 'ข้อมูลภาพรวมของผู้เรียนพร้อมใช้งาน', 'success');
  });
}

function renderOverview(overview) {
  const rows = overview.summaries.map((item) => `
    <tr>
      <td>${escapeHtml(item.learner.FullName)}</td>
      <td>${escapeHtml(item.learner.SubdistrictCenter || item.learner.School || '-')}</td>
      <td>${percent(item.pre)}</td>
      <td>${percent(item.post)}</td>
      <td>${item.progress.percent}%</td>
      <td>${item.post ? (String(item.post.Passed) === 'true' ? 'ผ่าน' : 'ยังไม่ผ่าน') : '-'}</td>
    </tr>
  `).join('');
  els.overviewReport.innerHTML = `
    ${metric('ผู้เรียน', overview.learnerCount)}
    ${metric('ส่งหลังเรียน', overview.completedPostCount)}
    ${metric('ค่าเฉลี่ย', `${overview.averagePostPercent}%`)}
    ${metric('ผ่าน', overview.passedCount)}
    <div class="report-table">
      <table>
        <thead><tr><th>ชื่อ</th><th>ศกร.ระดับตำบล</th><th>ก่อนเรียน</th><th>หลังเรียน</th><th>ความก้าวหน้า</th><th>สถานะ</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

async function exportMyPdf() {
  if (!requireLearner()) return;
  await withButtonLoading(els.exportMyPdf, 'กำลังสร้าง PDF...', async () => {
    const result = await api('exportPdf', { type: 'individual', learnerId: state.learner.learnerId });
    window.open(result.url, '_blank', 'noopener');
  });
}

async function exportOverviewPdf() {
  await withButtonLoading(els.exportOverviewPdf, 'กำลังสร้าง PDF...', async () => {
    const result = await api('exportPdf', { type: 'overview', adminKey: state.adminKey });
    window.open(result.url, '_blank', 'noopener');
  });
}

function renderLoginState() {
  if (!state.learner) {
    els.loginStatus.textContent = 'กรอกข้อมูลเพื่อเริ่มเรียนและบันทึกผล';
    els.loginStatus.classList.remove('learning-pulse');
    return;
  }
  els.loginStatus.textContent = `กำลังเรียน... ${state.learner.fullName} (${state.learner.school || 'ไม่ระบุ ศกร.ระดับตำบล'})`;
  els.loginStatus.classList.add('learning-pulse');
  document.querySelector('#fullName').value = state.learner.fullName || '';
  document.querySelector('#school').value = state.learner.school || '';
}

function showView(name) {
  document.querySelectorAll('.view').forEach((view) => view.classList.remove('active'));
  document.querySelector(`#${name}View`).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function requireLearner() {
  if (state.learner) return true;
  alertBox('กรุณาลงชื่อเรียนก่อน', 'ใส่ชื่อ-สกุล และ ศกร.ระดับตำบล เพื่อให้ระบบบันทึกผลรายบุคคล', 'info');
  document.querySelector('#fullName').focus();
  return false;
}

function metric(label, value) {
  return `<div class="metric"><span class="muted">${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function percent(result) {
  return result ? `${result.Percent}%` : '-';
}

async function api(action, payload = {}) {
  if (API_URL.includes('PASTE_YOUR')) {
    if (action === 'course') return demoCourse();
    throw new Error('Missing API_URL');
  }
  return jsonp(API_URL, { action, payload });
}

function jsonp(url, data) {
  return new Promise((resolve, reject) => {
    const callback = `microLearning_${Date.now()}_${Math.round(Math.random() * 10000)}`;
    const script = document.createElement('script');
    const params = new URLSearchParams({
      action: data.action,
      callback,
      payload: btoa(unescape(encodeURIComponent(JSON.stringify(data.payload || {}))))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
    });

    window[callback] = (response) => {
      cleanup();
      if (!response || response.ok === false) reject(new Error(response && response.error ? response.error : 'API error'));
      else resolve(response);
    };
    script.onerror = () => {
      cleanup();
      reject(new Error('Cannot connect to Apps Script API'));
    };
    script.src = `${url}?${params.toString()}`;
    document.body.appendChild(script);

    function cleanup() {
      delete window[callback];
      script.remove();
    }
  }).catch((error) => {
    toast(error.message);
    throw error;
  });
}

function youtubeId(url) {
  const match = String(url).match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
  return match ? match[1] : '';
}

function toast(message) {
  if (window.Swal) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: message,
      showConfirmButton: false,
      timer: 2400,
      timerProgressBar: true
    });
    return;
  }
  els.toast.textContent = message;
  els.toast.classList.add('show');
  setTimeout(() => els.toast.classList.remove('show'), 2800);
}

function alertBox(title, text, icon = 'info') {
  if (window.Swal) {
    return Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#1f6feb'
    });
  }
  toast(`${title}: ${text}`);
  return Promise.resolve();
}

async function withButtonLoading(button, loadingText, task) {
  if (!button) return task();
  const originalText = button.textContent;
  button.disabled = true;
  button.classList.add('is-loading');
  button.textContent = loadingText;
  try {
    return await task();
  } catch (error) {
    await alertBox('ทำรายการไม่สำเร็จ', error.message || 'กรุณาลองใหม่อีกครั้ง', 'error');
    return null;
  } finally {
    button.disabled = false;
    button.classList.remove('is-loading');
    button.textContent = originalText;
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (s) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

function demoCourse() {
  return {
    ok: true,
    settings: {
      CourseTitle: 'ชุดการเรียนรู้ Micro Learning',
      CourseDescription: 'เรียนสั้น เข้าใจง่าย วัดผลได้รายบุคคล',
      TeacherName: 'ครูผู้สอน'
    },
    lessons: [
      { LessonID: 'L001', Title: 'บทนำ', Description: 'ทำความเข้าใจภาพรวมและเป้าหมายการเรียนรู้', CoverImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200' }
    ],
    contents: [
      { ContentID: 'C001', LessonID: 'L001', Type: 'text', Title: 'วัตถุประสงค์', Body: 'ผู้เรียนสามารถอธิบายแนวคิดหลักและทำกิจกรรมได้', Url: '', AttachmentUrl: '' },
      { ContentID: 'C002', LessonID: 'L001', Type: 'youtube', Title: 'คลิปประกอบ', Body: 'ชมคลิปสั้นก่อนทำกิจกรรม', Url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', AttachmentUrl: '' }
    ],
    questions: [
      { QuestionID: 'QPRE001', QuizType: 'pre', Question: 'Micro learning มีลักษณะอย่างไร', Choices: ['เรียนเป็นช่วงสั้นๆ', 'ต้องเรียนทั้งวัน'], Points: 1 },
      { QuestionID: 'QPOST001', QuizType: 'post', Question: 'ควรเริ่มออกแบบบทเรียนจากอะไร', Choices: ['วัตถุประสงค์', 'สีพื้นหลัง'], Points: 1 }
    ]
  };
}
