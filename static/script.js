document.addEventListener('DOMContentLoaded', function() {
    setupNavTabs();
    setupFAQInteraction();

    // Remove window controls and resize observer for futuristic design
    function setupFAQInteraction() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        const faqAnswers = document.querySelectorAll('.faq-answer');

        // Initially hide all answers
        faqAnswers.forEach(answer => {
            answer.style.display = 'none';
        });

        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const answer = this.nextElementSibling;
                const container = this.closest('.futuristic-container');

                // Fix the container's width to prevent resizing
                if (container) {
                    container.style.width = `${container.offsetWidth}px`;
                }

                if (answer.classList.contains('open')) {
                    answer.classList.remove('open');
                    this.classList.remove('open');
                    answer.style.display = 'none';
                } else {
                    answer.classList.add('open');
                    this.classList.add('open');
                    answer.style.display = 'block';
                }
            });
        });
    }

    function setupNavTabs() {
        const tabs = document.querySelectorAll('.nav-tab');
        const contents = document.querySelectorAll('.nav-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                document.getElementById(tabId + '-content').classList.add('active');
            });
        });
    }

    function switchTabAndScroll(tabName, sectionId) {
        document.querySelectorAll('.nav-content').forEach(function(section) {
            section.classList.remove('active');
        });
        var tabContent = document.getElementById(tabName + '-content');
        if (tabContent) {
            tabContent.classList.add('active');
        }
        document.querySelectorAll('.nav-tab').forEach(function(tab) {
            tab.classList.remove('active');
        });
        var navTab = document.querySelector('.nav-tab[data-tab="' + tabName + '"]');
        if (navTab) {
            navTab.classList.add('active');
        }
        if (sectionId) {
            var section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    document.getElementById('apply-membership-btn')?.addEventListener('click', function(e) {
        e.preventDefault();
        switchTabAndScroll('about', 'ccsh-citizenship-about');
    });

    document.getElementById('competition-guide-btn')?.addEventListener('click', function(e) {
        e.preventDefault();
        switchTabAndScroll('hackathon', 'micro-invaders');
    });

    // Mystery Section animated title effect
    const mysteryTitle = document.getElementById('mystery-title');
    if (mysteryTitle) {
        const originalText = mysteryTitle.textContent;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        // Set monospace font for pixel stability
        mysteryTitle.style.fontFamily = 'monospace, monospace';
        let currentArr = originalText.split('');
        function randomizeSomeChars() {
            let tempArr = currentArr.slice();
            let numToChange = Math.floor(Math.random() * 3) + 1;
            let indices = [];
            while (indices.length < numToChange) {
                let idx = Math.floor(Math.random() * originalText.length);
                if (originalText[idx] !== ' ' && !indices.includes(idx)) {
                    indices.push(idx);
                }
            }
            indices.forEach(i => {
                tempArr[i] = chars[Math.floor(Math.random() * chars.length)];
            });
            currentArr = tempArr;
            mysteryTitle.textContent = tempArr.join('');
        }
        setInterval(randomizeSomeChars, 120);
    }
});
