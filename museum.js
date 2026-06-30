document.addEventListener("DOMContentLoaded", function () {

  // =============================================
  // SECTION 1: CURTAIN & INTRO ANIMATION
  // =============================================
  const leftCurtain = document.querySelector(".curtain.left");
  const rightCurtain = document.querySelector(".curtain.right");
  const mainTitle = document.getElementById("main-title");
  const subTitle = document.getElementById("sub-title");
  const guestNameTitle = document.getElementById("guest-name-title");
  const scrollIndicator = document.getElementById("scroll-indicator");
  const backgroundMusic = document.getElementById("background-music");
  const musicControls = document.getElementById("music-controls");
  const muteBtn = document.getElementById("mute-btn");
  const volumeSlider = document.getElementById("volume-slider");
  const revealGiftButton = document.getElementById("reveal-gift-btn");
  const finalGiftMessage = document.getElementById("final-gift-message");

  let isMusicStarted = false;

  // Open curtains after short delay
  setTimeout(function () {
    if (leftCurtain) leftCurtain.classList.add("open");
    if (rightCurtain) rightCurtain.classList.add("open");
    if (musicControls) musicControls.classList.remove("hidden");

    if (backgroundMusic) {
      backgroundMusic.volume = 0.5;
      if (volumeSlider) {
        volumeSlider.value = 0.5;
        var pct = 50;
        volumeSlider.style.background =
          "linear-gradient(to right, #C0A062 " + pct + "%, #6D4C41 " + pct + "%)";
      }
      var playPromise = backgroundMusic.play();
      if (playPromise !== undefined) {
        playPromise
          .then(function () {
            isMusicStarted = true;
          })
          .catch(function () {
            console.log("Autoplay was prevented.");
            if (musicControls) musicControls.classList.add("pulse");
          });
      }
    }
  }, 500);

  // Stagger title animations
  setTimeout(function () { if (mainTitle) mainTitle.classList.add("title-visible"); }, 1500);
  setTimeout(function () { if (subTitle) subTitle.classList.add("title-visible"); }, 2000);
  setTimeout(function () { if (guestNameTitle) guestNameTitle.classList.add("title-visible"); }, 2500);
  setTimeout(function () { if (scrollIndicator) scrollIndicator.classList.add("title-visible"); }, 3500);
  setTimeout(function () { document.body.style.overflow = "visible"; }, 3000);

  // =============================================
  // SECTION 2: MUSIC CONTROLS
  // =============================================
  if (muteBtn) {
    muteBtn.addEventListener("click", function () {
      if (!backgroundMusic) return;

      if (!isMusicStarted) {
        backgroundMusic.play();
        isMusicStarted = true;
        if (musicControls) musicControls.classList.remove("pulse");
        muteBtn.textContent = "🔊";
        return;
      }

      backgroundMusic.muted = !backgroundMusic.muted;
      muteBtn.textContent = backgroundMusic.muted ? "🔇" : "🔊";
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener("input", function () {
      if (!backgroundMusic) return;
      var val = this.value;
      backgroundMusic.volume = val;
      var pct = val * 100;
      this.style.background =
        "linear-gradient(to right, #C0A062 " + pct + "%, #6D4C41 " + pct + "%)";
      if (backgroundMusic.muted && val > 0) {
        backgroundMusic.muted = false;
        if (muteBtn) muteBtn.textContent = "🔊";
      }
      if (val == 0) {
        if (muteBtn) muteBtn.textContent = "🔇";
      } else if (!backgroundMusic.muted) {
        if (muteBtn) muteBtn.textContent = "🔊";
      }
    });
  }

  // =============================================
  // SECTION 3: FOCUS MODAL FOR EXHIBIT ITEMS
  // =============================================
  var exhibitItems = document.querySelectorAll(".exhibit-item");
  var focusModal = document.getElementById("focus-modal");
  var closeModalBtn = document.getElementById("close-modal-btn");
  var focusTitle = document.getElementById("focus-title");
  var focusText = document.getElementById("focus-text");
  var focusImageContainer = document.getElementById("focus-image-container");

  if (exhibitItems.length > 0 && focusModal) {
    exhibitItems.forEach(function (item) {
      item.addEventListener("click", function () {
        var title = this.dataset.title;
        var story = this.dataset.story;
        var artifactContent = this.querySelector(".artifact");
        if (artifactContent) artifactContent = artifactContent.cloneNode(true);

        if (focusTitle) focusTitle.textContent = title;
        if (focusText) focusText.textContent = story;
        if (focusImageContainer) {
          focusImageContainer.innerHTML = "";
          if (artifactContent) focusImageContainer.appendChild(artifactContent);
        }
        focusModal.classList.remove("hidden");
        document.body.classList.add("overflow-hidden");
      });
    });

    function closeModal() {
      focusModal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    }

    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    focusModal.addEventListener("click", function (e) {
      if (e.target === focusModal) closeModal();
    });
  }

  // =============================================
  // SECTION 4: REVEAL GIFT BUTTON (CONFETTI)
  // =============================================
  if (revealGiftButton) {
    revealGiftButton.addEventListener("click", function () {
      revealGiftButton.classList.add("hidden");
      if (finalGiftMessage) finalGiftMessage.classList.remove("hidden");

      var duration = 3 * 1000;
      var animationEnd = Date.now() + duration;
      var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        var particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, {
          particleCount: particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        }));
        confetti(Object.assign({}, defaults, {
          particleCount: particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        }));
      }, 250);
    });
  }

  // =============================================
  // SECTION 5: ORIGIN EXHIBIT SECTION ANIMATION
  // =============================================
  var sectionToObserve = document.getElementById("origin-exhibit-section");
  if (sectionToObserve) {
    var headerToAnimate = sectionToObserve.querySelector("header");
    var controlsToAnimate = sectionToObserve.querySelector("#exhibit-controls");

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (headerToAnimate) headerToAnimate.classList.add("is-visible");
          if (controlsToAnimate) controlsToAnimate.classList.add("is-visible");
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    sectionObserver.observe(sectionToObserve);
  }

  // =============================================
  // SECTION 6: NEXT EXHIBIT BUTTON
  // =============================================
  var nextButton = document.getElementById("next-exhibit-btn");
  var endMessage = document.getElementById("exhibit-end-message");
  var exhibits = Array.from(document.querySelectorAll(".exhibit-item"));
  var si2 = document.getElementById("si2");
  var exhibitsContainer = document.getElementById("exhibits-container");
  var currentExhibitIndex = 0;

  if (nextButton && exhibits.length > 0) {
    exhibits.forEach(function (item) {
      item.style.display = "none";
      item.style.opacity = "0";
      item.style.visibility = "hidden";
      item.style.transform = "translateY(30px)";
    });

    nextButton.addEventListener("click", function () {
      if (currentExhibitIndex < exhibits.length) {
        var currentExhibit = exhibits[currentExhibitIndex];
        currentExhibit.style.display = "flex";
        setTimeout(function () {
          currentExhibit.style.visibility = "visible";
          currentExhibit.style.opacity = "1";
          currentExhibit.style.transform = "translateY(0)";
          currentExhibit.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }, 50);
        currentExhibitIndex++;
      }

      if (currentExhibitIndex === exhibits.length) {
        nextButton.disabled = true;
        nextButton.style.display = "none";
        if (endMessage) endMessage.style.display = "block";
        if (exhibitsContainer) {
          exhibitsContainer.classList.remove("hide-scroll");
          exhibitsContainer.classList.add("custom-scrollbar");
        }
        setTimeout(function () {
          if (si2) si2.classList.add("title-visible");
        }, 1000);
      }
    });
  }

  // =============================================
  // SECTION 7: DONG CHAY THOI GIAN - TIMELINE
  // =============================================
  var timelineNodes = document.querySelectorAll(".timeline-node");
  var timelineScrollContainer = document.getElementById("timeline-scroll-container");

  if (timelineScrollContainer) {
    // Convert vertical wheel scroll to horizontal
    timelineScrollContainer.addEventListener("wheel", function (e) {
      if (e.deltaY !== 0) {
        var isAtLeft = timelineScrollContainer.scrollLeft === 0;
        var isAtRight = Math.abs(
          timelineScrollContainer.scrollWidth - timelineScrollContainer.clientWidth - timelineScrollContainer.scrollLeft
        ) <= 1;
        if ((e.deltaY > 0 && !isAtRight) || (e.deltaY < 0 && !isAtLeft)) {
          e.preventDefault();
          timelineScrollContainer.scrollLeft += e.deltaY;
        }
      }
    }, { passive: false });

    // Click and drag to scroll
    var isDown = false;
    var startX = 0;
    var scrollLeftStart = 0;

    timelineScrollContainer.addEventListener("mousedown", function (e) {
      isDown = true;
      startX = e.pageX - timelineScrollContainer.offsetLeft;
      scrollLeftStart = timelineScrollContainer.scrollLeft;
    });
    timelineScrollContainer.addEventListener("mouseleave", function () { isDown = false; });
    timelineScrollContainer.addEventListener("mouseup", function () { isDown = false; });
    timelineScrollContainer.addEventListener("mousemove", function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - timelineScrollContainer.offsetLeft;
      var walk = (x - startX) * 1.5;
      timelineScrollContainer.scrollLeft = scrollLeftStart - walk;
    });
  }

  // Red thread drawing animation
  var redThreadPath = document.getElementById("red-thread-path");
  if (redThreadPath && timelineScrollContainer) {
    redThreadPath.style.transition = "stroke-dashoffset 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
    var pathLength = redThreadPath.getTotalLength();
    redThreadPath.style.strokeDasharray = pathLength;
    redThreadPath.style.strokeDashoffset = pathLength;

    timelineScrollContainer.addEventListener("scroll", function () {
      var scrollWidth = timelineScrollContainer.scrollWidth;
      var clientWidth = timelineScrollContainer.clientWidth;
      var centerOfViewport = timelineScrollContainer.scrollLeft + (clientWidth / 2);
      var drawPercentage = Math.min(centerOfViewport / scrollWidth, 1);
      redThreadPath.style.strokeDashoffset = pathLength * (1 - drawPercentage);

      // Auto-reveal nodes as thread passes them
      timelineNodes.forEach(function (node) {
        var nodeX = parseInt(node.style.left);
        if (centerOfViewport >= nodeX) {
          node.classList.add("is-active");
        } else {
          node.classList.remove("is-active");
        }
      });
    });

    // Initialize: scroll to center the first node
    setTimeout(function () {
      var firstNode = document.querySelector(".timeline-node");
      if (firstNode && timelineScrollContainer.clientWidth > 0) {
        timelineScrollContainer.scrollLeft =
          parseInt(firstNode.style.left) - (timelineScrollContainer.clientWidth / 2);
      }
      timelineScrollContainer.dispatchEvent(new Event("scroll"));
    }, 200);
  }

  // =============================================
  // SECTION 8: MAILBOX / LETTER INTERACTION
  // =============================================
  var mainLetter = document.querySelector(".main-letter");
  var postcards = document.querySelectorAll(".postcard");

  if (mainLetter) {
    mainLetter.addEventListener("click", function (e) {
      e.stopPropagation();
      mainLetter.classList.toggle("is-open");
    });
  }

  if (postcards.length > 0) {
    postcards.forEach(function (card) {
      card.addEventListener("click", function (e) {
        e.stopPropagation();
        postcards.forEach(function (otherCard) {
          if (otherCard !== card) otherCard.classList.remove("is-flipped");
        });
        card.classList.toggle("is-flipped");
      });
    });
  }

  // =============================================
  // SECTION 9: BACKGROUND PARTICLES (BOKEH + FIREFLIES)
  // Reusable for galaxy section
  // =============================================
  function createBackground(containerId, bokehColors, fireflyColor) {
    var container = document.getElementById(containerId);
    if (!container) return;

    for (var i = 0; i < 7; i++) {
      var bokeh = document.createElement("div");
      bokeh.className = "bokeh";
      var size = Math.random() * 350 + 150;
      bokeh.style.width = size + "px";
      bokeh.style.height = size + "px";
      bokeh.style.left = (Math.random() * 110 - 5) + "%";
      bokeh.style.top = (Math.random() * 110 - 5) + "%";
      bokeh.style.backgroundColor = bokehColors[Math.floor(Math.random() * bokehColors.length)];
      bokeh.style.animationDuration = (Math.random() * 10 + 15) + "s";
      bokeh.style.animationDelay = (Math.random() * 5) + "s";
      container.appendChild(bokeh);
    }

    for (var j = 0; j < 50; j++) {
      var firefly = document.createElement("div");
      firefly.className = "firefly";
      if (fireflyColor) {
        firefly.style.backgroundColor = fireflyColor;
        firefly.style.boxShadow = "0 0 10px 2px " + fireflyColor + ", 0 0 20px 4px " + fireflyColor + "88";
      }
      var fSize = Math.random() * 3 + 1;
      firefly.style.width = fSize + "px";
      firefly.style.height = fSize + "px";
      firefly.style.left = (Math.random() * 120) + "%";
      firefly.style.top = (Math.random() * 120) + "%";
      var dur = Math.random() * 15 + 10;
      firefly.style.animationDuration = dur + "s";
      firefly.style.animationDelay = (Math.random() * 10) + "s";
      var endX = -Math.random() * 300 - 100;
      var endY = (Math.random() - 0.5) * 400;
      firefly.style.setProperty("--end-x", endX + "px");
      firefly.style.setProperty("--end-y", endY + "px");
      container.appendChild(firefly);
    }
  }

  // =============================================
  // SECTION 10: CANDLELIGHT BACKGROUND FOR TIMELINE
  // =============================================
  function createCandle(container, delayOffset) {
    var wrapper = document.createElement("div");
    wrapper.className = "candle-wrapper";

    var glow = document.createElement("div");
    glow.className = "candle-glow";
    glow.style.animationDelay = delayOffset + "s";

    var flame = document.createElement("div");
    flame.className = "candle-flame";
    flame.style.animationDelay = (delayOffset * 0.4) + "s";

    var wick = document.createElement("div");
    wick.className = "candle-wick";

    var body = document.createElement("div");
    body.className = "candle-body";
    body.style.height = (55 + Math.random() * 45) + "px";

    var holder = document.createElement("div");
    holder.className = "candle-holder";

    wrapper.appendChild(glow);
    wrapper.appendChild(flame);
    wrapper.appendChild(wick);
    wrapper.appendChild(body);
    wrapper.appendChild(holder);
    container.appendChild(wrapper);
  }

  var timelineBgEl = document.getElementById("timeline-bg");
  if (timelineBgEl) {
    // Create wooden shelf at the bottom
    var shelf = document.createElement("div");
    shelf.className = "candle-shelf";
    timelineBgEl.appendChild(shelf);

    // Place 5 candles on the shelf
    var delays = [0, 0.7, 1.2, 0.4, 0.9];
    delays.forEach(function(delay) {
      createCandle(shelf, delay);
    });
  }

  // Galaxy: cool cosmic palette
  createBackground(
    "galaxy-bg",
    ["#6a0dad", "#1a1a6e", "#0a0a2a", "#c8a2c8", "#2d1b69"],
    "#e0d7ff"
  );

});
