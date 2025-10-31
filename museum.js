document.addEventListener("DOMContentLoaded", function () {
  // 1. KIỂM TRA "VÉ THÔNG HÀNH"
  if (sessionStorage.getItem("accessGranted") !== "true") {
    window.location.replace("opening.html");
    return;
  }

  // --- CÁC BIẾN GIAO DIỆN ---
  const backgroundMusic = document.getElementById("background-music");
  const musicControls = document.getElementById("music-controls");
  const muteBtn = document.getElementById("mute-btn");
  const volumeSlider = document.getElementById("volume-slider");
  // ... các biến khác giữ nguyên ...
  const leftCurtain = document.querySelector(".curtain.left");
  const rightCurtain = document.querySelector(".curtain.right");
  const mainTitle = document.getElementById("main-title");
  const subTitle = document.getElementById("sub-title");
  const guestNameTitle = document.getElementById("guest-name-title");
  let scrollIndicator = document.getElementById("scroll-indicator");

  // (MỚI) Biến để kiểm tra nhạc đã bắt đầu hay chưa
  let isMusicStarted = false;

  // --- CHUỖI ANIMATION MỞ MÀN ---
  setTimeout(() => {
    leftCurtain.classList.add("open");
    rightCurtain.classList.add("open");
    musicControls.classList.remove("hidden");

    // (CẬP NHẬT) Cố gắng bật nhạc và xử lý nếu bị lỗi
    if (backgroundMusic) {
      backgroundMusic.volume = 0.5;
      setInitialVolumeSlider();

      // Lệnh play() trả về một Promise
      const playPromise = backgroundMusic.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Tự động phát thành công!
            isMusicStarted = true;
          })
          .catch((error) => {
            // Tự động phát bị chặn.
            console.log(
              "Autoplay was prevented. Waiting for user interaction."
            );
            // Thêm hiệu ứng nhấp nháy để thu hút người dùng
            musicControls.classList.add("pulse");
          });
      }
    }
  }, 500);

  // ... Các setTimeout cho animation tiêu đề giữ nguyên ...
  setTimeout(() => {
    mainTitle.classList.add("title-visible");
  }, 1500);
  setTimeout(() => {
    subTitle.classList.add("title-visible");
  }, 2000);
  setTimeout(() => {
    guestNameTitle.classList.add("title-visible");
  }, 2500);
  setTimeout(() => {
    scrollIndicator.classList.add("title-visible");
  }, 3500);
  setTimeout(() => {
    document.body.style.overflow = "visible";
  }, 3000);

  // --- LOGIC BỘ ĐIỀU KHIỂN NHẠC (CẬP NHẬT) ---
  function setInitialVolumeSlider() {
    /* ... code giữ nguyên ... */
  }

  muteBtn.addEventListener("click", function () {
    if (!backgroundMusic) return;

    // (MỚI) Xử lý lần click đầu tiên nếu nhạc chưa chạy
    if (!isMusicStarted) {
      backgroundMusic.play();
      isMusicStarted = true;
      musicControls.classList.remove("pulse"); // Tắt hiệu ứng nhấp nháy
      muteBtn.textContent = "🔊";
      return;
    }

    // Logic tắt/mở tiếng như cũ
    backgroundMusic.muted = !backgroundMusic.muted;
    muteBtn.textContent = backgroundMusic.muted ? "🔇" : "🔊";
  });

  // Đoạn mã mới, đầy đủ chức năng
  volumeSlider.addEventListener("input", function () {
    if (!backgroundMusic) return; // Kiểm tra xem audio element có tồn tại không

    const volumeValue = this.value; // Lấy giá trị từ thanh trượt (từ 0 đến 1)
    backgroundMusic.volume = volumeValue; // CẬP NHẬT ÂM LƯỢNG CỦA NHẠC

    // Cập nhật màu nền cho thanh trượt
    const percentage = volumeValue * 100;
    const color = `linear-gradient(to right, #C0A062 ${percentage}%, #6D4C41 ${percentage}%)`;
    this.style.background = color;

    // Tự động mở tiếng nếu người dùng kéo thanh trượt khi đang Mute
    if (backgroundMusic.muted && volumeValue > 0) {
      backgroundMusic.muted = false;
      muteBtn.textContent = "🔊";
    }

    // Cập nhật icon nếu kéo về 0 hoặc kéo lên lại
    if (volumeValue == 0) {
      muteBtn.textContent = "🔇";
    } else if (!backgroundMusic.muted) {
      muteBtn.textContent = "🔊";
    }
  });
  setInitialVolumeSlider();
  // --- LOGIC TƯƠNG TÁC CHO CÁC HIỆN VẬT (FOCUS MODE) ---
  const exhibitItems = document.querySelectorAll(".exhibit-item");
  const focusModal = document.getElementById("focus-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const focusTitle = document.getElementById("focus-title");
  const focusText = document.getElementById("focus-text");
  const focusImageContainer = document.getElementById("focus-image-container");

  if (exhibitItems.length > 0) {
    exhibitItems.forEach((item) => {
      item.addEventListener("click", function () {
        const title = this.dataset.title;
        const story = this.dataset.story;
        const artifactContent = this.querySelector(".artifact").cloneNode(true);

        focusTitle.textContent = title;
        focusText.textContent = story;
        focusImageContainer.innerHTML = "";
        focusImageContainer.appendChild(artifactContent);

        focusModal.classList.remove("hidden");
        document.body.classList.add("no-scroll");
      });
    });

    function closeModal() {
      focusModal.classList.add("hidden");
      document.body.classList.remove("no-scroll");
    }

    closeModalBtn.addEventListener("click", closeModal);
    focusModal.addEventListener("click", function (event) {
      if (event.target === focusModal) {
        closeModal();
      }
    });
  }

  // --- LOGIC NÚT QUÀ TẶNG CUỐI CÙNG ---
  if (revealGiftButton) {
    revealGiftButton.addEventListener("click", function () {
      revealGiftButton.classList.add("hidden");
      finalGiftMessage.classList.remove("hidden");
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 9999,
      };
      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }
      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          })
        );
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          })
        );
      }, 250);
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {
  // --- PHẦN 1: ANIMATION CHO TIÊU ĐỀ & NÚT BẤM ---

  const sectionToObserve = document.getElementById("origin-exhibit-section");

  if (sectionToObserve) {
    const headerToAnimate = sectionToObserve.querySelector("header");
    // MỚI: Chọn khu vực chứa nút bấm để animate
    const controlsToAnimate =
      sectionToObserve.querySelector("#exhibit-controls");

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate tiêu đề
            if (headerToAnimate) {
              headerToAnimate.classList.add("is-visible");
            }
            // MỚI: Animate khu vực nút bấm
            if (controlsToAnimate) {
              controlsToAnimate.classList.add("is-visible");
            }
            sectionObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );
    sectionObserver.observe(sectionToObserve);
  }

  // --- PHẦN 2: HIỆN KHUNG TRANH KHI BẤM NÚT (Giữ nguyên) ---
  const nextButton = document.getElementById("next-exhibit-btn");
  const endMessage = document.getElementById("exhibit-end-message");
  const exhibits = Array.from(document.querySelectorAll(".exhibit-item"));
  scrollIndicator = document.getElementById("si2");
  let currentExhibitIndex = 0;

  if (nextButton && exhibits.length > 0) {
    exhibits.forEach((item) => {
      item.style.opacity = "0";
      item.style.visibility = "hidden";
      item.style.transform = "translateY(30px)";
    });

    nextButton.addEventListener("click", function () {
      if (currentExhibitIndex < exhibits.length) {
        const currentExhibit = exhibits[currentExhibitIndex];
        currentExhibit.style.visibility = "visible";
        currentExhibit.style.opacity = "1";
        currentExhibit.style.transform = "translateY(0)";
        currentExhibitIndex++;
      }

      if (currentExhibitIndex === exhibits.length) {
        nextButton.disabled = true;
        nextButton.style.display = "none";
        endMessage.style.display = "block";
        setTimeout(() => {
          scrollIndicator.classList.add("title-visible");
        }, 1000);
      }
    });
  }
});

