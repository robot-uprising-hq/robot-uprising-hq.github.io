document.addEventListener('DOMContentLoaded', function() {
    setupNavTabs();
    setupFAQInteraction();
    setupHamburgerMenu();
    setupIntelLog();

    let intelEntries = [];
    let activeFilterType = null; // 'tag' | 'hashtag' | null
    let activeFilterValue = null; // lowercased

    function intelEntryMatchesFilter(entry) {
        if (!activeFilterType) return true;
        if (activeFilterType === 'tag') {
            return (entry.tag || '').toLowerCase() === activeFilterValue;
        }
        return (entry.hashtags || []).some((tag) => tag.toLowerCase() === activeFilterValue);
    }

    function setIntelFilter(type, value) {
        if (activeFilterType === type && activeFilterValue === value) {
            activeFilterType = null;
            activeFilterValue = null;
        } else {
            activeFilterType = type;
            activeFilterValue = value;
        }
    }

    function renderIntelFilterStatus() {
        const status = document.createElement('div');
        status.className = 'intel-filter-status';
        const label = activeFilterType === 'hashtag' ? `#${activeFilterValue}` : activeFilterValue;
        status.innerHTML = `
            Filtering by ${activeFilterType}: <strong>${label}</strong>
            <button type="button" class="intel-filter-clear">Clear &times;</button>
        `;
        return status;
    }

    function renderIntelEntry(entry) {
        const article = document.createElement('article');
        article.className = 'intel-entry';

        const tagValue = (entry.tag || '').toLowerCase();
        const tagSelected = activeFilterType === 'tag' && activeFilterValue === tagValue;

        const header = document.createElement('div');
        header.className = 'intel-entry-header';
        header.innerHTML = `
            <span class="intel-date">${entry.date.replace(/-/g, '—')}</span>
            <button type="button" class="intel-tag${tagSelected ? ' selected' : ''}" data-filter-type="tag" data-filter-value="${tagValue}">${entry.tag}</button>
        `;
        article.appendChild(header);

        const title = document.createElement('h3');
        title.className = 'intel-title';
        title.textContent = entry.title;
        article.appendChild(title);

        entry.description.split(/\n\s*\n/).forEach((paragraph) => {
            const p = document.createElement('p');
            p.className = 'intel-description';
            p.textContent = paragraph.replace(/\n/g, ' ').trim();
            article.appendChild(p);
        });

        const meta = document.createElement('div');
        meta.className = 'intel-meta';
        const hashtagsHtml = (entry.hashtags || [])
            .map((tag) => {
                const value = tag.toLowerCase();
                const selected = activeFilterType === 'hashtag' && activeFilterValue === value;
                return `<button type="button" class="intel-hashtag${selected ? ' selected' : ''}" data-filter-type="hashtag" data-filter-value="${value}">#${tag}</button>`;
            })
            .join('');
        meta.innerHTML = `
            <span class="intel-author">${entry.author}</span>
            <span class="intel-hashtags">${hashtagsHtml}</span>
        `;
        article.appendChild(meta);

        return article;
    }

    function renderIntelList(container) {
        container.innerHTML = '';

        if (!intelEntries.length) {
            container.innerHTML = '<p class="intel-log-status">No intel logged yet.</p>';
            return;
        }

        if (activeFilterType) {
            container.appendChild(renderIntelFilterStatus());
        }

        const filtered = intelEntries.filter(intelEntryMatchesFilter);
        if (!filtered.length) {
            const p = document.createElement('p');
            p.className = 'intel-log-status';
            p.textContent = 'No entries match this filter.';
            container.appendChild(p);
            return;
        }

        filtered.forEach((entry) => container.appendChild(renderIntelEntry(entry)));
    }

    function setupIntelLog() {
        const container = document.getElementById('intel-log');
        if (!container) return;

        container.addEventListener('click', function(e) {
            const clearBtn = e.target.closest('.intel-filter-clear');
            if (clearBtn) {
                activeFilterType = null;
                activeFilterValue = null;
                renderIntelList(container);
                return;
            }

            const filterBtn = e.target.closest('[data-filter-type]');
            if (filterBtn) {
                setIntelFilter(filterBtn.dataset.filterType, filterBtn.dataset.filterValue);
                renderIntelList(container);
            }
        });

        fetch('/intel/manifest.json')
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then((entries) => {
                intelEntries = entries;
                renderIntelList(container);
            })
            .catch((error) => {
                console.error('Failed to load intel log:', error);
                container.innerHTML = '<p class="intel-log-status">Intel feed unavailable right now.</p>';
            });
    }

    function setupHamburgerMenu() {
        const mobileHamburger = document.getElementById('mobile-hamburger-menu');
        const navTabs = document.getElementById('nav-tabs');

        function toggleMenu() {
            if (navTabs) {
                navTabs.classList.toggle('active');
                if (mobileHamburger) {
                    mobileHamburger.classList.toggle('active', navTabs.classList.contains('active'));
                }
            }
        }

        function closeMenu() {
            if (mobileHamburger) mobileHamburger.classList.remove('active');
            if (navTabs) navTabs.classList.remove('active');
        }

        if (mobileHamburger) {
            mobileHamburger.addEventListener('click', toggleMenu);
        }

        // Close menu when a tab is clicked
        if (navTabs) {
            navTabs.querySelectorAll('.nav-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    closeMenu();
                });
            });
        }
    }

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
            tab.addEventListener('click', function(e) {
                const tabId = this.getAttribute('data-tab');
                // If no data-tab attribute, this is an external link - don't handle it
                if (!tabId) return;
                
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
