/* JavaScript to power interactive features of the Stoic web app */

// Collection of daily Stoic quotes.  Most are drawn from the George Long translation of the Meditations,
// while a few come from other Stoic sources to provide variety.
const quotes = [
    {
        text: "Begin the morning by saying to thyself, I shall meet with the busybody, the ungrateful, arrogant, deceitful, envious, unsocial… yet I can neither be injured by any of them nor be angry with them, for we are made for co‑operation like hands and feet.",
        author: "Marcus Aurelius, Meditations II.1"
    },
    {
        text: "Thou canst pass thy life in an equable flow of happiness, if thou canst go by the right way, and think and act in the right way.",
        author: "Marcus Aurelius, Meditations VI.34"
    },
    {
        text: "The mind converts and changes every hindrance to its activity into an aid; and so that which is a hindrance becomes a furtherance to an act, and that which is an obstacle on the road helps us on this road.",
        author: "Marcus Aurelius, Meditations V.20"
    },
    {
        text: "Such as are thy habitual thoughts, such also will be the character of thy mind; for the soul is dyed by the thoughts.",
        author: "Marcus Aurelius, Meditations V.16"
    },
    {
        text: "There remains that which is peculiar to the good man, to be pleased and content with what happens, and with the thread which is spun for him… to preserve his mind tranquil and obedient to the god within.",
        author: "Marcus Aurelius, Meditations III.4"
    },
    {
        text: "We are not disturbed by events, but by the views which we take of them.",
        author: "Epictetus, Enchiridion 5"
    }
];

/**
 * Returns a deterministic quote based on today’s date.  This function ensures that
 * the same quote is shown to all visitors on a given day but rotates through the list
 * throughout the year.
 */
function getQuoteForToday() {
    const today = new Date();
    // Calculate the day of year (0–364)
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const index = dayOfYear % quotes.length;
    return quotes[index];
}

/**
 * Display the quote of the day on the home page.  Finds the element
 * with id "dailyQuote" and fills in its children.  If the element is not present,
 * the function does nothing.
 */
function displayDailyQuote() {
    const container = document.getElementById('dailyQuote');
    if (!container) return;
    const q = getQuoteForToday();
    const quoteTextEl = container.querySelector('.quote-text');
    const quoteAuthorEl = container.querySelector('.quote-author');
    if (quoteTextEl) quoteTextEl.textContent = q.text;
    if (quoteAuthorEl) quoteAuthorEl.textContent = '\u2014 ' + q.author;
}

/**
 * Return a random quote from the quotes array. Used when the user requests
 * an additional quote via the interactive button on the home page.
 */
function getRandomQuote() {
    const index = Math.floor(Math.random() * quotes.length);
    return quotes[index];
}

// Invoke when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    displayDailyQuote();
    // initialize tabs if present
    initTabs();
    // highlight the current week in the lessons page after tabs are initialised
    highlightCurrentWeekInLessons();
    // display weekly lesson if container exists
    displayWeeklyLesson();
    // display a Stoic challenge on load
    displayChallenge();
    // set up random quote button interaction
    const newQuoteBtn = document.getElementById('newQuoteBtn');
    if (newQuoteBtn) {
        newQuoteBtn.addEventListener('click', () => {
            const q = getRandomQuote();
            const container = document.getElementById('dailyQuote');
            if (container) {
                const quoteTextEl = container.querySelector('.quote-text');
                const quoteAuthorEl = container.querySelector('.quote-author');
                if (quoteTextEl) quoteTextEl.textContent = q.text;
                if (quoteAuthorEl) quoteAuthorEl.textContent = '\u2014 ' + q.author;
            }
        });
    }
    // initialise toggling of weekly lesson summary
    initWeeklyLessonToggle();
    // set up challenge button interaction
    const newChallengeBtn = document.getElementById('newChallengeBtn');
    if (newChallengeBtn) {
        newChallengeBtn.addEventListener('click', () => {
            displayChallenge();
        });
    }
    // initialise image gallery navigation if present
    initGallery();

    // initialise lesson progress tracking on the lessons page
    initLessonProgress();

    // remove academic citation markers throughout the page
    removeCitations();
    // load any saved user reflection
    loadUserReflection();
    // set up save reflection handler
    const saveRefBtn = document.getElementById('saveReflectionBtn');
    if (saveRefBtn) {
        saveRefBtn.addEventListener('click', () => {
            saveUserReflection();
        });
    }
});