// Dán đoạn mã này vào cuối file museum.js, trước dấu } đóng của sự kiện DOMContentLoaded

// --- (MỚI) LOGIC TƯƠNG TÁC CHO ĐẠI LỘ THỜI GIAN ---
const timelineItems = document.querySelectorAll(".timeline-container li");
const timelineTriggers = document.querySelectorAll(".timeline-container .date");

timelineTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    // Lấy thẻ <li> cha của nút vừa click
    const parentLi = trigger.parentElement;

    // Kiểm tra xem thẻ này có đang được chọn hay không
    const isActive = parentLi.classList.contains("is-active");

    // Trước tiên, xóa lớp 'is-active' khỏi tất cả các mục
    // timelineItems.forEach((item) => {
    //   item.classList.remove("is-active");
    // });

    // Nếu thẻ vừa click chưa được chọn, thì thêm lớp 'is-active' vào nó
    // (Tạo hiệu ứng toggle: click lần nữa để đóng lại)
    if (!isActive) {
      parentLi.classList.add("is-active");
    }
  });
});

// Dán đoạn mã này vào cuối file museum.js, bên trong sự kiện DOMContentLoaded

// --- (MỚI) LOGIC TƯƠNG TÁC CHO HỘP THƯ KỶ NIỆM ---
const mailboxSection = document.getElementById("mailbox-section");
const mainLetter = document.querySelector(".main-letter");
const postcards = document.querySelectorAll(".postcard");
const rainSound = document.getElementById("rain-sound");

if (mainLetter) {
  mainLetter.addEventListener("click", (e) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
    mainLetter.classList.toggle("is-open");
  });
}

if (postcards.length > 0) {
  postcards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.stopPropagation();
      // Đóng các bưu thiếp khác trước khi mở bưu thiếp này
      postcards.forEach((otherCard) => {
        if (otherCard !== card) otherCard.classList.remove("is-flipped");
      });
      card.classList.toggle("is-flipped");
    });
  });
}
