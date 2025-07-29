// 모바일 기기 여부 판단
function isMobile() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /iPhone|iPad|iPod|Android/i.test(userAgent);
}

// Native App 여부 판단
function isNativeApp() {
  return /ADN_APP/.test(navigator.userAgent);
}

// 버전 체크
function getAppVersion() {
  const match = navigator.userAgent.match(/ADN_APP_VER_(\d+\.\d+\.\d+)/);

  if (match) {
    return match[1];
  }
  return -1;
}

// 모달(Popup) 업데이트 로직
function newAppModal() {
  const modal = document.getElementById('fe-new-app-modal');
  const isModalTarget = isMobile() && !isNativeApp();

  // 모바일에서 NativeApp이 아닐 때만 모달 노출
  if (isModalTarget) {
    modal.style.display = 'block';
    document.body.style.overflowY = 'hidden';
  }

  const newAppCloseBtn = document.getElementById('fe-new-app-close-btn');
  const newAppCheckbox = document.getElementById('new-app-hide-today-checkbox');
  const updateKey = 'NewAppPopupDate';
  const today = new Date().toISOString().slice(0, 10);

  // 금일 이미 체크했다면 모달 비노출
  if (localStorage.getItem(updateKey) === today) {
    modal.style.display = 'none';
  }

  // '업데이트' 버튼 클릭 시 로직
  newAppCloseBtn.onclick = function () {
    if (newAppCheckbox.checked) {
      localStorage.setItem(updateKey, today);
    }
    document.body.style.overflowY = 'scroll';
    modal.style.display = 'none';
  };
}

// 헤더 노출 처리
function showHeaderDisplay() {
  const isApp = isNativeApp();
  document.getElementById('header-sec').style.display = isApp ? 'none' : 'block';
}

// 기타 이벤트 바인딩
function bindEvents() {}

// 초기화 함수
function init() {
  showHeaderDisplay();
  newAppModal();
  bindEvents();
  console.log('ai daily news script loaded!')
  // document.getElementById('agent_test').innerHTML = navigator.userAgent;
}

console.log('!!!!!!!!')
// 문서가 로드되면 실행
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // 이미 DOM이 로드된 상태면 바로 실행
  init();
}