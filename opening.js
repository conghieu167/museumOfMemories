document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password-input");
  const enterButton = document.getElementById("enter-museum-btn");

  // (MỚI) Lấy các phần tử của pop-up
  const validationPopup = document.getElementById("validation-popup");
  const popupIcon = document.getElementById("popup-icon");
  const popupTitle = document.getElementById("popup-title");
  const popupMessage = document.getElementById("popup-message");

  // HƯỚNG DẪN: Đổi mật khẩu ở đây
  const CORRECT_PASSWORD = "cam";

  function checkPassword() {
    if (passwordInput.value.toLowerCase() === CORRECT_PASSWORD) {
      // MẬT KHẨU ĐÚNG
      // 1. Cập nhật nội dung pop-up thành công
      popupIcon.innerHTML = "Chào mừng";
      popupIcon.className = "icon-success";
      popupTitle.textContent = "Nguyễn Hoàng Ca Thương 🍊";
      popupMessage.textContent = "Bảo tàng đang mở cửa...";

      // 2. Hiện pop-up với hiệu ứng fade-in
      validationPopup.classList.remove("hidden", "fade-out");
      validationPopup.classList.add("fade-in");

      // 3. Vô hiệu hóa nút và ô nhập liệu
      enterButton.disabled = true;
      passwordInput.disabled = true;

      // 4. Đặt hẹn giờ 2 giây
      setTimeout(() => {
        // 4.1. Bắt đầu hiệu ứng fade-out
        validationPopup.classList.remove("fade-in");
        validationPopup.classList.add("fade-out");

        // 4.2. Sau khi fade-out (0.5s), chuyển trang
        setTimeout(() => {
          sessionStorage.setItem("accessGranted", "true");
          window.location.href = "museum.html";
        }, 500); // Thời gian này phải khớp với thời gian animation fadeOut
      }, 2000); // Tổng thời gian chờ là 2 giây
    } else {
      // MẬT KHẨU SAI
      // 1. Cập nhật nội dung pop-up thất bại
      popupIcon.innerHTML = "✗";
      popupIcon.className = "icon-error";
      popupTitle.textContent = "Mật Mã Sai!";
      popupMessage.textContent = "Vui lòng thử lại nhé.";

      // 2. Hiện pop-up với hiệu ứng fade-in
      validationPopup.classList.remove("hidden", "fade-out");
      validationPopup.classList.add("fade-in");

      // 3. Tự động ẩn pop-up sau 2.5 giây
      setTimeout(() => {
        validationPopup.classList.remove("fade-in");
        validationPopup.classList.add("fade-out");

        // Sau khi fade-out xong, thêm lại lớp 'hidden' để có thể hiện ra lần sau
        setTimeout(() => {
          validationPopup.classList.add("hidden");
        }, 500);
      }, 2500);
    }
  }

  enterButton.addEventListener("click", checkPassword);

  passwordInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      checkPassword();
    }
  });
});