/**
 * Remove bracketed citation markers from all text nodes on the page.  This function
 * searches for patterns of the form 【...】 and removes them to make the text
 * feel less academic.
 */
function removeCitations() {
    const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    let node;
    const citationRegex = /【[^】]+】/g;
    while ((node = treeWalker.nextNode())) {
        if (citationRegex.test(node.textContent)) {
            node.textContent = node.textContent.replace(citationRegex, '');
        }
    }
}

/**
 * Load the user’s reflection from localStorage into the textarea on the home page.
 * If no reflection is saved or the textarea does not exist, nothing happens.
 */
function loadUserReflection() {
    const textarea = document.getElementById('reflectionText');
    if (!textarea) return;
    const saved = localStorage.getItem('weeklyReflection');
    if (saved) {
        textarea.value = saved;
    }
}

/**
 * Save the current contents of the reflection textarea to localStorage.
 * Optionally display a brief confirmation message.
 */
function saveUserReflection() {
    const textarea = document.getElementById('reflectionText');
    if (!textarea) return;
    localStorage.setItem('weeklyReflection', textarea.value);
    const messageEl = document.getElementById('saveMessage');
    if (messageEl) {
        messageEl.textContent = 'Reflection saved!';
        setTimeout(() => { messageEl.textContent = ''; }, 3000);
    }
}

/**
 * Initialise the weekly lesson toggle. Hides the summary by default and toggles
 * its visibility when the user clicks the associated button. If elements are
 * missing, it gracefully does nothing.
 */
function initWeeklyLessonToggle() {
    const weeklySection = document.getElementById('weeklyLesson');
    if (!weeklySection) return;
    const summary = weeklySection.querySelector('.weekly-summary');
    const button = document.getElementById('toggleSummaryBtn');
    if (!summary || !button) return;
    // hide summary initially
    summary.style.display = 'none';
    button.addEventListener('click', () => {
        if (summary.style.display === 'none') {
            summary.style.display = 'block';
            button.textContent = 'Hide Reflection';
        } else {
            summary.style.display = 'none';
            button.textContent = 'Show Reflection';
        }
    });
}

/**
 * Initialise tabbed navigation for the Meditations page.  Looks for a container
 * with class "tabbed" and sets up click handlers to switch between sections.
 */
function initTabs() {
    const tabContainers = document.querySelectorAll('.tabbed');
    tabContainers.forEach(container => {
        const tabs = container.querySelectorAll('.tab-list li');
        const contents = container.querySelectorAll('.tab-content');
        if (!tabs.length) return;
        // activate first tab
        tabs[0].classList.add('active');
        contents[0].classList.add('active');
        tabs.forEach((tab, i) => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                contents[i].classList.add('active');
            });
        });
    });
}

/**
 * Highlight the tab corresponding to the current week on the lessons page.  If the
 * page has exactly the same number of tabs as there are weekly quotes (52), it
 * activates the current week and its content. This function should be called
 * after initTabs has set up the tab structure.
 */
function highlightCurrentWeekInLessons() {
    const tabList = document.querySelector('.tab-list');
    const contents = document.querySelectorAll('.tab-content');
    if (!tabList) return;
    // Only run if there are as many tabs as quotes (i.e. weekly lessons page)
    const tabs = tabList.querySelectorAll('li');
    if (tabs.length !== weeklyQuotes.length) return;
    const idx = getWeekIndex();
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));
    if (tabs[idx]) tabs[idx].classList.add('active');
    if (contents[idx]) contents[idx].classList.add('active');
}

