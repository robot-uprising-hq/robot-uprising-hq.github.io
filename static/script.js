document.addEventListener('DOMContentLoaded', function() {
    setupNavTabs();

    setupFAQInteraction();

    function setupWindowControls(container) {
        const closeBtn = container.querySelector('.button.close');

        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                container.classList.add('collapsed');
                container.classList.add('semi-closed');
                e.preventDefault();
            });
        }
    }

    // Add resize observer to ensure things work well on all screens
    const resizeObserver = new ResizeObserver(entries => {
        // Reset absolute positioning on small screens
        if (window.innerWidth < 768) {
            const containers = document.querySelectorAll('.win95-container');
            containers.forEach(container => {
                if (!container.classList.contains('maximized')) {
                    container.style.position = 'relative';
                    container.style.top = 'auto';
                    container.style.left = 'auto';
                }
            });
        }
    });

    resizeObserver.observe(document.body);

    // Function to toggle FAQ answers - all answers start hidden
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
});
