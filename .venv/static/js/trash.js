function toggleDeleteButton() {
    var checkboxes = document.querySelectorAll('.mail-item input[type="checkbox"]');
    var deleteButton = document.querySelector('.delete-button');

    var checkedCount = 0;
    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            checkedCount++;
        }
    });

    if (checkedCount > 0) {
        deleteButton.style.display = 'inline-block';
    } else {
        deleteButton.style.display = 'none';
    }
}

function displayDeletedLogs() {
    var logs = JSON.parse(localStorage.getItem('deletedLogs')) || [];

    // logs를 이용하여 화면에 로그를 표시하는 로직을 추가하세요.
    // 예를 들어, 새로운 리스트를 생성하고 각 로그를 해당 리스트에 추가할 수 있습니다.
    var logList = document.getElementById('deletedLogList'); // 이 부분은 실제로 HTML에 해당 ID가 있는 엘리먼트를 참조해야 합니다.

    logs.forEach(function (log) {
        var logItem = document.createElement('li');
        logItem.textContent = 'Sender: ' + log.sender + ', Subject: ' + log.subject + ', Date: ' + log.date;
        logList.appendChild(logItem);
    });
}

// 페이지 로드 시에 로그를 표시합니다.
document.addEventListener('DOMContentLoaded', function () {
    displayDeletedLogs();
});
function deleteSelected() {
    var checkboxes = document.querySelectorAll('.mail-item input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            // Perform delete action for the selected item
            checkbox.closest('.mail-item').remove();
        }
    });

    // After deletion, hide the delete button
    var deleteButton = document.querySelector('.delete-button');
    deleteButton.style.display = 'none';
}
// 페이지 로드 시에 로그를 표시합니다.
document.addEventListener('DOMContentLoaded', function () {
    displayDeletedLogs();
});
function toggleSelectAll() {
    var selectAllCheckbox = document.getElementById('selectAll');
    var checkboxes = document.querySelectorAll('.mail-item input[type="checkbox"]');

    checkboxes.forEach(function (checkbox) {
        checkbox.checked = selectAllCheckbox.checked;
    });

    // Update the delete button visibility based on the state of the checkboxes
    toggleDeleteButton();
}

document.addEventListener("DOMContentLoaded", function () {
    // mail-app 및 mail-content 요소에 대한 참조를 가져옵니다.
    const mailApp = document.querySelector('.mail-app');
    const mailContent = document.querySelector('.mail-content');

    // mail-list 및 mail-content 섹션에 대한 참조를 가져옵니다.
    const mailListSection = document.querySelector('.mail-app');
    const mailContentSection = document.querySelector('.mail-content');

    // mail-subject 앵커 태그에 대한 참조를 가져옵니다.
    const subjectLinks = document.querySelectorAll('.mail-subjectex a');

    // mail-subject 링크 클릭 이벤트를 처리하는 함수
    function handleSubjectClick(event) {
        // 앵커 태그의 기본 동작을 방지합니다.
        event.preventDefault();

        // mail-app 및 mail-content 섹션의 표시 여부를 전환합니다.
        mailListSection.style.display = 'none';
        mailContentSection.style.display = 'block';

        // 클릭된 링크에 기반하여 mail-content 섹션의 내용을 업데이트합니다.
        const subject = event.target.textContent;
        const sender = event.target.closest('.mail-item').querySelector('.mail-senderex').textContent;
        const date = event.target.closest('.mail-item').querySelector('.mail-dateex').textContent;

        // mail-content 내용을 업데이트합니다.
        const mailContentSubject = document.querySelector('.mail-content .mail-subjectex');
        const mailContentSender = document.querySelector('.mail-content .mail-senderex');
        const mailContentDate = document.querySelector('.mail-content .mail-dateex');

        mailContentSubject.textContent = subject;
        mailContentSender.textContent = sender;
        mailContentDate.textContent = date;

        // mail-app의 내용도 동일하게 업데이트합니다.
        const mailAppSubject = document.querySelector('.mail-app .mail-subjectex');
        const mailAppSender = document.querySelector('.mail-app .mail-senderex');
        const mailAppDate = document.querySelector('.mail-app .mail-dateex');

        mailAppSubject.textContent = subject;
        mailAppSender.textContent = sender;
        mailAppDate.textContent = date;

        // 필요한 경우 content-body 내용도 업데이트할 수 있습니다.
    }

    // 각 mail-subject 링크에 클릭 이벤트 핸들러를 추가합니다.
    subjectLinks.forEach(function (link) {
        link.addEventListener('click', handleSubjectClick);
    });
});
document.addEventListener('DOMContentLoaded', function () {
    var searchInput = document.getElementById('searchInput');
    var mailApp = document.querySelector('.mail-app');

    searchInput.addEventListener('input', function () {
      var searchTerm = searchInput.value.toLowerCase();
      // mail-app 클래스를 가진 요소에서 검색
      var mailContent = mailApp.textContent.toLowerCase();

      // 검색어가 포함된 부분을 강조하기 위해 highlight 클래스를 추가
      mailApp.innerHTML = mailContent.replace(new RegExp(searchTerm, 'gi'), function (match) {
        return '<span class="highlight">' + match + '</span>';
      });
    });
  });
  document.addEventListener("DOMContentLoaded", function () {
    var menuToggle = document.getElementById("menuToggle");
    var leftPanel = document.getElementById("left-panel");
    var mailApp = document.querySelector(".mail-app");

    menuToggle.addEventListener("click", function () {
        // Toggle left-panel display
        leftPanel.style.display = leftPanel.style.display === "none" ? "block" : "none";

        // Adjust mail-app width and left property
        mailApp.style.width = leftPanel.style.display === "none" ? "100%" : "88%";
        mailApp.style.left = leftPanel.style.display === "none" ? "0" : "200px";
    });
});
