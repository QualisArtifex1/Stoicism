/*
 * Stoic Explorium JavaScript
 *
 * This file adds interactivity: card toggling, virtue details, timeline reveals,
 * random quote generation, quiz logic, memory game, and hidden easter eggs.
 */

// Wait until DOM content is loaded
window.addEventListener('DOMContentLoaded', () => {
  // Hide the hero section when the user begins exploring
  const heroSection = document.getElementById('hero');
  const beginButton = document.querySelector('#hero .cta-button');
  if (beginButton) {
    beginButton.addEventListener('click', () => {
      // remove the hero so it doesn’t linger at the top after scrolling
      if (heroSection) {
        heroSection.style.display = 'none';
      }
    });
  }
  // Card toggles in "What is Stoicism" section
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const content = card.querySelector('.card-content');
      if (content.classList.contains('active')) {
        content.classList.remove('active');
      } else {
        content.classList.add('active');
      }
    });
  });

  // Virtue detail descriptions
  const virtueDescriptions = {
    wisdom:
      'Wisdom (sophia) is the ability to discern what is true and good. It involves good judgment, practical intelligence, and understanding the natural order of the world. Wisdom guides all other virtues.',
    justice:
      'Justice (dikaiosyne) is fairness and the proper treatment of others. It includes honesty, integrity, and giving each person their due. For the Stoics, justice extends to all humanity as part of a cosmopolitan community.',
    courage:
      'Courage (andreia) is fortitude in the face of difficulty. It entails the bravery to endure hardship, pain or fear when reason requires it, and to stand up for what is right.',
    temperance:
      'Temperance (sophrosyne) is self‑control and moderation. It governs our desires and actions so that we neither overindulge nor deny ourselves needlessly, maintaining balance in all things.'
  };

  const virtueGrid = document.querySelectorAll('.virtue');
  const virtueDetail = document.getElementById('virtue-detail');
  const virtueName = document.getElementById('virtue-name');
  const virtueDesc = document.getElementById('virtue-description');
  const closeDetail = virtueDetail.querySelector('.close-detail');

  virtueGrid.forEach(item => {
    item.addEventListener('click', () => {
      const key = item.getAttribute('data-virtue');
      virtueName.textContent = item.querySelector('h3').textContent;
      virtueDesc.textContent = virtueDescriptions[key];
      virtueDetail.classList.remove('hidden');
      virtueDetail.scrollIntoView({ behavior: 'smooth' });
    });
  });

  closeDetail.addEventListener('click', () => {
    virtueDetail.classList.add('hidden');
  });

  // Generic close handler for any element with .close-detail
  document.querySelectorAll('.close-detail').forEach(btn => {
    btn.addEventListener('click', () => {
      // Hide the parent container (virtue detail or place detail)
      const container = btn.parentElement;
      if (container) {
        container.classList.add('hidden');
      }
    });
  });

  // Timeline reveal
  document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('click', () => {
      const para = item.querySelector('p');
      if (para.classList.contains('visible')) {
        para.classList.remove('visible');
        para.classList.add('hidden');
      } else {
        para.classList.remove('hidden');
        para.classList.add('visible');
      }
    });
  });

  // Quotes from Marcus Aurelius (public domain excerpts)
  const quotes = [
    {
      text:
        'Begin the morning by saying to thyself, I shall meet with the busy‑body, the ungrateful, arrogant, deceitful, envious, unsocial… but I who have seen the nature of the good and of the bad know that none of them can injure me, for we are made for cooperation like hands and feet.'
    },
    {
      text:
        'Every moment think steadily as a Roman and a man to do what thou hast in hand with perfect and simple dignity… do every act of thy life as if it were the last, laying aside all carelessness and self‑love.'
    },
    {
      text:
        'Remember how long thou hast been putting off these things, and how often thou hast received an opportunity from the gods, and yet dost not use it.'
    },
    {
      text:
        'Since it is possible that thou mayest depart from life this very moment, regulate every act and thought accordingly.'
    },
    {
      text:
        'To love only what happens, what was destined. No greater harmony.'
    },
    {
      text:
        'Theophrastus rightly said that offences committed through desire are more blameable than those through anger; he who offends through desire is carried toward doing wrong by pleasure.'
    },
    {
      text:
        'Do wrong to thyself, do wrong to thyself, my soul; but thou wilt no longer have the opportunity of honoring thyself.'
    }
  ];

  const quoteDisplay = document.getElementById('quote-display');
  const newQuoteBtn = document.getElementById('new-quote');

  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDisplay.textContent = quotes[randomIndex].text;
  }

  newQuoteBtn.addEventListener('click', showRandomQuote);

  // show an initial quote
  showRandomQuote();

  // Quiz logic
  const quizData = [
    {
      question: 'According to Stoicism, what is the ultimate goal of life?',
      options: [
        'To gain wealth and pleasure',
        'To live in agreement with nature',
        'To achieve political power',
        'To seek admiration from others'
      ],
      answer: 1,
      explanation:
        'Stoics believed that the goal (telos) is living in agreement with nature.'
    },
    {
      question: 'Which of the following is NOT one of the four cardinal virtues?',
      options: ['Wisdom', 'Justice', 'Compassion', 'Courage'],
      answer: 2,
      explanation:
        'The four virtues are wisdom, justice, courage and temperance.'
    },
    {
      question:
        'Who was the Roman emperor whose personal journal became known as the “Meditations”?',
      options: ['Cicero', 'Seneca', 'Marcus Aurelius', 'Epictetus'],
      answer: 2,
      explanation:
        'Marcus Aurelius, emperor from 161–180 CE, wrote the Meditations as private notes.'
    },
    {
      question: 'Which philosopher was born a slave and later taught in Nicopolis?',
      options: ['Zeno', 'Epictetus', 'Cleanthes', 'Chrysippus'],
      answer: 1,
      explanation:
        'Epictetus was born a slave and taught Stoicism after his exile from Rome.'
    },
    {
      question: 'What did Seneca mean by “We suffer more often in imagination than in reality”?',
      options: [
        'We should avoid imagining at all costs',
        'Our fears often cause more pain than actual events',
        'Reality is always better than imagination',
        'We should suppress our emotions'
      ],
      answer: 1,
      explanation:
        'Seneca observed that we are more often frightened than hurt and that anxiety arises from imagining misfortunes.'
    }
  ];

  let currentQuestion = 0;
  let quizScore = 0;
  const quizModal = document.getElementById('quiz-modal');
  const memoryModal = document.getElementById('memory-modal');
  const quizQuestionEl = document.getElementById('quiz-question');
  const quizOptionsEl = document.getElementById('quiz-options');
  const quizFeedbackEl = document.getElementById('quiz-feedback');
  const nextQuestionBtn = document.getElementById('next-question');

  function showQuizQuestion(index) {
    const q = quizData[index];
    quizQuestionEl.textContent = q.question;
    quizOptionsEl.innerHTML = '';
    quizFeedbackEl.textContent = '';
    nextQuestionBtn.style.display = 'none';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.textContent = opt;
      btn.addEventListener('click', () => handleQuizAnswer(i));
      quizOptionsEl.appendChild(btn);
    });
  }

  function handleQuizAnswer(selected) {
    const q = quizData[currentQuestion];
    if (selected === q.answer) {
      quizScore++;
      quizFeedbackEl.textContent = 'Correct! ' + q.explanation;
      quizFeedbackEl.style.color = 'green';
    } else {
      quizFeedbackEl.textContent = 'Incorrect. ' + q.explanation;
      quizFeedbackEl.style.color = 'red';
    }
    // disable all buttons
    const buttons = quizOptionsEl.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.disabled = true;
    });
    nextQuestionBtn.style.display = 'inline-block';
  }

  nextQuestionBtn.addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      showQuizQuestion(currentQuestion);
    } else {
      // quiz finished
      quizQuestionEl.textContent = `Quiz completed! Your score: ${quizScore} / ${quizData.length}`;
      quizOptionsEl.innerHTML = '';
      quizFeedbackEl.textContent = '';
      nextQuestionBtn.style.display = 'none';
    }
  });

  document.getElementById('start-quiz').addEventListener('click', () => {
    currentQuestion = 0;
    quizScore = 0;
    quizModal.classList.remove('hidden');
    showQuizQuestion(0);
  });

  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.parentElement.parentElement.classList.add('hidden');
    });
  });

  // Memory game logic
  const memoryGrid = document.getElementById('memory-grid');
  const cardValues = [
    'Wisdom',
    'Justice',
    'Courage',
    'Temperance',
    'Virtue',
    'Nature'
  ];

  let memoryCards = [];
  let flippedCards = [];
  let matchedPairs = 0;

  function initMemoryGame() {
    // create array of pairs and shuffle
    const pairs = [...cardValues, ...cardValues];
    pairs.sort(() => Math.random() - 0.5);

    memoryGrid.innerHTML = '';
    memoryCards = [];
    flippedCards = [];
    matchedPairs = 0;

    pairs.forEach(value => {
      const card = document.createElement('div');
      card.classList.add('memory-card');
      card.dataset.value = value;

      const front = document.createElement('div');
      front.classList.add('front');
      front.textContent = '?';
      const back = document.createElement('div');
      back.classList.add('back');
      back.textContent = value;

      card.appendChild(front);
      card.appendChild(back);

      card.addEventListener('click', () => handleMemoryFlip(card));
      memoryCards.push(card);
      memoryGrid.appendChild(card);
    });
  }

  function handleMemoryFlip(card) {
    if (flippedCards.length === 2 || card.classList.contains('matched') || card.classList.contains('flipped')) {
      return;
    }
    card.classList.add('flipped');
    flippedCards.push(card);
    if (flippedCards.length === 2) {
      setTimeout(checkMemoryMatch, 600);
    }
  }

  function checkMemoryMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
      card1.classList.add('matched');
      card2.classList.add('matched');
      matchedPairs++;
      if (matchedPairs === cardValues.length) {
        // all pairs matched
        setTimeout(() => {
          alert('Congratulations! You matched all pairs.');
        }, 300);
      }
    } else {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
    }
    flippedCards = [];
  }

  document.getElementById('start-memory').addEventListener('click', () => {
    initMemoryGame();
    memoryModal.classList.remove('hidden');
  });

  // Hidden secrets
  // Secret 1: keyboard combination Ctrl+Shift+S reveals a hidden message
  let secretOverlay;
  function showSecretMessage() {
    if (!secretOverlay) {
      secretOverlay = document.createElement('div');
      secretOverlay.style.position = 'fixed';
      secretOverlay.style.top = 0;
      secretOverlay.style.left = 0;
      secretOverlay.style.width = '100%';
      secretOverlay.style.height = '100%';
      secretOverlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
      secretOverlay.style.color = 'white';
      secretOverlay.style.display = 'flex';
      secretOverlay.style.alignItems = 'center';
      secretOverlay.style.justifyContent = 'center';
      secretOverlay.style.zIndex = 5000;
      secretOverlay.style.padding = '2rem';
      secretOverlay.style.textAlign = 'center';
      secretOverlay.innerHTML = `<div><h2>Secret Discovered!</h2><p>You found a hidden easter egg. Remember that true power lies in knowing what you can control and letting go of what you cannot.</p><button style="margin-top:1rem;padding:0.5rem 1rem;" id="close-secret">Close</button></div>`;
      document.body.appendChild(secretOverlay);
      document.getElementById('close-secret').addEventListener('click', () => {
        secretOverlay.remove();
        secretOverlay = null;
      });
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
      e.preventDefault();
      showSecretMessage();
    }
  });

  // Secret 2: click the logo five times to reveal a silly quote
  let logoClickCount = 0;
  const logo = document.querySelector('.poster-thumbnail');
  logo.addEventListener('click', () => {
    logoClickCount++;
    if (logoClickCount === 5) {
      alert('Easter egg: “Man is disturbed not by things, but by the views he takes of them.” – Epictetus');
      logoClickCount = 0;
    }
  });

  /**
   * Stoic Library functionality
   * Users can click on parchment scrolls to reveal quotes from Stoic philosophers.
   */
  const libraryQuotes = [
    // Marcus Aurelius quotes
    'All that is from the gods is full of providence. Fortune is full of change; but to yourself belongs the power to gain or to lose: that is to say, to yourself belongs the power to be happy and to live conformably to nature.',
    'Do not act as if thou wert going to live ten thousand years. Death hangs over thee. While thou livest, while it is in thy power, be good.',
    'Every act of yours should be done as if it were your last. Free yourself from the passions; speak as an unfeigned friend, and let it be in perfect simplicity.',
    'Since it is possible that you may depart from life this very moment, regulate every act and thought accordingly.',
    'Look inward; within is the fountain of good, and it will ever bubble up if thou wilt ever dig.',
    // Epictetus quotes
    'Some things are in our control and others not. Things in our control are opinion, pursuit, desire, aversion, and, in a word, whatever are our own actions; things not in our control are body, property, reputation, command, and, in one word, whatever are not our own actions.',
    'Men are disturbed not by things, but by the principles and notions which they form concerning things.',
    // Seneca quotes
    'If you wish to make Pythocles rich, do not add to his store of money, but subtract from his desires.',
    'It is not that we have a short space of time, but that we waste much of it.',
    'People are frugal in guarding their personal property; but as soon as it comes to squandering time, they are most wasteful of the one thing in which it is right to be stingy.',
    // Additional quotes to enrich the library
    'Dwell on the beauty of life. Watch the stars, and see yourself running with them.',
    'The happiness of your life depends upon the quality of your thoughts: therefore, guard accordingly and take care that you entertain no notions unsuitable to virtue and reasonable nature.',
    'It is not death that a man should fear, but he should fear never beginning to live.',
    'He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has.',
    'First say to yourself what you would be; and then do what you have to do.',
    'If a man knows not to which port he sails, no wind is favourable.',
    'Life is long, if you know how to use it.',
    'It does not matter how many books you have, but how good the ones you have are.',
    'Lead me, Zeus, and you, Fate, wherever you have assigned me.'
  ];

  const scrollElements = document.querySelectorAll('.scroll');
  const quoteModal = document.getElementById('quote-modal');
  const libraryQuoteEl = document.getElementById('library-quote');

  scrollElements.forEach(scroll => {
    scroll.addEventListener('click', () => {
      const index = parseInt(scroll.getAttribute('data-index'));
      if (!isNaN(index) && libraryQuotes[index]) {
        libraryQuoteEl.textContent = libraryQuotes[index];
        quoteModal.classList.remove('hidden');
      }
    });
  });

  /**
   * Stoic Places functionality
   * Clicking on a place shows its description.
   */
  const placeDetails = {
    athens: {
      name: 'Athens',
      description: 'Athens was the birthplace of Stoicism. Zeno taught his disciples on the Stoa Poikile (Painted Porch) in the Agora around 300 BCE. Later, the school was headed by Cleanthes and Chrysippus, who codified Stoic logic and ethics.'
    },
    rhodes: {
      name: 'Rhodes',
      description: 'Rhodes was home to Panaetius and his student Posidonius. Panaetius led the Middle Stoic school, softened strict doctrines, and introduced Stoicism to Roman elites. Posidonius expanded Stoicism into natural science and geography and taught Cicero.'
    },
    rome: {
      name: 'Rome',
      description: 'In Rome, Stoicism flourished among senators and emperors. Seneca wrote moral essays and letters advising Nero, reminding us that we suffer more in imagination than reality. Marcus Aurelius ruled as a philosopher‑emperor and penned his Meditations while governing.'
    },
    nicopolis: {
      name: 'Nicopolis',
      description: 'After being expelled from Rome, Epictetus established a school at Nicopolis in Greece. There, he taught that while external events are beyond our control, our judgments remain free.'
    },
    carnuntum: {
      name: 'Carnuntum',
      description: 'Carnuntum, a Roman military camp on the Danube (modern Austria), was where Marcus Aurelius wrote parts of his Meditations during campaigns. In his tent, he reflected on impermanence and the duty of a Roman.'
    }
    ,
    citium: {
      name: 'Citium',
      description: 'Citium in Cyprus was the birthplace of Zeno, founder of Stoicism. After a shipwreck destroyed his fortunes, he turned to philosophy and eventually established his school in Athens.'
    },
    tarsus: {
      name: 'Tarsus',
      description: 'Tarsus, in Cilicia, produced the Stoic Athenodorus, who later tutored the young Octavian (Augustus). He advocated moderation and self‑discipline in public service.'
    },
    alexandria: {
      name: 'Alexandria',
      description: 'Alexandria in Egypt, with its great Library and Museion, was a hub of learning. Stoic texts were studied alongside works of Plato and Aristotle, and Stoic ideas influenced Hellenistic scholars there.'
    }
  };

  const placeNameEl = document.getElementById('place-name');
  const placeDescEl = document.getElementById('place-description');
  const placeDetailBox = document.getElementById('place-detail');

  document.querySelectorAll('.place').forEach(place => {
    place.addEventListener('click', () => {
      const key = place.getAttribute('data-place');
      const detail = placeDetails[key];
      if (detail) {
        placeNameEl.textContent = detail.name;
        placeDescEl.textContent = detail.description;
        placeDetailBox.classList.remove('hidden');
        placeDetailBox.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Close button for place detail
  // Attach a click listener to the place detail box so clicking the × button hides it
  placeDetailBox.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('close-detail')) {
      placeDetailBox.classList.add('hidden');
    }
  });

  /**
   * Stoic Scavenger Hunt functionality
   * Players solve clues by typing answers. Correct answers reveal the next clue.
   */
  function handleHuntStep(step) {
    const inputEl = document.getElementById('answer-' + step);
    const hintEl = document.getElementById('hint-' + step);
    const userAnswer = inputEl.value.trim().toLowerCase();
    let correct = false;
    switch (step) {
      case 1:
        // Epictetus taught about control
        correct = userAnswer.includes('epictetus');
        break;
      case 2:
        // Panaetius modernised Stoicism and brought it to Rome
        correct = userAnswer.includes('panaetius');
        break;
      case 3:
        // Marcus Aurelius: regulate every act and thought
        if ((userAnswer.includes('act') || userAnswer.includes('acts')) && userAnswer.includes('thought')) {
          correct = true;
        }
        break;
      case 4:
        // Seneca: not a short life, we waste much of it
        if (userAnswer.includes('waste')) {
          correct = true;
        }
        break;
      case 5:
        // Secret message: "Secret Discovered"
        const normalized = userAnswer.replace(/\s+/g, ' ').trim();
        correct = normalized === 'secret discovered';
        break;
      default:
        correct = false;
    }
    if (correct) {
      hintEl.style.color = 'green';
      hintEl.textContent = 'Correct! Proceed to the next clue.';
      setTimeout(() => {
        const currentStepEl = document.getElementById('hunt-step-' + step);
        if (currentStepEl) {
          currentStepEl.classList.add('hidden');
        }
        if (step < 5) {
          const next = step + 1;
          const nextEl = document.getElementById('hunt-step-' + next);
          if (nextEl) {
            nextEl.classList.remove('hidden');
            nextEl.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          const completeEl = document.getElementById('hunt-complete');
          completeEl.classList.remove('hidden');
          completeEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    } else {
      hintEl.style.color = 'red';
      hintEl.textContent = 'Not quite. Try again!';
    }
  }

  document.querySelectorAll('.hunt-submit').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.getAttribute('data-step'));
      handleHuntStep(step);
    });
  });

  /**
   * Stoic Exercises functionality
   * Each exercise card flips to reveal a reflective prompt when clicked.
   */
  const exercisePrompts = [
    'Morning Reflection: List three things you can control today and commit to focusing only on them.',
    'Evening Review: Did you act according to your principles? Write a short reflection on one action you\'re proud of and one you can improve.',
    'Premeditatio Malorum: Imagine a challenge you might face tomorrow. Describe how you will respond with virtue and calm.',
    'Sympatheia: Consider how you are connected to others and nature. Write down your role in the larger cosmos.',
    'Virtue Focus: Choose one virtue—wisdom, courage, justice or temperance—and plan an action to practise it today.',
    'Negative Visualization: Envision losing something you value (a possession, a role). How would you maintain equanimity?',
    'Gratitude Journal: Write down three things you are grateful for today, no matter how small.',
    'Mindful Breathing: Close your eyes and follow your breath for two minutes. Observe thoughts as they come and go without judgment.'
  ];

  document.querySelectorAll('.exercise-card').forEach(card => {
    const idx = parseInt(card.getAttribute('data-index'));
    const backEl = card.querySelector('.back');
    if (backEl && !isNaN(idx)) {
      backEl.textContent = exercisePrompts[idx];
    }
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });

  /**
   * Stoic Word Scramble functionality
   * Players unscramble Stoic concepts in sequence.
   */
  const unscrambleAnswers = {
    1: 'virtue',
    2: 'logos',
    3: 'apatheia',
    4: 'eudaimonia',
    5: 'sympatheia'
  };

  function handleScrambleStep(step) {
    const inputEl = document.getElementById('scramble-answer-' + step);
    const hintEl = document.getElementById('scramble-hint-' + step);
    const userAnswer = inputEl.value.trim().toLowerCase();
    const correct = unscrambleAnswers[step];
    if (userAnswer === correct) {
      hintEl.style.color = 'green';
      hintEl.textContent = 'Correct!';
      setTimeout(() => {
        const current = document.getElementById('scramble-step-' + step);
        if (current) current.classList.add('hidden');
        const next = document.getElementById('scramble-step-' + (step + 1));
        if (next) {
          next.classList.remove('hidden');
          next.scrollIntoView({ behavior: 'smooth' });
        } else {
          const complete = document.getElementById('scramble-complete');
          if (complete) complete.classList.remove('hidden');
          complete.scrollIntoView({ behavior: 'smooth' });
        }
      }, 400);
    } else {
      hintEl.style.color = 'red';
      hintEl.textContent = 'Try again!';
    }
  }

  document.querySelectorAll('.scramble-submit').forEach(button => {
    button.addEventListener('click', () => {
      const step = parseInt(button.getAttribute('data-step'));
      handleScrambleStep(step);
    });
  });
});
