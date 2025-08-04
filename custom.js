const VERSION = '1.0.2'
const TARGET_VERSION = '1.2.5';

/**
 * Agent 조회
 * @returns {string}
 */
function getAgent() {
  const userAgent = navigator.userAgent;
  // const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 ADN_APP ADN_APP_LANG_KO ADN_APP_VER_1.2.5';
  // const userAgent = 'Mozilla/5.0 (Android; CPU Android OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 ADN_APP ADN_APP_LANG_KO ADN_APP_VER_1.2.5';
  return userAgent;
}

/**
 * 모바일 기기 여부
 * @returns {boolean}
 */
function isMobile() {
  const userAgent = getAgent() || navigator.vendor || window.opera;
  return /iPhone|iPad|iPod|Android/i.test(userAgent);
}

/**
 * iOS 여부
 * @returns {boolean}
 */
function isIOS() {
  return /iPhone|iPad|iPod/i.test(getAgent());
}

/**
 * AOS 여부
 * @returns {boolean}
 */
function isAndroid() {
  return /Android/i.test(getAgent());
}

/**
 * Native App 여부 판단
 * @returns {boolean}
 */
function isNativeApp() {
  return /ADN_APP/.test(getAgent());
}

/**
 * Version 조회
 * @returns {number|string}
 */
function getAppVersion() {
  const match = getAgent().match(/ADN_APP_VER_(\d+\.\d+\.\d+)/);

  if (match) {
    return match[1];
  }
  return -1;
}

/**
 * Version 비교
 * @param version
 * @param targetVersion
 * @returns {boolean}
 */
function isVersionBelow(version, targetVersion) {
  if (version === 1 || targetVersion === 1) {
    return true;
  }

  const versionParts = version.split('.').map(Number);
  const targetParts = targetVersion.split('.').map(Number);

  for (let i = 0; i < targetParts.length; i++) {
    const vPart = versionParts[i] || 0; // 없는 부분은 0으로 처리
    const tPart = targetParts[i];

    if (vPart < tPart) {
      return true; // 현재 버전이 더 작으면 true 반환
    } else if (vPart > tPart) {
      return false; // 현재 버전이 더 크면 false 반환
    }
  }

  return false; // 모두 같으면 false 반환
}

/**
 * 헤더 노출 처리
 */
function showHeaderDisplay() {
  const isApp = isNativeApp();
  document.getElementById('header-sec').style.display = isApp ? 'none' : 'block';
}

/**
 * 앱 다운로드 노출 처리
 */
function showAppDownloadDisplay() {
  if (isNativeApp()) {
    document.getElementById('fe-app-download').parentElement.parentElement.remove()
  }
}

/**
 * update Modal 출력
 */
function showUpdateModal() {
  return;

  const version = getAppVersion();
  const modal = document.getElementById('fe-update-modal');

  // 네이티브 앱이 아니라면
  if (!isNativeApp()) {
    return;
  }

  // 1 버전은 OLD 버전이므로 무조건 업데이트 대상임
  if (version === 1) {
    modal.style.display = 'block';
    document.body.style.overflowY = 'hidden';
  }

  const isVersionCheck = isVersionBelow(version, TARGET_VERSION);
  if (isVersionCheck) {
    modal.style.display = 'block';
    document.body.style.overflowY = 'hidden';

    if (isIOS()) {
      document.getElementById('fe-update-ios-btn').style.display = 'inline-block';
    }

    if (isAndroid()) {
      document.getElementById('fe-update-aos-btn').style.display = 'inline-block';
    }

    const closeBtn = document.getElementById('fe-update-close-btn');
    const checkbox = document.getElementById('update-hide-today-checkbox');
    const updateKey = 'UpdatePopupDate';
    const today = new Date().toISOString().slice(0, 10);

    if (localStorage.getItem(updateKey) === today) {
      modal.style.display = 'none';
    }

    // '업데이트' 버튼 클릭 시 로직
    closeBtn.onclick = function () {
      if (checkbox.checked) {
        localStorage.setItem(updateKey, today);
      }
      document.body.style.overflowY = 'scroll';
      modal.style.display = 'none';
    };
  }
}

/**
 * 새로운 앱 Modal 출력
 */
function showNewAppModal() {
  const modal = document.getElementById('fe-new-app-modal');
  const isModalTarget = isMobile() && !isNativeApp();

  // 모바일에서 NativeApp이 아닐 때만 모달 노출
  if (isModalTarget) {
    modal.style.display = 'block';
    document.body.style.overflowY = 'hidden';
  }

  const closeBtn = document.getElementById('fe-new-app-close-btn');
  const checkbox = document.getElementById('new-app-hide-today-checkbox');
  const updateKey = 'NewAppPopupDate';
  const today = new Date().toISOString().slice(0, 10);

  if (localStorage.getItem(updateKey) === today) {
    modal.style.display = 'none';
  }

  // '업데이트' 버튼 클릭 시 로직
  closeBtn.onclick = function () {
    if (checkbox.checked) {
      localStorage.setItem(updateKey, today);
    }
    document.body.style.overflowY = 'scroll';
    modal.style.display = 'none';
  };
}

// 기타 이벤트 바인딩
function bindEvents() {}

// 초기화 함수
function init() {
  showHeaderDisplay();
  showAppDownloadDisplay();
  showNewAppModal();
  // showUpdateModal();
  bindEvents();

  console.log('ai daily news script loaded! version: ' + VERSION)
  document.getElementById('agent_test').innerHTML = getAgent();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
