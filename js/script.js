document.addEventListener("DOMContentLoaded", function() {
  /* ----------------------------------------
     1) DADOS DOS MÓDULOS
  ---------------------------------------- */
  const trainingTypes = [
    {
      title: "Módulo Financeiro",
      image: "https://img.freepik.com/free-photo/businesswoman-using-tablet-analysis-graph-company-finance-strategy-statistics-success-concept-planning-future-office-room_74952-1410.jpg",
      trainings: [
        { name: "Contas a Pagar", link: "contas-a-pagar.html" },
        { name: "Contas a Receber", link: "contasareceber.html" },
        { name: "Contas Bancárias", link: "#" },
        { name: "Configurar Boleto & Banco", link: "#" },
        { name: "Controle de Transferências", link: "controle-de-transferencias.html" },
      ],
    },
    {
      title: "Cadastros Gerais",
      image: "https://img.freepik.com/free-photo/form-business-exam-comparison-option_1232-3835.jpg",
      trainings: [
        { name: "Cadastrar Fornecedores", link: "fornecedores.html" },
        { name: "Cadastrar Condomínios", link: "#" },
      ],
    },
    {
      title: "Módulo de Convivência",
      image: "https://img.freepik.com/free-photo/paper-dolls-against-sky_23-2148144531.jpg",
      trainings: [
        { name: "Reserva de Áreas", link: "#" },
        { name: "Quadro de Avisos", link: "quadro-de-avisos.html" },
      ],
    },
    {
      title: "Comunicação",
      image: "https://img.freepik.com/free-photo/cheerful-woman-holding-sign_53876-15197.jpg",
      trainings: [
        { name: "Envios de e-mail", link: ".html" },
        { name: "Notificações Whatsapp", link: ".html" },
      ],
    },
  ];

  const carouselContainer = document.getElementById("courses-carousel");
  const searchInput = document.getElementById("search-courses");
  const noResultsMessage = document.getElementById("no-results-message") || { style: { display: "none" } };
  let currentSlide = 0;

  // Recupera treinamentos concluídos do localStorage
  const completedTrainings = JSON.parse(localStorage.getItem("completedTrainings")) || [];

  /* ----------------------------------------
     2) chunkArray: divide array em grupos de 3
  ---------------------------------------- */
  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  /* ----------------------------------------
     3) Atualiza barra de progresso do módulo
  ---------------------------------------- */
  function atualizarProgresso(moduleTitle) {
    const moduleKey = moduleTitle.replace(/\s+/g, "-").toLowerCase();
    const moduleData = trainingTypes.find(t => t.title === moduleTitle);
    if (!moduleData) return;

    const totalTrainings = moduleData.trainings.length;
    const completedCount = completedTrainings.filter(tName =>
      moduleData.trainings.some(tr => tr.name === tName)
    ).length;
    const porcentagem = (completedCount / totalTrainings) * 100 || 0;
    const progressBar = document.getElementById(`progress-${moduleKey}`);
    if (progressBar) {
      progressBar.style.width = `${porcentagem}%`;
      progressBar.setAttribute("aria-valuenow", porcentagem);
      progressBar.textContent = `${Math.round(porcentagem)}%`;
    }
  }

  /* ----------------------------------------
     4) Renderiza o carousel (3 módulos/slide)
  ---------------------------------------- */
  function renderCarousel(modules, searchTerm = "") {
    carouselContainer.innerHTML = "";

    // Filtro: busca no título do módulo e nos nomes dos treinamentos
    let filtered = modules.filter(m =>
      m.title.toLowerCase().includes(searchTerm) ||
      m.trainings.some(t => t.name.toLowerCase().includes(searchTerm))
    );
    if (searchTerm === "") {
      filtered = modules;
    }

    // Ordena módulos: os que têm menor percentual de concluídos (mais "incompletos") aparecem primeiro
    filtered.sort((a, b) => {
      const aCompleted = a.trainings.filter(t => completedTrainings.includes(t.name)).length;
      const bCompleted = b.trainings.filter(t => completedTrainings.includes(t.name)).length;
      const aRatio = aCompleted / a.trainings.length;
      const bRatio = bCompleted / b.trainings.length;
      return aRatio - bRatio;
    });

    noResultsMessage.style.display = filtered.length === 0 ? "block" : "none";

    // Divide em grupos de 3
    const slides = chunkArray(filtered, 3);

    slides.forEach((group, index) => {
      const slideDiv = document.createElement("div");
      slideDiv.className = "carousel-slide row row-cols-1 row-cols-md-3 g-3";
      if (index === 0) slideDiv.classList.add("active");

      group.forEach(module => {
        // Ordena os treinamentos para que os não concluídos venham primeiro
        const sortedTrainings = module.trainings.slice().sort((t1, t2) => {
          const t1Completed = completedTrainings.includes(t1.name);
          const t2Completed = completedTrainings.includes(t2.name);
          return (t1Completed === t2Completed) ? 0 : t1Completed ? 1 : -1;
        });

        // Se há busca e algum treinamento do módulo bate com o termo, expande automaticamente
        const isExpanded = (searchTerm !== "" && module.trainings.some(t => t.name.toLowerCase().includes(searchTerm)));

        const col = document.createElement("div");
        col.className = "col";

        let cardHTML = `
          <div class="course-card flex-grow-1">
            <img src="${module.image}" alt="${module.title}" class="card-img-top training-image">
            <div class="card-body text-center">
              <h5 class="card-title">${module.title}</h5>
              <div class="progress mb-2" style="height: 20px;">
                <div id="progress-${module.title.replace(/\s+/g, "-").toLowerCase()}"
                     class="progress-bar bg-success" role="progressbar"
                     style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                  0%
                </div>
              </div>
              <button class="btn btn-primary btn-sm toggle-options">
                ${isExpanded ? "Fechar Treinamentos" : "Ver Treinamentos"}
              </button>
              <div class="training-options mt-3 scrollable-list" style="display: ${isExpanded ? "block" : "none"};">
        `;

        sortedTrainings.forEach(t => {
          const isCompleted = completedTrainings.includes(t.name);
          cardHTML += `
            <button class="btn ${isCompleted ? "btn-success" : "btn-outline-primary"} btn-sm btn-block mb-2 training-button"
                    data-training="${t.name}" data-module="${module.title}" data-link="${t.link}">
              ${t.name} ${isCompleted ? "✔" : ""}
            </button>
          `;
        });

        cardHTML += `
              </div>
            </div>
          </div>
        `;

        col.innerHTML = cardHTML;
        slideDiv.appendChild(col);
      });

      carouselContainer.appendChild(slideDiv);
    });

    // Atualiza as barras de progresso
    trainingTypes.forEach(m => atualizarProgresso(m.title));
  }

  /* ----------------------------------------
     5) Exibe apenas o slide atual
  ---------------------------------------- */
  function showSlide(index) {
    const slides = document.querySelectorAll(".carousel-slide");
    if (slides.length === 0) return;
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
      slide.style.display = i === index ? "flex" : "none";
    });
    currentSlide = index;
  }

  /* ----------------------------------------
     6) Inicializa o carousel
  ---------------------------------------- */
  renderCarousel(trainingTypes);
  showSlide(0);

  // Navegação do carousel
  document.getElementById("prev-btn").addEventListener("click", () => {
    showSlide(currentSlide - 1);
  });
  document.getElementById("next-btn").addEventListener("click", () => {
    showSlide(currentSlide + 1);
  });

  /* ----------------------------------------
     7) Toggle "Ver Treinamentos"
  ---------------------------------------- */
  document.addEventListener("click", function(event) {
    if (event.target.classList.contains("toggle-options")) {
      const button = event.target;
      const trainingOptions = button.nextElementSibling;
      if (trainingOptions.style.display === "block") {
        trainingOptions.style.display = "none";
        button.textContent = "Ver Treinamentos";
      } else {
        trainingOptions.style.display = "block";
        button.textContent = "Fechar Treinamentos";
      }
    }
  });

  /* ----------------------------------------
     8) Clique em um treinamento => marca concluído e re-renderiza
  ---------------------------------------- */
  document.addEventListener("click", function(event) {
    if (event.target.classList.contains("training-button")) {
      const btn = event.target;
      const trainingName = btn.getAttribute("data-training");
      const moduleTitle = btn.getAttribute("data-module");
      const link = btn.getAttribute("data-link");

      if (!completedTrainings.includes(trainingName)) {
        completedTrainings.push(trainingName);
        localStorage.setItem("completedTrainings", JSON.stringify(completedTrainings));
      }

      const term = searchInput.value.toLowerCase();
      renderCarousel(trainingTypes, term);
      showSlide(currentSlide);
      atualizarProgresso(moduleTitle);

      setTimeout(() => {
        if (link !== "#") {
          window.location.href = link;
        }
      }, 200);
    }
  });

  /* ----------------------------------------
     9) Filtro de busca (módulos + treinamentos + FAQs) + ChatGPT (OpenAI)
  ---------------------------------------- */
  // Função para fechar todos os treinamentos e FAQs
  function closeAllTrainings() {
    document.querySelectorAll(".training-options").forEach(opt => {
      opt.style.display = "none";
    });
    document.querySelectorAll(".toggle-options").forEach(btn => {
      btn.textContent = "Ver Treinamentos";
    });
  }
  function closeAllFAQs() {
    faqItems.forEach(i => {
      i.classList.remove("open");
      i.querySelector(".faq-answer").style.display = "none";
    });
  }

  // Substitua pela SUA chave da OpenAI
  const OPENAI_API_KEY = ""; // sua chave real

  async function testOpenAI() {
    const response = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      }
    });
    const data = await response.json();
    console.log(data);

  }
  
  testOpenAI();

  /**
   * Função que chama a API de Chat da OpenAI (gpt-3.5-turbo)
   * question -> Pergunta do usuário
   * context -> Texto das FAQs
   */
  async function queryOpenAI(question, context) {
    // Monta as mensagens para a ChatCompletion
    const messages = [
      {
        role: "system",
        content: `Você é um assistente que ajuda a responder perguntas sobre um sistema de condomínio.
        Abaixo está o contexto (FAQ). Responda em português de forma clara e útil.`
      },
      {
        role: "user",
        content: `Contexto:\n${context}\n\nPergunta do usuário:\n${question}`
      }
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (data.error) {
      console.error("OpenAI API Error:", data.error);
      return "Erro na API da OpenAI.";
    }
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content.trim();
    }
    return "Nenhuma sugestão encontrada.";
  }

  // Cria/obtém um elemento para exibir a sugestão da IA
  let suggestionDiv = document.getElementById("ia-suggestion");
  if (!suggestionDiv) {
    suggestionDiv = document.createElement("div");
    suggestionDiv.id = "ia-suggestion";
    suggestionDiv.className = "alert alert-info mt-3";
    searchInput.parentNode.insertBefore(suggestionDiv, searchInput.nextSibling);
  }

  // Seleciona as FAQs e constrói o "contexto"
  const faqItems = Array.from(document.querySelectorAll(".faq-item"));
  function buildFAQContext() {
    return faqItems.map(item => {
      const questionEl = item.querySelector(".faq-question span");
      const question = questionEl ? questionEl.textContent.trim() : "";
      const answer = item.querySelector(".faq-answer").textContent.trim();
      return `Pergunta: ${question}\nResposta: ${answer}`;
    }).join("\n\n");
  }

  // Filtro de FAQs
  function filterFAQs(searchTerm) {
    const filtered = faqItems.filter(item => {
      const q = item.querySelector(".faq-question span").textContent.toLowerCase();
      const a = item.querySelector(".faq-answer").textContent.toLowerCase();
      const match = q.includes(searchTerm) || a.includes(searchTerm);
      item.classList.toggle("open", match);
      item.querySelector(".faq-answer").style.display = match ? "block" : "none";
      return match;
    });
    renderFAQs(1, filtered);
    return filtered;
  }

  let currentPageFAQ = 1;
  const itemsPerPage = 4;

  function renderFAQs(page = 1, filteredFAQs = faqItems) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    faqItems.forEach(f => f.style.display = "none");
    filteredFAQs.forEach((f, i) => {
      if (i >= start && i < end) {
        f.style.display = "block";
      }
    });
    renderPagination(filteredFAQs, page);
    currentPageFAQ = page;
  }

  function renderPagination(filteredFAQs, currentPage) {
    const paginationContainer = document.getElementById("pagination-numbers");
    if (!paginationContainer) return;
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(filteredFAQs.length / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = "btn btn-secondary mx-1 pagination-btn";
      if (i === currentPage) btn.classList.add("active");
      btn.addEventListener("click", () => {
        renderFAQs(i, filteredFAQs);
      });
      paginationContainer.appendChild(btn);
    }
    const prevFaqBtn = document.getElementById("prev-btn-faq");
    const nextFaqBtn = document.getElementById("next-btn-faq");
    if (prevFaqBtn) prevFaqBtn.disabled = currentPage === 1;
    if (nextFaqBtn) nextFaqBtn.disabled = currentPage === totalPages;
  }

  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    question.addEventListener("click", () => {
      item.classList.toggle("open");
      answer.style.display = item.classList.contains("open") ? "block" : "none";
    });
  });

  // Renderiza as FAQs inicialmente
  renderFAQs();

  const prevBtnFaq = document.getElementById("prev-btn-faq");
  const nextBtnFaq = document.getElementById("next-btn-faq");
  if (prevBtnFaq) {
    prevBtnFaq.addEventListener("click", () => {
      if (currentPageFAQ > 1) {
        renderFAQs(currentPageFAQ - 1);
      }
    });
  }
  if (nextBtnFaq) {
    nextBtnFaq.addEventListener("click", () => {
      const filtered = faqItems;
      if (currentPageFAQ < Math.ceil(filtered.length / itemsPerPage)) {
        renderFAQs(currentPageFAQ + 1, filtered);
      }
    });
  }

  // Listener do campo de busca
  if (searchInput) {
    searchInput.addEventListener("input", async function() {
      const term = this.value.toLowerCase();
      renderCarousel(trainingTypes, term);
      showSlide(0);
      filterFAQs(term);

      if (term === "") {
        closeAllTrainings();
        closeAllFAQs();
        suggestionDiv.textContent = "";
      } else {
        // Monta o contexto das FAQs
        const contextText = buildFAQContext();
        try {
          // Chama a API do ChatGPT (OpenAI)
          const answerText = await queryOpenAI(term, contextText);
          suggestionDiv.textContent = "Sugestão: " + (answerText || "Nenhuma sugestão encontrada.");
        } catch (e) {
          console.error(e);
          suggestionDiv.textContent = "Erro ao obter sugestão da IA (OpenAI).";
        }
      }
    });
  }

  // Exibe o slide atual (reaproveita a função showSlide)
  function showSlide(index) {
    const slides = document.querySelectorAll(".carousel-slide");
    if (slides.length === 0) return;
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
      slide.style.display = i === index ? "flex" : "none";
    });
    currentSlide = index;
  }
});
