const API_URL = 'https://script.google.com/macros/s/AKfycbyo09GjBLJQ_-WG6Yzfqv0-fhvbQcNhkWDyGfleQG-boeQLmzjuaqeX2cv-LYKyI3SM/exec';

const state = {
  course: null,
  learner: null,
  reflection: ''
};

const els = {};

const i18n = {
  th: {
    brandName: 'Micro Learning',
    step1: 'ลงทะเบียน',
    step2: 'วัตถุประสงค์', 
    step3: 'ก่อนเรียน',
    step4: 'เรียนรู้',
    step5: 'หลังเรียน',
    step6: 'ผลรายบุคคล',
    step7: 'ภาพรวม',
    registerTitle: 'ลงทะเบียนเรียน',
    labelName: 'ชื่อ-สกุล',
    labelClassroom: 'ห้องเรียน',
    placeholderName: 'เช่น สมชาย ใจดี',
    placeholderClassroom: 'เช่น ม.1/1 หรือ ป.6/2',
    btnRegister: 'ลงทะเบียนเรียน',
    objectivesTitle: 'ชี้แจงวัตถุประสงค์การเรียนรู้',
    btnStartLearning: 'โอเค เริ่มเรียนได้',
    preTestTitle: 'แบบทดสอบก่อนเรียน',
    postTestTitle: 'แบบทดสอบหลังเรียน',
    learningTitle: 'ห้องเรียนรู้',
    reflectionTitle: 'ช่องสะท้อนคิดการเรียนรู้',
    placeholderReflection: 'บันทึกสิ่งที่ได้เรียนรู้จากบทเรียนนี้ (อย่างน้อย 20 ตัวอักษร)...',
    btnFinishLearning: 'เรียนรู้เสร็จแล้ว',
    individualReportTitle: 'ประมวลผลการเรียนรู้รายบุคคล',
    btnViewOverview: 'ดูประมวลผลภาพรวม',
    overviewReportTitle: 'ประมวลผลภาพรวม',
    btnHome: 'กลับบ้านแรก',
    btnRestart: 'เริ่มเรียนใหม่',
    btnExit: 'ออกจากบทเรียน',
    adminTitle: 'จัดการข้อมูล',
    btnClose: 'ปิด',
    tabSettings: 'ตั้งค่า',
    tabLessons: 'บทเรียน',
    tabContents: 'เนื้อหา',
    tabQuestions: 'คำถาม',
    btnSaveAll: 'บันทึกข้อมูลทั้งหมด',
    footerText: 'ระบบ Micro Learning — เรียนสั้น เข้าใจง่าย วัดผลได้',
    footerSub: 'พัฒนาเพื่อการศึกษาไทย 🇹🇭',
    qrTitle: 'QR Code สำหรับแชร์บทเรียน',
    btnCopyLink: 'คัดลอกลิงก์',
    btnExportPDF: 'ดาวน์โหลด PDF',
    btnSubmitAnswers: '✏️ ส่งคำตอบ',
    toastFillNameRoom: 'กรุณากรอกชื่อ-สกุล และห้องเรียน',
    toastLoading: 'กำลังโหลดข้อมูล กรุณารอสักครู่',
    toastReflection: 'กรุณาเขียนสะท้อนคิดอย่างน้อย 20 ตัวอักษร',
    alertRegSuccess: 'ลงทะเบียนเรียบร้อย',
    alertWelcome: 'ยินดีต้อนรับ สู่การเรียนรู้',
    alertSubmitted: 'ส่งคำตอบแล้ว',
    alertFinishTitle: '✅ บันทึกการเรียนรู้แล้ว',
    alertFinishText: 'คุณได้เรียนรู้ครบทุกเนื้อหาแล้ว ไปทำแบบทดสอบหลังเรียนกัน!',
    alertSaveSuccess: '✅ บันทึกสำเร็จ',
    alertSaveSuccessText: 'ข้อมูลทั้งหมดอัปเดตแล้ว',
    alertFailed: '❌ ไม่สำเร็จ',
    alertTryAgain: 'ลองใหม่อีกครั้ง',
    alertAdminPwTitle: 'รหัสผ่านผู้ดูแล',
    alertAdminPwText: 'กรอกรหัสผ่านเพื่อเข้าใช้งาน',
    alertAdminPwWrong: 'รหัสผ่านไม่ถูกต้อง',
    noPreTestQuiz: 'ไม่มีแบบทดสอบก่อนเรียน',
    noPostTestQuiz: 'ไม่มีแบบทดสอบหลังเรียน',
    noData: 'ยังไม่มีข้อมูล',
    noLearnerData: 'ยังไม่มีข้อมูลผู้เรียน',
    noAdminKey: 'ไม่พบข้อมูล',
    preLabel: 'ก่อนเรียน',
    postLabel: 'หลังเรียน',
    devScore: 'คะแนนพัฒนา',
    status: 'สถานะ',
    passed: 'ผ่าน',
    notPassed: 'ยังไม่ผ่าน',
    waitPost: 'รอสอบหลังเรียน',
    waitExam: 'รอสอบ',
    reflection: 'สะท้อนคิด',
    totalLearners: 'ผู้เรียนทั้งหมด',
    completedPost: 'ส่งหลังเรียน',
    average: 'ค่าเฉลี่ย',
    passedCriteria: 'ผ่านเกณฑ์',
    thName: 'ชื่อ',
    thCenter: 'ศกร.',
    thPre: 'ก่อนเรียน',
    thPost: 'หลังเรียน',
    thDev: 'พัฒนา',
    thStatus: 'สถานะ',
    passedStatus: '✅ ผ่าน',
    failedStatus: '❌ ไม่ผ่าน',
    preScoreSaved: 'บันทึกคะแนนก่อนเรียนแล้ว',
    passedCriteriaStatus: 'ผ่านเกณฑ์',
    notPassedCriteria: 'ยังไม่ผ่านเกณฑ์',
    registering: 'กำลังลงทะเบียน...',
    submitting: 'กำลังส่ง...',
    saving: 'กำลังบันทึก...',
    openFile: '📎 เปิดไฟล์ประกอบ',
    copied: '✅ คัดลอกลิงก์แล้ว!',
    adminPw: 'รหัสผ่าน',
    adminLogin: 'เข้าสู่ระบบ',
    cancel: 'ยกเลิก',
    enterPw: 'กรุณากรอกรหัสผ่าน',
    ok: 'ตกลง',
    courseName: 'ชื่อรายวิชา',
    courseDesc: 'คำอธิบาย',
    teacherNameLabel: 'ชื่อครู',
    passCriteria: 'เกณฑ์ผ่าน (%)',
    lessonName: 'ชื่อบทเรียน',
    lessonDesc: 'คำอธิบาย',
    coverUrl: 'URL ปก',
    delete: '🗑 ลบ',
    addLesson: '➕ เพิ่มบทเรียน',
    contentName: 'ชื่อเนื้อหา',
    contentType: 'ประเภท',
    contentBody: 'เนื้อหา (Body)',
    contentUrl: 'URL/Link',
    addContent: '➕ เพิ่มเนื้อหา',
    questionText: 'คำถาม',
    questionType: 'ประเภท',
    choicesLabel: 'ตัวเลือก (คั่นด้วย | )',
    addQuestion: '➕ เพิ่มคำถาม',
    noAdminKeyMsg: 'ไม่พบ AdminKey ในระบบ',
    insertAdminKey: 'กรุณาใส่ AdminKey',
    objIcon: '📖',
    objDefaultTitle: 'วัตถุประสงค์การเรียนรู้',
    loadingData: 'กำลังโหลดข้อมูล...'
  },
  en: {
    brandName: 'Micro Learning',
    step1: 'Register',
    step2: 'Objectives',
    step3: 'Pre-Test',
    step4: 'Learn',
    step5: 'Post-Test',
    step6: 'My Report',
    step7: 'Overview',
    registerTitle: 'Register to Learn',
    labelName: 'Full Name',
    labelClassroom: 'Classroom',
    placeholderName: 'e.g. John Doe',
    placeholderClassroom: 'e.g. Class 1/1',
    btnRegister: 'Register',
    objectivesTitle: 'Learning Objectives',
    btnStartLearning: 'OK, Let\'s Start',
    preTestTitle: 'Pre-Test',
    postTestTitle: 'Post-Test',
    learningTitle: 'Learning Room',
    reflectionTitle: 'Learning Reflection',
    placeholderReflection: 'Write what you learned from this lesson (at least 20 characters)...',
    btnFinishLearning: 'Finish Learning',
    individualReportTitle: 'Individual Learning Report',
    btnViewOverview: 'View Overview Report',
    overviewReportTitle: 'Overview Report',
    btnHome: 'Home',
    btnRestart: 'Restart',
    btnExit: 'Exit Lesson',
    adminTitle: 'Admin Panel',
    btnClose: 'Close',
    tabSettings: 'Settings',
    tabLessons: 'Lessons',
    tabContents: 'Contents',
    tabQuestions: 'Questions',
    btnSaveAll: 'Save All Data',
    footerText: 'Micro Learning System — Short, Simple, Measurable',
    footerSub: 'Developed for Thai Education 🇹🇭',
    qrTitle: 'QR Code for Sharing',
    btnCopyLink: 'Copy Link',
    btnExportPDF: 'Download PDF',
    btnSubmitAnswers: '✏️ Submit Answers',
    toastFillNameRoom: 'Please enter your name and classroom',
    toastLoading: 'Loading data, please wait...',
    toastReflection: 'Please write at least 20 characters for reflection',
    alertRegSuccess: 'Registration Successful',
    alertWelcome: 'Welcome to your learning journey',
    alertSubmitted: 'Answers Submitted',
    alertFinishTitle: '✅ Learning Saved',
    alertFinishText: 'You have completed all content. Let\'s take the post-test!',
    alertSaveSuccess: '✅ Saved Successfully',
    alertSaveSuccessText: 'All data has been updated',
    alertFailed: '❌ Failed',
    alertTryAgain: 'Please try again',
    alertAdminPwTitle: 'Admin Password',
    alertAdminPwText: 'Enter password to access admin panel',
    alertAdminPwWrong: 'Incorrect password',
    noPreTestQuiz: 'No pre-test questions',
    noPostTestQuiz: 'No post-test questions',
    noData: 'No data yet',
    noLearnerData: 'No learner data yet',
    noAdminKey: 'No data found',
    preLabel: 'Pre-Test',
    postLabel: 'Post-Test',
    devScore: 'Improvement',
    status: 'Status',
    passed: 'Passed',
    notPassed: 'Not Passed',
    waitPost: 'Awaiting Post-Test',
    waitExam: 'Awaiting',
    reflection: 'Reflection',
    totalLearners: 'Total Learners',
    completedPost: 'Completed Post',
    average: 'Average',
    passedCriteria: 'Passed',
    thName: 'Name',
    thCenter: 'Center',
    thPre: 'Pre-Test',
    thPost: 'Post-Test',
    thDev: 'Improvement',
    thStatus: 'Status',
    passedStatus: '✅ Passed',
    failedStatus: '❌ Failed',
    preScoreSaved: 'Pre-test score saved',
    passedCriteriaStatus: 'Passed',
    notPassedCriteria: 'Not passed yet',
    registering: 'Registering...',
    submitting: 'Submitting...',
    saving: 'Saving...',
    openFile: '📎 Open Attachment',
    copied: '✅ Link copied!',
    adminPw: 'Password',
    adminLogin: 'Login',
    cancel: 'Cancel',
    enterPw: 'Please enter password',
    ok: 'OK',
    courseName: 'Course Name',
    courseDesc: 'Description',
    teacherNameLabel: 'Teacher Name',
    passCriteria: 'Pass Criteria (%)',
    lessonName: 'Lesson Name',
    lessonDesc: 'Description',
    coverUrl: 'Cover URL',
    delete: '🗑 Delete',
    addLesson: '➕ Add Lesson',
    contentName: 'Content Name',
    contentType: 'Type',
    contentBody: 'Body',
    contentUrl: 'URL/Link',
    addContent: '➕ Add Content',
    questionText: 'Question',
    questionType: 'Type',
    choicesLabel: 'Choices (separated by |)',
    addQuestion: '➕ Add Question',
    noAdminKeyMsg: 'AdminKey not found',
    insertAdminKey: 'Please enter AdminKey',
    objIcon: '📖',
    objDefaultTitle: 'Learning Objectives',
    loadingData: 'Loading data...'
  }
};

