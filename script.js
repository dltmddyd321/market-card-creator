document.addEventListener('DOMContentLoaded', () => {
    // Inputs
    const imageUpload = document.getElementById('imageUpload');
    const mainTitleInput = document.getElementById('mainTitle');
    const subTitleInput = document.getElementById('subTitle');

    // Color Pickers
    const bgColorTop = document.getElementById('bgColorTop');
    const bgColorBottom = document.getElementById('bgColorBottom');
    const titleColor = document.getElementById('titleColor');
    const subTitleColor = document.getElementById('subTitleColor');

    // Advanced Controls
    const layoutSelect = document.getElementById('layoutSelect');
    const deviceFrameSelect = document.getElementById('deviceFrameSelect');
    const bgPatternSelect = document.getElementById('bgPatternSelect');
    const badgeAppStore = document.getElementById('badgeAppStore');
    const badgeGooglePlay = document.getElementById('badgeGooglePlay');
    const textAlignSelect = document.getElementById('textAlignSelect');
    const titleSize = document.getElementById('titleSize');
    const subTitleSize = document.getElementById('subTitleSize');
    const titleSizeVal = document.getElementById('titleSizeVal');
    const subTitleSizeVal = document.getElementById('subTitleSizeVal');

    const fontSelect = document.getElementById('fontSelect');
    const fontUpload = document.getElementById('fontUpload');

    // Buttons
    const downloadBtn = document.getElementById('downloadBtn');

    // Preview Elements
    const captureArea = document.getElementById('captureArea');
    const cardTextArea = document.querySelector('.card-text-area');
    const previewMainTitle = document.getElementById('previewMainTitle');
    const previewSubTitle = document.getElementById('previewSubTitle');
    const previewImage = document.getElementById('previewImage');
    const devicePlaceholder = document.querySelector('.device-placeholder');
    const deviceMockup = document.getElementById('deviceMockup');
    const badgesContainer = document.getElementById('badgesContainer');
    const previewBadgeAppStore = document.getElementById('previewBadgeAppStore');
    const previewBadgeGooglePlay = document.getElementById('previewBadgeGooglePlay');

    // UI Elements
    const controlsPanel = document.getElementById('controlsPanel');
    const panelToggleBtn = document.getElementById('panelToggleBtn');

    let uploadedImageBase64 = null;

    // --- Real-time Preview Binding ---
    function updatePreviewText() {
        previewMainTitle.innerText = mainTitleInput.value || '제목을 입력해주세요';
        previewSubTitle.innerText = subTitleInput.value || '부제목을 입력해주세요';
    }

    function updatePreviewColors() {
        // Gradient Background
        const top = bgColorTop.value;
        const bottom = bgColorBottom.value;
        captureArea.style.background = `linear-gradient(180deg, ${top} 0%, ${bottom} 100%)`;

        // Text Colors
        previewMainTitle.style.color = titleColor.value;
        previewSubTitle.style.color = subTitleColor.value;
    }

    // Input Listeners
    mainTitleInput.addEventListener('input', updatePreviewText);
    subTitleInput.addEventListener('input', updatePreviewText);

    bgColorTop.addEventListener('input', updatePreviewColors);
    bgColorBottom.addEventListener('input', updatePreviewColors);
    titleColor.addEventListener('input', updatePreviewColors);
    subTitleColor.addEventListener('input', updatePreviewColors);

    // Initial color setup
    updatePreviewColors();

    // --- Advanced Features Binding ---
    layoutSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'column-reverse') {
            captureArea.classList.add('layout-column-reverse');
        } else {
            captureArea.classList.remove('layout-column-reverse');
        }
    });

    deviceFrameSelect.addEventListener('change', (e) => {
        deviceMockup.className = 'device-mockup frame-' + e.target.value;
        if (e.target.value === 'notch') {
            deviceMockup.className = 'device-mockup'; // default has no frame- modifier
        }
    });

    bgPatternSelect.addEventListener('change', (e) => {
        captureArea.classList.remove('bg-pattern-dots', 'bg-pattern-grid');
        if (e.target.value !== 'none') {
            captureArea.classList.add('bg-pattern-' + e.target.value);
        }
    });

    textAlignSelect.addEventListener('change', (e) => {
        cardTextArea.style.alignItems = e.target.value === 'center' ? 'center' : (e.target.value === 'left' ? 'flex-start' : 'flex-end');
        cardTextArea.style.textAlign = e.target.value;
    });

    titleSize.addEventListener('input', (e) => {
        titleSizeVal.innerText = e.target.value;
        previewMainTitle.style.fontSize = e.target.value + 'px';
    });

    subTitleSize.addEventListener('input', (e) => {
        subTitleSizeVal.innerText = e.target.value;
        previewSubTitle.style.fontSize = e.target.value + 'px';
    });

    function updateBadges() {
        const showAppStore = badgeAppStore.checked;
        const showGooglePlay = badgeGooglePlay.checked;

        badgesContainer.style.display = (showAppStore || showGooglePlay) ? 'flex' : 'none';
        previewBadgeAppStore.style.display = showAppStore ? 'flex' : 'none';
        previewBadgeGooglePlay.style.display = showGooglePlay ? 'flex' : 'none';
    }

    badgeAppStore.addEventListener('change', updateBadges);
    badgeGooglePlay.addEventListener('change', updateBadges);

    // --- Panel Toggle ---
    panelToggleBtn.addEventListener('click', () => {
        controlsPanel.classList.toggle('collapsed');
    });

    // --- Image Upload ---
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            uploadedImageBase64 = event.target.result;
            previewImage.src = uploadedImageBase64;
            previewImage.style.display = 'block';
            devicePlaceholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
    });

    // --- Font Selection & Custom Font Upload ---
    fontSelect.addEventListener('change', (e) => {
        cardTextArea.style.fontFamily = e.target.value;
    });

    fontUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const fontName = 'CustomFont_' + Date.now();
            const buffer = await file.arrayBuffer();
            const fontFace = new FontFace(fontName, buffer);

            // Add the new font to the document and apply it
            await fontFace.load();
            document.fonts.add(fontFace);

            // Change font-family
            cardTextArea.style.fontFamily = `"${fontName}", sans-serif`;

            // Reset the select dropdown since a custom font is used
            fontSelect.value = "";
        } catch (error) {
            console.error('Font load error:', error);
            alert('폰트 파일을 적용하는 데 실패했습니다. 올바른 형식의 파일인지 확인해주세요.');
        }
    });

    // --- Download Image via html2canvas ---
    downloadBtn.addEventListener('click', async () => {
        if (!uploadedImageBase64) {
            alert("먼저 스크린샷 이미지를 업로드해주세요.");
            return;
        }

        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<span class="spinner" style="width:20px;height:20px;border-width:2px;margin:0;"></span> 캡처 중...';

        try {
            const canvas = await html2canvas(captureArea, {
                scale: 2, // High resolution
                useCORS: true,
                backgroundColor: null // transparent
            });

            const link = document.createElement('a');
            link.download = 'market_card.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error("Capture failed:", error);
            alert("이미지 저장 중 오류가 발생했습니다.");
        } finally {
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = '<span class="btn-icon">⬇️</span> 고화질 이미지 다운로드';
        }
    });
});
