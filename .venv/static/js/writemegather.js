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