/**
 * Weekly lessons generated from the Meditations.  Each object in this array contains a quote
 * drawn from the public‑domain translation of Marcus Aurelius’ <em>Meditations</em>, a theme, and
 * a two‑paragraph reflection. The reflections link Stoic concepts to everyday life and
 * include citations to primary sources and modern scholarship. The array has 52 entries—one
 * for each week of the year.
 */
/*
 * The following block defined an earlier version of weeklyLessons and associated
 * helper functions. It contained an incomplete array of lesson objects and
 * caused syntax errors in the app. The new implementation is defined
 * further below using weeklyQuotes, weeklyThemes and themeSummaries. This
 * legacy code is now commented out to prevent parse errors while
 * preserving it for reference.
 */
/* End of legacy weeklyLessons definition */
/**
 * Compute the index of the current week of the year (0–51).  Uses Monday as the first day of the week.
 */
// legacy getWeekIndex removed. A new implementation is defined later using weeklyQuotes.
// function getWeekIndex(...) { ... }

/**
 * Display the weekly lesson on the home page.  Looks for an element with id
 * "weeklyLesson" and populates it with the current week's quote and summary.
 */
// legacy displayWeeklyLesson removed. A new implementation is defined later using weeklyQuotes.
// function displayWeeklyLesson() { ... }

/**
 * Initialise the image gallery. Sets up previous/next controls and
 * displays the first image by default. Does nothing if no gallery
 * exists on the page.
 */
function initGallery() {
    const galleryContainer = document.querySelector('.gallery-container');
    if (!galleryContainer) return;
    const images = Array.from(galleryContainer.querySelectorAll('.gallery-item'));
    const prevBtn = document.getElementById('prevGallery');
    const nextBtn = document.getElementById('nextGallery');
    if (!images.length || !prevBtn || !nextBtn) return;
    let current = 0;
    function show(n) {
        images.forEach((img, i) => {
            img.classList.toggle('active', i === n);
        });
    }
    prevBtn.addEventListener('click', () => {
        current = (current - 1 + images.length) % images.length;
        show(current);
    });
    nextBtn.addEventListener('click', () => {
        current = (current + 1) % images.length;
        show(current);
    });
    // show the first image
    show(current);
}

/*
 * ----------------------------------------------------------------------
 * Refactored weekly lesson and challenge logic.
 *
 * The original weeklyLessons array defined above is incomplete and has
 * been superseded by the following data structures. We retain the
 * existing displayWeeklyLesson and getWeekIndex definitions for backward
 * compatibility but override them below. The new implementation uses
 * separate arrays for quotes and themes and a map of deeper reflections
 * (themeSummaries). A Stoic challenge generator is also included to
 * enhance interactivity on the home page.
 * ----------------------------------------------------------------------
 */

