document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');

    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            nav.classList.toggle('open');
            document.body.classList.toggle('overflow-hidden');
        });

        // Close nav when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                nav.classList.remove('open');
                document.body.classList.remove('overflow-hidden');
            });
        });
    }

    // --- Dynamic Profile Detection Form Submission ---
    const verificationForm = document.getElementById('verificationForm');
    const resultsPlaceholder = document.getElementById('resultsPlaceholder');
    const resultsOutput = document.getElementById('resultsOutput');
    const resultsSpinner = document.getElementById('resultsSpinner');

    if (verificationForm) {
        verificationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Toggle UI States
            if (resultsPlaceholder) resultsPlaceholder.style.display = 'none';
            if (resultsOutput) resultsOutput.style.display = 'none';
            if (resultsSpinner) resultsSpinner.style.display = 'flex';

            // Scroll to results panel on smaller screens
            if (window.innerWidth < 968) {
                const resultsPanel = document.querySelector('.results-panel');
                if (resultsPanel) {
                    resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }

            // Extract Form Data
            const formData = new FormData(verificationForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            try {
                // Post Data to Flask API
                const response = await fetch('/detect', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error('API Request Failed');
                }

                const result = await response.json();

                if (result.success) {
                    // Update Output UI Elements
                    updateResultsUI(result, data.username);
                } else {
                    showError(result.error || 'Verification failed. Please try again.');
                }

            } catch (error) {
                console.error('Error during verification:', error);
                showError('Could not connect to the verification engine. Ensure server is running.');
            }
        });
    }

    function updateResultsUI(result, username) {
        // Hide Spinner
        if (resultsSpinner) resultsSpinner.style.display = 'none';
        if (resultsOutput) resultsOutput.style.display = 'block';

        // 1. Result Badge (Real/Fake)
        const badgeContainer = document.getElementById('resBadge');
        if (badgeContainer) {
            badgeContainer.innerHTML = '';
            
            const badge = document.createElement('div');
            badge.className = `result-badge ${result.is_fake ? 'badge-fake' : 'badge-real'}`;
            
            const icon = document.createElement('i');
            icon.className = result.is_fake ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-circle-check';
            
            badge.appendChild(icon);
            badge.appendChild(document.createTextNode(` ${result.prediction}`));
            badgeContainer.appendChild(badge);
        }

        // 2. Display Username
        const usernameDisplay = document.getElementById('resUsername');
        if (usernameDisplay) {
            usernameDisplay.innerHTML = `<span>@</span>${escapeHtml(username)}`;
        }

        // 3. Risk Level
        const riskLevelDisplay = document.getElementById('resRiskLevel');
        if (riskLevelDisplay) {
            riskLevelDisplay.textContent = result.risk_level;
            riskLevelDisplay.className = `metric-value ${result.risk_class}`;
        }

        // 4. Model Used
        const modelUsedDisplay = document.getElementById('resModelUsed');
        if (modelUsedDisplay) {
            modelUsedDisplay.textContent = result.model_used;
        }

        // 5. Confidence Score
        const confidenceDisplay = document.getElementById('resConfidence');
        const confidenceTextDisplay = document.getElementById('resConfidenceText');
        const gaugeFill = document.getElementById('resGaugeFill');
        if (confidenceDisplay) {
            confidenceDisplay.textContent = result.confidence;
        }
        if (confidenceTextDisplay) {
            confidenceTextDisplay.textContent = result.confidence;
        }
        if (gaugeFill) {
            // Animate gauge bar width
            gaugeFill.style.width = '0%';
            setTimeout(() => {
                gaugeFill.style.width = result.confidence;
            }, 100);
        }

        // 6. Explanations List
        const explanationsList = document.getElementById('resExplanations');
        if (explanationsList) {
            explanationsList.innerHTML = '';

            result.explanations.forEach(exp => {
                const item = document.createElement('div');
                item.className = `explanation-item exp-${exp.type}`;

                const title = document.createElement('div');
                title.className = 'exp-title';

                // Determine icon based on alert type
                const icon = document.createElement('i');
                if (exp.type === 'danger') icon.className = 'fa-solid fa-circle-xmark';
                else if (exp.type === 'warning') icon.className = 'fa-solid fa-triangle-exclamation';
                else if (exp.type === 'success') icon.className = 'fa-solid fa-circle-check';
                else icon.className = 'fa-solid fa-circle-info';

                title.appendChild(icon);
                title.appendChild(document.createTextNode(exp.title));

                const desc = document.createElement('div');
                desc.className = 'exp-desc';
                desc.textContent = exp.desc;

                item.appendChild(title);
                item.appendChild(desc);
                explanationsList.appendChild(item);
            });
        }
    }

    function showError(message) {
        if (resultsSpinner) resultsSpinner.style.display = 'none';
        if (resultsPlaceholder) {
            resultsPlaceholder.style.display = 'flex';
            const icon = resultsPlaceholder.querySelector('.placeholder-icon');
            const title = resultsPlaceholder.querySelector('.placeholder-title');
            const desc = resultsPlaceholder.querySelector('.placeholder-desc');

            if (icon) icon.className = 'fa-solid fa-circle-exclamation placeholder-icon';
            if (title) title.textContent = 'Verification Error';
            if (desc) desc.textContent = message;
        }
    }

    function escapeHtml(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
