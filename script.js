/*
 * Stoic Explorium JavaScript
 *
 * This file adds interactivity: card toggling, virtue details, timeline reveals,
 * random quote generation, quiz logic, memory game, and hidden easter eggs.
 */

// Wait until DOM content is loaded
window.addEventListener('DOMContentLoaded', () => {
  // The hero section now contains only an image, so no need to hide it on click
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
    ,
    // Additional quotes to fill the expanded library
    'Our life is what our thoughts make it.',
    'The universe is change; our life is what our thoughts make it.',
    'If you are distressed by anything external, the pain is not due to the thing itself, but to your estimate of it; and this you have the power to revoke at any moment.',
    'You have power over your mind—not outside events. Realise this, and you will find strength.',
    'No man is free who is not master of himself.',
    'Luck is what happens when preparation meets opportunity.',
    'While we wait for life, life passes.',
    'Difficulties strengthen the mind, as labour does the body.',
    'We should always allow some time to elapse; time discloses the truth.',
    'Don’t explain your philosophy. Embody it.'
    ,
    'Be tolerant with others and strict with yourself.'
  ];

  const scrollElements = document.querySelectorAll('.scroll');
  const quoteModal = document.getElementById('quote-modal');
  const libraryQuoteEl = document.getElementById('library-quote');

  scrollElements.forEach(scroll => {
    scroll.addEventListener('click', () => {
      const index = parseInt(scroll.getAttribute('data-index'));
      if (!isNaN(index)) {
        // If the quote exists, show it; otherwise pick a random quote from the array
        const quote = libraryQuotes[index] || libraryQuotes[Math.floor(Math.random() * libraryQuotes.length)];
        libraryQuoteEl.textContent = quote;
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
    ,
    apameia: {
      name: 'Apameia',
      description: 'Apameia (modern Apamea in Syria) was the birthplace of the polymath Posidonius. Though he later taught in Rhodes, his early life in Syria broadened his perspective and informed his historical and geographical writings.'
    },
    hierapolis: {
      name: 'Hierapolis',
      description: 'Hierapolis (modern Pamukkale, Turkey) was the birthplace of Epictetus. Born a slave, he endured hardship and later gained his freedom, eventually teaching Stoicism in Nicopolis.'
    },
    corduba: {
      name: 'Corduba',
      description: 'Corduba (modern Córdoba, Spain) was the birthplace of Seneca the Younger. The cultural milieu of Hispania shaped his early years before he became a leading Stoic author and advisor in Rome.'
    },
    pergamum: {
      name: 'Pergamum',
      description: 'Pergamum in Asia Minor was renowned for its library and academic institutions. Stoic philosophers such as Panaetius studied in its halls, and its intellectual atmosphere contributed to the evolution of Stoic thought.'
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

  /**
   * Philosopher biographies
   * A dictionary mapping philosopher names to their biographical summaries.
   */
  const philosopherDetails = {
    'Zeno of Citium': {
      title: 'Zeno of Citium (c. 334–262 BCE)',
      text:
        'Born in Citium, Cyprus, Zeno was a merchant’s son who lost his fortune in a shipwreck near Athens. He studied with Cynics like Crates of Thebes before founding the Stoic school around 300 BCE on the Stoa Poikile. Zeno taught that happiness comes from living in accordance with nature and reason and that all humans share in a universal brotherhood.'
    },
    Cleanthes: {
      title: 'Cleanthes of Assos (c. 331–230 BCE)',
      text:
        'A former boxer from Assos in Asia Minor, Cleanthes studied under Zeno for twenty years and succeeded him as head of the Stoic school. He emphasised the unity of physics, logic and ethics and composed the famous “Hymn to Zeus,” celebrating the rational order of the cosmos.'
    },
    Chrysippus: {
      title: 'Chrysippus of Soli (c. 279–206 BCE)',
      text:
        'Originally from Soli in Cilicia, Chrysippus became the third scholarch of the Stoa after Cleanthes. A prolific author of over 700 works, he systematised Stoic logic and physics, developing propositional logic and arguing that living according to nature means living rationally. Ancient writers said, “If there had been no Chrysippus, there would have been no Stoa.”'
    },
    Panaetius: {
      title: 'Panaetius of Rhodes (c. 185–110 BCE)',
      text:
        'A pupil of Diogenes of Babylon and Antipater of Tarsus, Panaetius became head of the Stoic school around 129 BCE. He softened earlier doctrines, rejecting divination and cosmic conflagration, and argued that virtue alone might not suffice for happiness without some external goods. Panaetius introduced Stoicism to Rome and inspired Cicero’s treatise “On Duties.”'
    },
    Posidonius: {
      title: 'Posidonius of Apameia/Rhodes (c. 135–51 BCE)',
      text:
        'A student of Panaetius, Posidonius was a polymath who travelled widely, taught in Rhodes and attempted to measure the Earth’s circumference. He blended Stoicism with Platonic and Aristotelian ideas, wrote on astronomy, geography and history, and his teachings influenced Cicero, Seneca and other Roman intellectuals.'
    },
    Seneca: {
      title: 'Lucius Annaeus Seneca (c. 4 BCE–65 CE)',
      text:
        'Born in Corduba (modern Córdoba, Spain) and educated in Rome, Seneca the Younger was a statesman, playwright and Stoic philosopher. He served as tutor and advisor to the emperor Nero. Seneca’s essays and letters counselled self‑control, the wise use of time and the distinction between imagined and actual suffering. Accused of conspiracy, he was compelled to take his own life in 65 CE.'
    },
    Epictetus: {
      title: 'Epictetus (c. 55–135 CE)',
      text:
        'Born a slave in Hierapolis, Phrygia, Epictetus studied under Musonius Rufus and gained his freedom. Exiled from Rome in 89 CE, he founded a school in Nicopolis. He taught that while external events are beyond our power, we can always control our judgments and responses. This “dichotomy of control” lies at the heart of his philosophy.'
    },
    'Marcus Aurelius': {
      title: 'Marcus Aurelius Antoninus (121–180 CE)',
      text:
        'Marcus Aurelius, adopted by Antoninus Pius, became Roman emperor in 161 CE. He spent much of his reign on military campaigns and composed his “Meditations” as private notes, reflecting on duty, impermanence and the practice of virtue. His reign ended with his death in 180 CE.'
    }
  };

  /**
   * Stoic concept definitions
   */
  const conceptDetails = {
    logos: {
      title: 'Logos',
      text:
        'Logos is the rational, ordering principle of the universe. For the Stoics it is both the divine reason that governs nature and the spark of reason within each human being.'
    },
    eudaimonia: {
      title: 'Eudaimonia',
      text:
        'Eudaimonia, often translated as “flourishing,” is the state of living well. In Stoicism it is achieved by living in accordance with virtue and nature, rather than pursuing pleasure or external goods.'
    },
    apatheia: {
      title: 'Apatheia',
      text:
        'Apatheia is freedom from destructive passions. It is not indifference but the calm state that arises when one’s judgments align with reason, allowing good feelings like joy and wish to flourish.'
    },
    sympatheia: {
      title: 'Sympatheia',
      text:
        'Sympatheia refers to the mutual interconnection of all things. Stoics saw the cosmos as a single living organism; recognising this fosters kinship with all beings and encourages cooperation.'
    },
    oikeiosis: {
      title: 'Oikeiosis',
      text:
        'Oikeiosis is the process of appropriation or natural affection. Beginning with self‑preservation, concern gradually extends to family, community and, ultimately, all humanity, grounding Stoic cosmopolitanism.'
    },
    control: {
      title: 'Dichotomy of Control',
      text:
        'Articulated by Epictetus, the dichotomy of control divides things into those within our power—our judgments, intentions and actions—and those beyond it—our bodies, reputation and fortune. Peace comes from focusing on what we control.'
    },
    prohairesis: {
      title: 'Prohairesis',
      text:
        'Prohairesis is the rational faculty of choice or moral will. It enables us to assent to impressions and act in accordance with virtue. For Stoics, true freedom lies in directing one’s prohairesis properly.'
    },
    katalepsis: {
      title: 'Katalepsis',
      text:
        'Katalepsis is a “graspable” or comprehensible impression—perceptual clarity so strong it cannot be false. The Stoics held that such impressions, when assented to by reason, provide the foundation of knowledge.'
    }
  };

  /**
   * Stoic scenarios
   * Common life situations and how a Stoic might respond
   */
  const scenarioDetails = {
    insult: {
      title: 'Insult & Offense',
      text:
        'When insulted, remember that the offence lies not in the words themselves but in your judgment of them. Respond with patience; if the remark contains truth, use it to improve yourself. Otherwise, let it pass without anger.'
    },
    loss: {
      title: 'Loss of Possessions',
      text:
        'If you lose something, recall that it was only on loan from the universe. Focus on your character and virtue, which are truly yours, and accept that externals come and go.'
    },
    traffic: {
      title: 'Waiting in Traffic',
      text:
        'Traffic jams are beyond your control. Use the time for reflection, gratitude or deep breathing rather than frustration. The obstacle becomes an opportunity to practise patience.'
    },
    illness: {
      title: 'Falling Ill',
      text:
        'Illness affects the body, not the mind. Accept physical ailments as part of nature’s course while cultivating equanimity and gratitude for what remains within your power.'
    },
    public: {
      title: 'Public Speaking',
      text:
        'Fear of public speaking often stems from worrying about others’ opinions. Focus instead on speaking truthfully and virtuously; the audience’s reaction is outside your control.'
    },
    failure: {
      title: 'Failure at Work',
      text:
        'Professional setbacks are inevitable. Learn from them and concentrate on acting well rather than on the outcome. Failure is valuable feedback for your growth.'
    },
    conflict: {
      title: 'Family Conflict',
      text:
        'During family disagreements, exercise empathy and justice. Remember that others act according to their own perceptions; respond calmly and keep your own actions aligned with virtue.'
    },
    success: {
      title: 'Unexpected Success',
      text:
        'Success can tempt the ego. Greet it with modesty and remember that external achievements are indifferent; only virtuous intentions and actions truly matter.'
    }
  };

  /**
   * Influences and legacy entries
   * Thinkers who inspired Stoicism or were influenced by it
   */
  const influenceDetails = {
    socrates: {
      title: 'Socrates (c. 470–399 BCE)',
      text:
        'Socrates emphasised self‑knowledge, virtue and rational inquiry. His fearless questioning of convention and acceptance of fate inspired later Stoics to value wisdom and live in accordance with reason.'
    },
    cynics: {
      title: 'The Cynics',
      text:
        'Cynic philosophers like Diogenes of Sinope (c. 412–323 BCE) practised radical simplicity and rejected social conventions. Zeno studied with the Cynics, and their emphasis on self‑sufficiency and indifference to external goods shaped Stoic ethics.'
    },
    cicero: {
      title: 'Cicero (106–43 BCE)',
      text:
        'Marcus Tullius Cicero was a Roman orator and statesman who popularised Stoic ideas in works such as “On Duties.” Drawing on Panaetius and Posidonius, he presented Stoic ethics in Latin and influenced later Roman thought.'
    },
    hadot: {
      title: 'Pierre Hadot (1922–2010)',
      text:
        'A 20th‑century French philosopher, Pierre Hadot argued that ancient philosophy was a way of life rather than mere theory. His interpretations of Stoic “spiritual exercises” helped revive practical Stoicism in the modern era.'
    },
    modern: {
      title: 'Modern Stoicism',
      text:
        'Today, authors and thinkers adapt Stoicism to contemporary life. Writers like Ryan Holiday and Massimo Pigliucci encourage practising Stoic principles—focusing on what we control, cultivating virtue and finding resilience in adversity.'
    }
  };

  // Biography modal elements
  const bioModal = document.getElementById('bio-modal');
  const bioTitle = document.getElementById('bio-title');
  const bioText = document.getElementById('bio-text');

  // Open biography or concept definition in modal
  function openBio(title, text) {
    bioTitle.textContent = title;
    bioText.textContent = text;
    bioModal.classList.remove('hidden');
  }

  // Event listener for philosopher names in timeline
  document.querySelectorAll('.timeline-item h3').forEach(el => {
    el.addEventListener('click', (event) => {
      const philosopher = el.textContent.trim();
      const details = philosopherDetails[philosopher];
      if (details) {
        openBio(details.title, details.text);
      }
      event.stopPropagation();
    });
  });

  // Event listener for concept items
  document.querySelectorAll('.concept-item').forEach(item => {
    item.addEventListener('click', () => {
      const key = item.getAttribute('data-concept');
      const details = conceptDetails[key];
      if (details) {
        openBio(details.title, details.text);
      }
    });
  });

  // Event listeners for scenario items
  document.querySelectorAll('.scenario-item').forEach(item => {
    item.addEventListener('click', () => {
      const key = item.getAttribute('data-scenario');
      const details = scenarioDetails[key];
      if (details) {
        openBio(details.title, details.text);
      }
    });
  });

  // Event listeners for influence items
  document.querySelectorAll('.influence-item').forEach(item => {
    item.addEventListener('click', () => {
      const key = item.getAttribute('data-influence');
      const details = influenceDetails[key];
      if (details) {
        openBio(details.title, details.text);
      }
    });
  });

  /**
   * Mini lesson definitions and modal logic
   * Each lesson summarises a key Stoic theme from the provided overview.
   */
  const lessonDetails = {
    lesson1: {
      title: 'Big Idea & Stoicism 101',
      text:
        'Stoicism is an ancient philosophy about living a good life. It goes beyond simply remaining calm—it explores how to develop virtue and live in harmony with reason. The Stoics taught that our happiness depends on our character rather than on external circumstances.'
    },
    lesson2: {
      title: 'Origins & Influences',
      text:
        'Stoicism grew out of earlier Greek thought. Socrates taught that character matters more than wealth or fame, while the Cynics like Diogenes rejected materialism and social conventions. Zeno of Citium, inspired by these ideas, founded the Stoic school at the Stoa Poikile after a shipwreck showed him that losing possessions does not mean losing oneself.'
    },
    lesson3: {
      title: 'The Stoic System',
      text:
        'Ancient Stoicism was more than self‑help—it was a complete system. Stoics studied three disciplines: logic (how to think clearly and assent only to true impressions), physics (the nature and order of the universe), and ethics (how to live well and cultivate virtue).'
    },
    lesson4: {
      title: 'Stoic Logic & Assent',
      text:
        'Knowledge begins with our senses. We perceive the world through sight, hearing, touch, smell and taste. The mind forms impressions, and we decide whether to assent—that is, agree that an impression is true. Stoics cautioned against rash assent because many problems arise from accepting false judgments.'
    },
    lesson5: {
      title: 'Emotions & Judgments',
      text:
        'Stoicism is not about suppressing feelings. The Stoics believed that unhealthy emotions like distress, fear and excessive desire stem from mistaken judgments. By examining and correcting our thoughts, we transform disruptive passions into rational states such as joy, caution and wish.'
    },
    lesson6: {
      title: 'Universe & Logos',
      text:
        'The Stoics saw the universe as an ordered whole governed by logos—divine reason or rational structure. They often identified God with Nature itself, a view called pantheism. For them, living according to nature meant aligning one’s will with this rational order.'
    },
    lesson7: {
      title: 'Human Nature & Virtue',
      text:
        'Humans are unique because we can reason and reflect. A good human life, according to Stoicism, is one in which reason guides our desires and actions. Virtue—wisdom, courage, justice and self‑control—is the only true good and the foundation of happiness.'
    },
    lesson8: {
      title: 'Indifferents',
      text:
        'The Stoics recognised that some externals are naturally preferred (health, food, shelter, friendship) and others dispreferred (sickness, hunger, poverty, pain). They called these indifferents because they do not determine whether we are good people. Preferred indifferents are worth choosing when they do not compromise virtue; dispreferred indifferents are worth avoiding when possible.'
    },
    lesson9: {
      title: 'Control & Responsibility',
      text:
        'We should distinguish between what we can control—our judgments, choices, words and actions—and what we cannot—other people’s opinions, the weather, the past. Stoicism teaches us to invest our energy in what is up to us and accept what is not.'
    },
    lesson10: {
      title: 'Suffering & Resilience',
      text:
        'Stoics acknowledged that pain, loss and failure are real. However, they held that suffering cannot corrupt our character unless we allow it. Even in illness or adversity, we can choose courage, patience and kindness—virtues that sustain us through hardship.'
    },
    lesson11: {
      title: 'Fate & Freedom',
      text:
        'Everything unfolds through cause and effect, which the Stoics called fate. Yet our choices still matter because they are part of this causal chain. Facing the same event, different people respond differently depending on their character. That is why training our minds is essential.'
    },
    lesson12: {
      title: 'Practice & Misconceptions',
      text:
        'Stoicism is a way of life, not merely a theory. Practising Stoicism means applying its principles in daily challenges—insults, nervousness, exclusion, mistakes—by focusing on what we control and acting virtuously. It is not about hiding emotions or seeking wealth, but about justice, courage, wisdom and self‑control.'
    }
  };

  // Grab lesson modal elements
  const lessonModal = document.getElementById('lesson-modal');
  const lessonTitle = document.getElementById('lesson-title');
  const lessonTextEl = document.getElementById('lesson-text');

  // Event listeners for mini lesson cards
  document.querySelectorAll('.lesson-item').forEach(item => {
    item.addEventListener('click', () => {
      const key = item.getAttribute('data-lesson');
      const details = lessonDetails[key];
      if (details) {
        lessonTitle.textContent = details.title;
        lessonTextEl.textContent = details.text;
        lessonModal.classList.remove('hidden');
      }
    });
  });

  // Explicit close handler for the lesson modal
  if (lessonModal) {
    const closeBtn = lessonModal.querySelector('.close-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        lessonModal.classList.add('hidden');
      });
    }
  }

  // Close bio modal when clicking × button (using existing close-modal class handler)
});