let currentLang = localStorage.getItem('ml_lang') || 'th';
let quizTimerInterval = null;
let quizStartTime = 0;

function t(key) {
  return i18n[currentLang][key] || i18n['th'][key] || key;
}

function applyLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  if (els.langLabel) {
    els.langLabel.textContent = currentLang === 'th' ? 'EN' : 'TH';
  }
}

document.addEventListener('DOMContentLoaded', init);

async function init() {
  cacheEls();
  
  // Theme initialization
  const savedTheme = localStorage.getItem('ml_theme') || 'dark';
  document.documentElement.dataset.theme = savedTheme;
  updateThemeIcon(savedTheme);

  applyLanguage();
  bindEvents();
  
  // LocalStorage persistence for learner
  const savedLearner = localStorage.getItem('ml_learner');
  if (savedLearner) {
    try {
      state.learner = JSON.parse(savedLearner);
    } catch(e) {}
  }
  
  state.course = await api('course');
  renderCourseInfo();
  
  // Skip directly to a step if already logged in? Keeping standard flow, but retaining learner state.
  if (state.learner && !document.querySelector('.step.active')) {
    goToStep(1);
    els.fullName.value = state.learner.FullName || '';
    els.classroom.value = state.learner.School || '';
  }
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
  
  // New Elements
  els.themeBtn = document.getElementById('themeBtn');
  els.themeIcon = document.getElementById('themeIcon');
  els.langBtn = document.getElementById('langBtn');
  els.langLabel = document.getElementById('langLabel');
  els.progressFill = document.getElementById('progressFill');
  
  // QR Elements
  els.qrBtn = document.getElementById('qrBtn');
  els.qrModal = document.getElementById('qrModal');
  els.qrCanvas = document.getElementById('qrCanvas');
  els.qrUrl = document.getElementById('qrUrl');
  els.qrCopyBtn = document.getElementById('qrCopyBtn');
  els.qrCloseBtn = document.getElementById('qrCloseBtn');
}