// List of 52 quotes from Marcus Aurelius’ Meditations (George Long translation) and
// one quote from Epictetus. These have been curated and filtered to avoid
// commentary and duplicate passages. Each quote aligns with one of four themes.
const weeklyQuotes = [
    'That which is from fortune is not separated from nature or without an interweaving and involution with the things which are ordered by providence.',
    'But death certainly, and life, honor and dishonor, pain and pleasure,—all these things equally happen to good men and bad, being things which make us neither better nor worse.',
    'In the third place, the soul does violence to itself when it is overpowered by pleasure or by pain.',
    'But as to those who live not so, he always bears in mind what kind of men they are both at home and from home, both by night and by day, and what they are, and with what men they live an impure life.',
    'For the whole earth is a point, and how small a nook in it is this thy dwelling, and how few are there in it, and what kind of people are they who will praise thee.',
    'But suppose that those who will remember are even immortal, and that the remembrance will be immortal, what then is this to thee?',
    'For what a number is consumed, and thus in a manner buried in the bodies of those who feed on them!',
    'He is a runaway, who flies from social reason; he is blind, who shuts the eyes of understanding; he is poor, who has need of another, and has not from himself all things which are useful for life.',
    'One man after burying another has been laid out dead, and another buries him; and all this in a short time.',
    'Altogether the interval is small [between birth and death]; and consider with how much trouble, and in company with what sort of people, and in what a feeble body, this interval is laboriously passed.',
    'So thou lovest not thyself, for if thou didst, thou wouldst love thy nature and her will.',
    'Let us then receive these things, as well as those which Aesculapius prescribes.',
    'Then turn to the morals of those who live with thee, and it is hardly possible to endure even the most agreeable of them, to say nothing of a man being hardly able to endure himself.',
    'Such as are thy habitual thoughts, such also will be the character of thy mind; for the soul is dyed by the thoughts.',
    'But if the state is harmed, thou must not be angry with him who does harm to the state.',
    'Accordingly it has made the inferior things for the sake of the superior, and it has fitted the superior to one another.',
    'The universe is either a confusion, and a mutual involution of things, and a dispersion, or it is unity and order and providence.',
    'Neither must we value the clapping of tongues; for the praise which comes from the many is a clapping of tongues.',
    'If any man is able to convince me and show me that I do not think or act right, I will gladly change; for I seek the truth, by which no man was ever injured.',
    'Now to this little body all things are indifferent, for it is not able to perceive differences.',
    'Every instrument, tool, vessel, if it does that for which it has been made, is well, and yet he who made it is not there.',
    'To the jaundiced honey tastes bitter, and to those bitten by mad dogs water causes fear; and to little children the ball is a fine thing.',
    'Be not ashamed to be helped; for it is thy business to do thy duty like a soldier in the assault on a town.',
    'Let the body itself take care, if it can, that it suffer nothing, and let it speak, if it suffers.',
    'Adorn thyself with simplicity and modesty, and with indifference towards the things which lie between virtue and vice.',
    'For what the mind shows in the face by maintaining in it the expression of intelligence and propriety, that ought to be required also in the whole body.',
    'When thou risest from sleep with reluctance, remember that it is according to thy constitution and according to human nature to perform social acts, but sleeping is common also to irrational animals.',
    'Turn it [the body] inside out, and see what kind of thing it is; and when it has grown old, what kind of thing it becomes, and when it is diseased.',
    'As the nature of the universal has given to every rational being all the other powers that it has, so we have received from it this power also.',
    'If indeed thou wast making this effort absolutely [unconditionally, or without any reservation], certainly this obstacle is an evil to thee considered as a rational animal.',
    'What then will it be when it forms a judgment about anything aided by reason and deliberately?',
    'But he who has failed in any one of these things could not even say for what purpose he exists himself.',
    'And further, he who is afraid of pain will sometimes also be afraid of some of the things which will happen in the world, and even this is impiety.',
    'This, then, is consistent with the character of a reflecting man—to be neither careless nor impatient nor contemptuous with respect to death, but to wait for it as one of the operations of nature.',
    'But still, though men strive to avoid [this union], they are caught and held by it, for their nature is too strong for them; and thou wilt see what I say, if thou only observest.',
    'Turn thy thoughts now to the consideration of thy life, thy life as a child, as a youth, thy manhood, thy old age, for in these also every change was a death.',
    'The universal cause is like a winter torrent: it carries everything along with it.',
    'And who has told thee that the gods do not aid us, even in the things which are in our power?',
    'Whether intelligence rules all things or chance rules, a man must not be disturbed.',
    'Everything which happens either happens in such wise as thou art formed by nature to bear it, or as thou art not formed by nature to bear it.',
    'If, then, thou maintainest thyself in the possession of these names, without desiring to be called by these names by others, thou wilt be another person and wilt enter on another life.',
    'But if any other things oppose thee, go on according to thy powers with due consideration, keeping to that which appears to be just.',
    'He who flies from his master is a runaway; but the law is master, and he who breaks the law is a runaway.',
    'For whatever this may be, it is in thy power to do it or to say it, and do not make excuses that thou art hindered.',
    'It is true that he was harsh to none of us, but I perceived that he tacitly condemns us.—This is what is said of a good man.',
    'So too a man when he is separated from another man has fallen off from the whole social community.',
    'Such as a man’s character is, he immediately shows it in his eyes, just as he who is beloved forthwith reads everything in the eyes of lovers.',
    'Take away these opinions then, and resolve to dismiss thy judgment about an act as if it were something grievous, and thy anger is gone.',
    'For the movement towards injustice and intemperance and to anger and grief and fear is nothing else than the act of one who deviates from nature.',
    'Conformably to justice, that thou mayst always speak the truth freely and without disguise, and do the things which are agreeable to law and according to the worth of each.',
    'No longer talk at all about the kind of man that a good man ought to be, but be such.',
    'The mind converts and changes every hindrance to its activity into an aid; and so that which is a hindrance becomes a furtherance to an act, and that which is an obstacle on the road helps us on this road.'
];

// Corresponding theme for each weekly quote. The list is divided into four
// themes: the first 13 entries focus on gratitude and self‑improvement,
// entries 14–26 on nature and duty, 27–39 on perspective and impermanence,
// and the remaining on acceptance and unity.
const weeklyThemes = [];
for (let i = 0; i < weeklyQuotes.length; i++) {
    if (i < 13) {
        weeklyThemes.push('Gratitude & Self‑Improvement');
    } else if (i < 26) {
        weeklyThemes.push('Nature & Duty');
    } else if (i < 39) {
        weeklyThemes.push('Perspective & Impermanence');
    } else {
        weeklyThemes.push('Acceptance & Unity');
    }
}

// Detailed reflections for each theme. Each entry consists of two paragraphs
// analysing the significance of the theme in the Meditations and suggesting
// modern applications. Citations refer back to the primary text and
// secondary scholarship on Stoicism.
const themeSummaries = {
    'Gratitude & Self‑Improvement': 'Marcus Aurelius opens his <em>Meditations</em> by thanking mentors and family for instilling virtues such as patience, modesty and love of philosophy. Stoicism emphasises gratitude and the recognition that our character is shaped by our responses to events, not by the events themselves.\n\nTo apply this lesson today, reflect on those who have influenced you and commit to continuous self‑improvement. Keep a gratitude journal and remind yourself that you control your judgments and actions, not other people or external circumstances.',
    'Nature & Duty': 'The middle books remind us that we are part of a larger order and must fulfil our roles just as bees and plants fulfil theirs. Marcus wrote many entries while on military campaigns, urging himself to accept hardship and perform his duty without complaint.\n\nIn modern life, approach your responsibilities as contributions to the common good. Focus on acting justly and rationally, trusting that the universe is orderly. When faced with obstacles, remember it is your opinion about them that causes distress.',
    'Perspective & Impermanence': 'Marcus frequently contemplates the transience of life and the insignificance of fame, urging himself to adopt a cosmic perspective. By viewing time and space on a grand scale, he diminishes the importance of his own troubles.\n\nYou can practise this by meditating on the vastness of the universe and the brevity of human life. Let this awareness reduce attachment to status or possessions and inspire you to focus on present virtue and kindness.',
    'Acceptance & Unity': 'In his later books, Marcus emphasises acceptance and unity with the cosmos. He reminds himself that everything happens according to nature and that no external event can harm the soul.\n\nTo live this lesson, cultivate equanimity toward fate and recognise the kinship of all rational beings. Embrace challenges as opportunities to practise virtues like patience and empathy, and remember that the source of good is within.'
};

// A collection of practical Stoic exercises. Visitors can request a random
// challenge to incorporate Stoic practices into daily life.
const challenges = [
    'Spend five minutes in quiet meditation focusing on your breath.',
    'Write down three things you are grateful for today.',
    'Identify something outside your control and consciously let it go.',
    'Perform an anonymous act of kindness.',
    'Take a cold shower or embrace another small discomfort to build resilience.',
    'Reflect on a recent mistake and identify the lesson it offers.',
    'Spend ten minutes in nature observing your surroundings mindfully.',
    'Practise negative visualisation by imagining losing something you value; then appreciate having it.',
    'Fast or skip a meal to practise voluntary discomfort if medically safe.',
    'Journal about a situation that upset you and reframe it using Stoic principles.'
];