function bindEvents() {
  if(els.registerBtn) els.registerBtn.addEventListener('click', onLogin);
  if(els.fullName) els.fullName.addEventListener('keydown', enterToNext);
  if(els.classroom) els.classroom.addEventListener('keydown', enterToNext);
  if(els.objOkBtn) els.objOkBtn.addEventListener('click', () => goToStep(3));
  if(els.preTestForm) els.preTestForm.addEventListener('submit', submitPreTest);
  if(els.finishBtn) els.finishBtn.addEventListener('click', finishLearning);
  if(els.postTestForm) els.postTestForm.addEventListener('submit', submitPostTest);
  if(els.overviewBtn) els.overviewBtn.addEventListener('click', () => goToStep(7));
  if(els.homeBtn) els.homeBtn.addEventListener('click', goHome);
  if(els.restartBtn) els.restartBtn.addEventListener('click', restartLearning);
  if(els.exitBtn) els.exitBtn.addEventListener('click', exitLearning);
  if(els.adminBtn) els.adminBtn.addEventListener('click', openAdmin);
  if(els.adminCloseBtn) els.adminCloseBtn.addEventListener('click', closeAdmin);
  if(els.adminSaveBtn) els.adminSaveBtn.addEventListener('click', saveAllData);
  if(els.adminTabs) els.adminTabs.forEach(tab => {
    tab.addEventListener('click', () => switchAdminTab(tab.dataset.tab));
  });
  if(els.reflectionInput) els.reflectionInput.addEventListener('input', () => {
    state.reflection = els.reflectionInput.value;
    const len = state.reflection.trim().length;
    const charCount = document.getElementById('charCount');
    if (charCount) charCount.textContent = len;
  });
  
  // Theme & Lang
  if(els.themeBtn) els.themeBtn.addEventListener('click', toggleTheme);
  if(els.langBtn) els.langBtn.addEventListener('click', toggleLanguage);
  
  // QR
  if(els.qrBtn) els.qrBtn.addEventListener('click', openQrModal);
  if(els.qrCloseBtn) els.qrCloseBtn.addEventListener('click', closeQrModal);
  if(els.qrCopyBtn) els.qrCopyBtn.addEventListener('click', copyUrl);
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme;
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('ml_theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  if (els.themeIcon) {
    els.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

function toggleLanguage() {
  currentLang = currentLang === 'th' ? 'en' : 'th';
  localStorage.setItem('ml_lang', currentLang);
  applyLanguage();
  renderCourseInfo();
  
  // Re-render current step contents if necessary
  const activeStep = document.querySelector('.step.active');
  if (activeStep) {
    const stepId = activeStep.id;
    if (stepId === 'step2') renderObjectives();
    else if (stepId === 'step3') openQuiz('pre', els.preTestForm);
    else if (stepId === 'step4') renderLearningRoom();
    else if (stepId === 'step5') openQuiz('post', els.postTestForm);
    else if (stepId === 'step6') loadMyReport();
    else if (stepId === 'step7') loadOverview();
  }
}

let typingTimer;
function renderCourseInfo() {
  if (!state.course) return;
  const s = state.course.settings;
  const titleText = s.CourseTitle || t('brandName');
  
  // Welcome typing effect
  if (els.courseTitle) {
    els.courseTitle.textContent = '';
    let i = 0;
    clearInterval(typingTimer);
    typingTimer = setInterval(() => {
      els.courseTitle.textContent += titleText.charAt(i);
      i++;
      if (i >= titleText.length) clearInterval(typingTimer);
    }, 50);
  }
  
  if (els.courseDescription) els.courseDescription.textContent = s.CourseDescription || '';
  if (els.teacherName) els.teacherName.textContent = s.TeacherName || '';
  document.title = titleText;
}

function goToStep(n) {
  stopQuizTimer();
  const currentStepEl = document.querySelector('.step.active');
  const target = document.getElementById('step' + n);
  if (!target) return;
  
  if (currentStepEl && currentStepEl !== target) {
    currentStepEl.style.opacity = '0';
    setTimeout(() => {
      currentStepEl.classList.remove('active');
      currentStepEl.style.opacity = '';
      showNewStep(target, n);
    }, 300);
  } else {
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    showNewStep(target, n);
  }
}

function showNewStep(target, n) {
  target.classList.add('active');
  window.scrollTo({ top: 0 });
  updateProgress(n);
  
  if (!state.course && n >= 2) {
    if (els.objectivesContent) els.objectivesContent.innerHTML = `<p class="empty-msg">${t('loadingData')}</p>`;
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
  
  if (els.progressFill) {
    els.progressFill.style.width = `${((Math.min(current, 7) - 1) / 6) * 100}%`;
  }
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
    toast(t('toastFillNameRoom'));
    if (!name) els.fullName.focus();
    else els.classroom.focus();
    return;
  }
  if (!state.course) {
    toast(t('toastLoading'));
    return;
  }
  const payload = {
    fullName: name,
    school: room,
    email: name.replace(/\s+/g, '') + '@learner.local'
  };
  await withButtonLoading(els.registerBtn, t('registering'), async () => {
    const result = await api('register', payload);
    state.learner = result.learner;
    localStorage.setItem('ml_learner', JSON.stringify(state.learner));
    await alertBox(t('alertRegSuccess'), t('alertWelcome'), 'success');
    goToStep(2);
  });
}

function renderObjectives() {
  const contents = state.course.contents || [];
  const textContent = contents.find(c => c.Type === 'text');
  if (els.objectivesContent) {
    els.objectivesContent.innerHTML = `
      <div class="obj-icon">${t('objIcon')}</div>
      <h3>${escapeHtml(textContent ? textContent.Title : t('objDefaultTitle'))}</h3>
      <p>${escapeHtml(textContent ? textContent.Body : state.course.settings.CourseDescription || '')}</p>
    `;
  }
}

function openQuiz(type, formEl) {
  const label = type === 'pre' ? t('preLabel') : t('postLabel');
  const questions = state.course.questions.filter(q => q.QuizType === type);
  if (!questions.length) {
    const emptyMsg = type === 'pre' ? t('noPreTestQuiz') : t('noPostTestQuiz');
    formEl.innerHTML = `<p class="empty-msg">${emptyMsg}</p>`;
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
  `).join('') + `<button type="submit" class="btn-primary btn-glow btn-full">${t('btnSubmitAnswers')}</button>`;
  
  startQuizTimer();
}

// Timer Functions
function startQuizTimer() {
  const timerContainers = document.querySelectorAll('.quiz-timer');
  const timerTexts = document.querySelectorAll('.timer-text');
  const timerRings = document.querySelectorAll('.timer-progress');
  
  timerContainers.forEach(c => c.style.display = 'flex');
  quizStartTime = Date.now();
  
  clearInterval(quizTimerInterval);
  quizTimerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - quizStartTime) / 1000);
    const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const s = (elapsed % 60).toString().padStart(2, '0');
    timerTexts.forEach(tEl => tEl.textContent = `${m}:${s}`);
    
    // update circle offset (cycle every 60s)
    const pct = (elapsed % 60) / 60;
    const offset = 100 - (pct * 100);
    timerRings.forEach(r => {
      r.style.strokeDashoffset = offset;
    });
  }, 1000);
}

function stopQuizTimer() {
  clearInterval(quizTimerInterval);
  const timerContainers = document.querySelectorAll('.quiz-timer');
  timerContainers.forEach(c => c.style.display = 'none');
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
  const passed = await submitQuiz(btn, 'post');
  
  if (passed && typeof confetti === 'function') {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.7 } });
  }
  
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
  
  let passed = false;
  
  await withButtonLoading(button, t('submitting'), async () => {
    const result = await api('submitQuiz', {
      learnerId: state.learner.learnerId,
      quizType,
      answers
    });
    
    passed = result.passed;
    const status = quizType === 'post'
      ? (result.passed ? t('passedCriteriaStatus') : t('notPassedCriteria'))
      : t('preScoreSaved');
    const icon = result.passed === false ? 'warning' : 'success';
    await alertBox(t('alertSubmitted'), `คุณได้ ${result.percent}% (${status})`, icon);
  });
  
  return passed;
}

function renderLearningRoom() {
  const lessons = state.course.lessons || [];
  const contents = state.course.contents || [];
  if (els.lessonContent) {
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
  }
  if (els.reflectionInput) els.reflectionInput.value = state.reflection || '';
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
    return `<a class="file-link" href="${escapeAttr(item.AttachmentUrl)}" target="_blank" rel="noopener">${t('openFile')}</a>`;
  }
  return '';
}

async function finishLearning() {
  const text = (els.reflectionInput.value || '').trim();
  if (text.length < 20) {
    toast(t('toastReflection'));
    els.reflectionInput.focus();
    return;
  }
  await alertBox(t('alertFinishTitle'), t('alertFinishText'), 'success');
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

function animateCounter(element, target, duration = 1000) {
  if (!element || isNaN(target)) return;
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const current = Math.floor(progress * target);
    element.textContent = current + (element.dataset.suffix || '');
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = target + (element.dataset.suffix || '');
    }
  };
  window.requestAnimationFrame(step);
}

function renderIndividual(report) {
  if (!els.myReport) return;
  if (!report) {
    els.myReport.innerHTML = `<p class="empty-msg">${t('noData')}</p>`;
    return;
  }
  const passed = report.post ? (String(report.post.Passed) === 'true') : false;
  const imp = calcImprovement(report.pre, report.post);
  const impDiff = imp.diff !== null ? `${imp.diff >= 0 ? '+' : ''}${imp.diff}` : '-';
  const impGain = imp.normGain !== null ? `Gain ${imp.normGain}%` : (report.pre ? t('waitPost') : t('waitExam'));
  const impClass = imp.diff === null ? '' : (imp.diff >= 20 ? 'metric-green' : (imp.diff >= 0 ? 'metric-blue' : 'metric-orange'));
  
  els.myReport.innerHTML = `
    <div class="metrics">
      <div class="metric metric-blue">
        <div class="metric-icon">&#x1F4DD;</div>
        <span>${t('preLabel')}</span>
        <strong id="indPre">${report.pre ? report.pre.Percent + '%' : '-'}</strong>
      </div>
      <div class="metric metric-green">
        <div class="metric-icon">&#x1F4CA;</div>
        <span>${t('postLabel')}</span>
        <strong id="indPost">${report.post ? report.post.Percent + '%' : '-'}</strong>
      </div>
      <div class="metric ${impClass || 'metric-purple'}">
        <div class="metric-icon">&#x1F4C8;</div>
        <span>${t('devScore')}</span>
        <strong>${impDiff}</strong>
        <small>${impGain}</small>
      </div>
      <div class="metric ${passed ? 'metric-green' : 'metric-orange'}">
        <div class="metric-icon">${passed ? '&#x2705;' : '&#x23F3;'}</div>
        <span>${t('status')}</span>
        <strong>${passed ? t('passed') : t('notPassed')}</strong>
      </div>
    </div>
    ${report.reflection ? `<div class="reflection-note"><strong>&#x1F4AD; ${t('reflection')}:</strong> ${escapeHtml(report.reflection)}</div>` : ''}
  `;
  
  if (report.pre) {
    const el = document.getElementById('indPre');
    el.dataset.suffix = '%';
    animateCounter(el, report.pre.Percent);
  }
  if (report.post) {
    const el = document.getElementById('indPost');
    el.dataset.suffix = '%';
    animateCounter(el, report.post.Percent);
  }
}

async function loadOverview() {
  const adminKey = state.course?.settings?.AdminKey;
  if (!adminKey) {
    if (els.overviewReport) els.overviewReport.innerHTML = `<p class="empty-msg">${t('noAdminKey')}</p>`;
    return;
  }
  const result = await api('report', { adminKey });
  if (!result.overview) {
    if (els.overviewReport) els.overviewReport.innerHTML = `<p class="empty-msg">${t('noLearnerData')}</p>`;
    return;
  }
  renderOverview(result.overview);
}

function renderOverview(overview) {
  if (!els.overviewReport) return;
  const rows = overview.summaries.map(item => {
    const imp = calcImprovement(item.pre, item.post);
    const impStr = imp.diff !== null ? `${imp.diff >= 0 ? '+' : ''}${imp.diff}` : '-';
    const statusText = item.post ? (String(item.post.Passed) === 'true' ? t('passedStatus') : t('failedStatus')) : '-';
    return `
    <tr>
      <td>${escapeHtml(item.learner.FullName)}</td>
      <td>${escapeHtml(item.learner.SubdistrictCenter || item.learner.School || '-')}</td>
      <td class="num">${percent(item.pre)}</td>
      <td class="num">${percent(item.post)}</td>
      <td class="num">${impStr}</td>
      <td class="status">${statusText}</td>
    </tr>`;
  }).join('');
  els.overviewReport.innerHTML = `
    <div class="metrics">
      <div class="metric metric-blue">
        <div class="metric-icon">&#x1F465;</div>
        <span>${t('totalLearners')}</span>
        <strong id="ovTotal">${overview.learnerCount}</strong>
      </div>
      <div class="metric metric-green">
        <div class="metric-icon">&#x2705;</div>
        <span>${t('completedPost')}</span>
        <strong id="ovPost">${overview.completedPostCount}</strong>
      </div>
      <div class="metric metric-purple">
        <div class="metric-icon">&#x1F4C8;</div>
        <span>${t('average')}</span>
        <strong id="ovAvg">${overview.averagePostPercent}%</strong>
      </div>
      <div class="metric metric-green">
        <div class="metric-icon">&#x1F3C6;</div>
        <span>${t('passedCriteria')}</span>
        <strong id="ovPass">${overview.passedCount}</strong>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>${t('thName')}</th><th>${t('thCenter')}</th><th>${t('thPre')}</th><th>${t('thPost')}</th><th>${t('thDev')}</th><th>${t('thStatus')}</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
  
  animateCounter(document.getElementById('ovTotal'), overview.learnerCount);
  animateCounter(document.getElementById('ovPost'), overview.completedPostCount);
  
  const ovAvg = document.getElementById('ovAvg');
  if (ovAvg) ovAvg.dataset.suffix = '%';
  animateCounter(ovAvg, Math.round(overview.averagePostPercent || 0));
  
  animateCounter(document.getElementById('ovPass'), overview.passedCount);
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
  localStorage.removeItem('ml_learner');
  if (els.fullName) els.fullName.value = '';
  if (els.classroom) els.classroom.value = '';
  goToStep(1);
  renderCourseInfo();
}

/* === Admin Panel === */
let adminData = null;
let adminPassword = '';

async function openAdmin() {
  if (!state.course?.settings?.AdminKey) {
    toast(t('noAdminKeyMsg'));
    return;
  }
  const { value: pw, isConfirmed } = await Swal.fire({
    title: t('alertAdminPwTitle'),
    text: t('alertAdminPwText'),
    input: 'password',
    inputPlaceholder: t('adminPw'),
    confirmButtonText: t('adminLogin'),
    showCancelButton: true,
    cancelButtonText: t('cancel'),
    inputValidator: v => v ? null : t('enterPw'),
    background: document.documentElement.dataset.theme === 'dark' ? '#1e1e2f' : '#ffffff',
    color: document.documentElement.dataset.theme === 'dark' ? '#e2e8f0' : '#1a1a2e'
  });
  if (!isConfirmed || !pw) return;
  const result = await api('verifyAdmin', { adminKey: pw });
  if (!result.ok) {
    await alertBox(t('alertAdminPwWrong'), t('alertTryAgain'), 'error');
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
  if (els.adminTabs) els.adminTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('admin' + name.charAt(0).toUpperCase() + name.slice(1)).classList.add('active');
  if (name === 'lessons') renderAdminLessons();
  else if (name === 'contents') renderAdminContents();
  else if (name === 'questions') renderAdminQuestions();
}

function renderAdminTabs() {
  renderAdminSettings();
}

function renderAdminSettings() {
  if (!els.adminSettings) return;
  const s = adminData.settings;
  els.adminSettings.innerHTML = `
    <div class="field"><label>${t('courseName')}</label><input id="adCourseTitle" value="${escapeAttr(s.CourseTitle || '')}"></div>
    <div class="field"><label>${t('courseDesc')}</label><input id="adCourseDesc" value="${escapeAttr(s.CourseDescription || '')}"></div>
    <div class="field"><label>${t('teacherNameLabel')}</label><input id="adTeacher" value="${escapeAttr(s.TeacherName || '')}"></div>
    <div class="field"><label>${t('passCriteria')}</label><input id="adPass" type="number" value="${s.PassPercent || 70}"></div>
    <div class="field"><label>AdminKey</label><input id="adAdminKey" value="${escapeAttr(s.AdminKey || '')}" readonly style="background:#f3f4f6;color:#6b7280"></div>
  `;
}

function renderAdminLessons() {
  if (!els.adminLessons) return;
  const lessons = adminData.lessons || [];
  els.adminLessons.innerHTML = lessons.map((l, i) => `
    <div class="admin-item">
      <div class="field"><label>${t('lessonName')}</label><input class="ad-lesson-title" value="${escapeAttr(l.Title)}"></div>
      <div class="field"><label>${t('lessonDesc')}</label><input class="ad-lesson-desc" value="${escapeAttr(l.Description || '')}"></div>
      <div class="field"><label>${t('coverUrl')}</label><input class="ad-lesson-cover" value="${escapeAttr(l.CoverImageUrl || '')}"></div>
      <button class="btn-outline ad-del" data-idx="${i}">${t('delete')}</button>
    </div>
  `).join('') + `<button id="adAddLesson" class="btn-outline">${t('addLesson')}</button>`;
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
  if (!els.adminContents) return;
  const contents = adminData.contents || [];
  els.adminContents.innerHTML = contents.map((c, i) => `
    <div class="admin-item">
      <div class="field"><label>${t('contentName')}</label><input class="ad-cont-title" value="${escapeAttr(c.Title)}"></div>
      <div class="field"><label>${t('contentType')}</label>
        <select class="ad-cont-type">
          ${['text','youtube','image','worksheet'].map(type => `<option ${c.Type === type ? 'selected' : ''}>${type}</option>`).join('')}
        </select>
      </div>
      <div class="field"><label>${t('contentBody')}</label><textarea class="ad-cont-body" rows="2">${escapeHtml(c.Body || '')}</textarea></div>
      <div class="field"><label>${t('contentUrl')}</label><input class="ad-cont-url" value="${escapeAttr(c.Url || '')}"></div>
      <button class="btn-outline ad-del" data-idx="${i}">${t('delete')}</button>
    </div>
  `).join('') + `<button id="adAddContent" class="btn-outline">${t('addContent')}</button>`;
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
  if (!els.adminQuestions) return;
  const questions = adminData.questions || [];
  els.adminQuestions.innerHTML = questions.map((q, i) => `
    <div class="admin-item">
      <div class="field"><label>${t('questionText')}</label><input class="ad-q-text" value="${escapeAttr(q.Question)}"></div>
      <div class="field"><label>${t('questionType')}</label>
        <select class="ad-q-type">
          ${['pre','post'].map(type => `<option ${q.QuizType === type ? 'selected' : ''}>${type}</option>`).join('')}
        </select>
      </div>
      <div class="field"><label>${t('choicesLabel')}</label><input class="ad-q-choices" value="${escapeAttr((q.Choices || []).join(' | '))}"></div>
      <button class="btn-outline ad-del" data-idx="${i}">${t('delete')}</button>
    </div>
  `).join('') + `<button id="adAddQuestion" class="btn-outline">${t('addQuestion')}</button>`;
  document.querySelectorAll('#adminQuestions .ad-del').forEach(b => b.addEventListener('click', () => {
    adminData.questions.splice(parseInt(b.dataset.idx), 1);
    renderAdminQuestions();
  }));
  document.getElementById('adAddQuestion')?.addEventListener('click', () => {
    adminData.questions.push({ QuestionID: 'Q' + Date.now(), QuizType: 'pre', Question: '', Choices: ['Choice1','Choice2'], Points: 1 });
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
  if (!key) { toast(t('insertAdminKey')); return; }
  els.adminSaveBtn.disabled = true;
  els.adminSaveBtn.textContent = t('saving');
  try {
    const res = await api('saveAll', { adminKey: key, data: adminData });
    if (!res.ok) throw new Error(res.error || 'Failed');
    state.course = JSON.parse(JSON.stringify(adminData));
    renderCourseInfo();
    await alertBox(t('alertSaveSuccess'), t('alertSaveSuccessText'), 'success');
  } catch (e) {
    await alertBox(t('alertFailed'), e.message || t('alertTryAgain'), 'error');
  } finally {
    els.adminSaveBtn.disabled = false;
    els.adminSaveBtn.textContent = t('btnSaveAll');
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
  if (els.toast) {
    els.toast.textContent = message;
    els.toast.classList.add('show');
    setTimeout(() => els.toast.classList.remove('show'), 2800);
  }
}

function alertBox(title, text, icon = 'info') {
  const isDark = document.documentElement.dataset.theme === 'dark';
  if (window.Swal) {
    return Swal.fire({
      title, text, icon,
      confirmButtonText: t('ok'),
      confirmButtonColor: '#6366f1',
      background: isDark ? '#1e1e2f' : '#ffffff',
      color: isDark ? '#e2e8f0' : '#1a1a2e'
    });
  }
  toast(`${title}: ${text}`);
  return Promise.resolve();
}

async function withButtonLoading(button, loadingText, task) {
  if (!button) return task();
  const original = button.innerHTML;
  button.disabled = true;
  button.innerHTML = `<span class="spinner"></span> ${loadingText}`;
  try { return await task(); } catch (error) {
    await alertBox(t('alertFailed'), error.message || t('alertTryAgain'), 'error');
  } finally {
    button.disabled = false;
    button.innerHTML = original;
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

/* === QR Code === */
function openQrModal() {
  if (!els.qrModal) return;
  els.qrModal.classList.add('show');
  const url = window.location.href.split('?')[0];
  if (els.qrUrl) els.qrUrl.textContent = url;
  
  if (els.qrCanvas && window.QRCode) {
    els.qrCanvas.width = 200;
    els.qrCanvas.height = 200;
    QRCode.toCanvas(els.qrCanvas, url, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    }, function (error) {
      if (error) console.error(error);
    });
  }
}

function closeQrModal() {
  if (els.qrModal) els.qrModal.classList.remove('show');
}

function copyUrl() {
  const url = window.location.href.split('?')[0];
  navigator.clipboard.writeText(url).then(() => {
    toast(t('copied'));
  });
}

window.exportToPDF = function(elementId, filename) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  // Create a clone to fix styling issues during PDF generation if needed
  const opt = {
    margin:       10,
    filename:     filename + '.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, backgroundColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1e1e37' : '#ffffff' },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  toast(t('loadingData') || 'Generating PDF...');
  
  if (window.html2pdf) {
    html2pdf().set(opt).from(element).save();
  } else {
    toast('PDF Library not loaded', 'error');
  }
};