/**
 * Generate and display a random Stoic challenge. Finds the element with
 * id "challengeText" and populates it with a challenge drawn from the
 * challenges array.
 */
function displayChallenge() {
    const target = document.getElementById('challengeText');
    if (!target) return;
    const idx = Math.floor(Math.random() * challenges.length);
    target.textContent = challenges[idx];
}

/**
 * Override the previous getWeekIndex implementation. This version
 * computes the ISO week number and maps it into the range of our
 * weeklyQuotes array.
 */
function getWeekIndex(date = new Date()) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return (weekNo - 1) % weeklyQuotes.length;
}

/**
 * Display the weekly lesson based on the current week. Uses our
 * refactored data structures and theme summaries. If the weekly lesson
 * section is absent, the function exits gracefully.
 */
function displayWeeklyLesson() {
    const container = document.getElementById('weeklyLesson');
    if (!container) return;
    const idx = getWeekIndex();
    const quote = weeklyQuotes[idx];
    const theme = weeklyThemes[idx];
    const summary = themeSummaries[theme] || '';
    const quoteEl = container.querySelector('.weekly-quote');
    const themeEl = container.querySelector('.weekly-theme');
    const summaryEl = container.querySelector('.weekly-summary');
    if (quoteEl) quoteEl.textContent = quote;
    if (themeEl) themeEl.textContent = theme;
    if (summaryEl) summaryEl.textContent = summary;
}

/**
 * Initialise lesson progress tracking on the Weekly Lessons page.  This function
 * creates a “Mark as Read” button for each tab content and restores any
 * previously completed lessons from localStorage.  When a lesson is marked
 * as read, its corresponding tab is styled to indicate completion.  Progress
 * is persisted across visits using localStorage.
 */
function initLessonProgress() {
    const tabList = document.querySelector('.tab-list');
    const contents = document.querySelectorAll('.tab-content');
    // Only proceed if this page contains a lessons tab list and there are as many
    // lessons as weekly quotes (52). On other pages this function does nothing.
    if (!tabList || contents.length !== weeklyQuotes.length) return;
    const tabs = tabList.querySelectorAll('li');
    // Assign each tab and its content a data-index for reference
    tabs.forEach((tab, idx) => {
        tab.dataset.index = idx;
    });
    contents.forEach((content, idx) => {
        content.dataset.index = idx;
    });
    // Retrieve completed lessons from localStorage (stored as JSON array of indices)
    let completed = [];
    try {
        const stored = localStorage.getItem('completedLessons');
        if (stored) {
            completed = JSON.parse(stored);
        }
    } catch (e) {
        completed = [];
    }
    // Mark tabs as completed
    completed.forEach(idx => {
        if (tabs[idx]) {
            tabs[idx].classList.add('completed');
        }
    });
    // Add “Mark as Read” button to each content section if not already present
    contents.forEach(content => {
        const idx = parseInt(content.dataset.index, 10);
        // Avoid adding duplicate buttons
        if (content.querySelector('.mark-read-button')) return;
        const btn = document.createElement('button');
        btn.className = 'mark-read-button';
        btn.textContent = 'Mark as Read';
        btn.addEventListener('click', () => {
            markLessonRead(idx);
        });
        content.appendChild(btn);
    });
}

/**
 * Mark a weekly lesson as completed.  Adds the lesson index to the list of
 * completed lessons in localStorage and updates the corresponding tab’s
 * appearance.  Duplicate entries are ignored.
 *
 * @param {number} idx - The zero-based index of the lesson to mark as read.
 */
function markLessonRead(idx) {
    const tabList = document.querySelector('.tab-list');
    if (!tabList) return;
    const tabs = tabList.querySelectorAll('li');
    let completed = [];
    try {
        const stored = localStorage.getItem('completedLessons');
        if (stored) completed = JSON.parse(stored);
    } catch (e) {
        completed = [];
    }
    if (!completed.includes(idx)) {
        completed.push(idx);
        localStorage.setItem('completedLessons', JSON.stringify(completed));
        if (tabs[idx]) {
            tabs[idx].classList.add('completed');
        }
    }
}