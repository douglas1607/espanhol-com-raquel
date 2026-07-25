document.addEventListener("DOMContentLoaded", function () {
    // =======================================================
    // 1. CONFIGURAÇÃO GERAL E MENU
    // =======================================================
    const btnHamburguer = document.querySelector(".menu-hamburguer");
    const menu = document.querySelector(".menu");
    const linksMenu = document.querySelectorAll(".meu-link");
    const navBar = document.querySelector(".nav-bar");

    // Menu Mobile
    if (btnHamburguer && menu) {
        btnHamburguer.addEventListener("click", () => menu.classList.toggle("ativo"));
        linksMenu.forEach(link => link.addEventListener("click", () => menu.classList.remove("ativo")));
    }

    // Nav-bar ao rolar
    if (navBar) {
        window.addEventListener("scroll", () => {
            window.scrollY > 50 ? navBar.classList.add("nav-rolando") : navBar.classList.remove("nav-rolando");
        });
    }

    // =======================================================
    // 2. EFEITO SCROLL REVEAL (CARDS SOBEM E PARAM AO ROLAR)
    // =======================================================
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('revelado');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.card-item, .card-feedback').forEach(card => {
        observador.observe(card);
    });

    // =======================================================
    // 3. LÓGICA DO DIAGNÓSTICO INTERATIVO (IA)
    // =======================================================

    // Banco de Perguntas (10 Questões: 6 Marcar, 3 Digitar, 1 Áudio)
    const bancoPerguntas = [
        // MARCAR (A1/A2)
        { tipo: 'multipla', pontos: 1, pergunta: "1. ¿Cómo se dice 'Bom dia' en español?", opcoes: ["Buenas noches", "Hola", "Buenos días", "Adiós"], resposta: "Buenos días" },
        { tipo: 'multipla', pontos: 1, pergunta: "2. Completa la frase: 'Yo ___ brasileño.'", opcoes: ["es", "soy", "eres", "somos"], resposta: "soy" },

        // MARCAR (B1)
        { tipo: 'multipla', pontos: 2, pergunta: "3. ¿Cuál é a opção correta para: 'Se eu ___ tempo, iria com você.'?", opcoes: ["tengo", "tuve", "tuviera", "tendré"], resposta: "tuviera" },

        // DIGITAR (A1/A2)
        { tipo: 'digitar', pontos: 1, pergunta: "4. Escreva em espanhol: 'Eu tenho 25 anos.' (Dica: Yo tenho...)", respostaEsperada: ["tengo", "tengo veinticinco", "yo tengo 25"] },

        // MARCAR (B2)
        { tipo: 'multipla', pontos: 3, pergunta: "5. ¿Qué significa la expresión 'Estar en las nubes'?", opcoes: ["Estar feliz", "Estar distraído/soñando", "Estar enojado", "Estar viajando"], resposta: "Estar distraído/soñando" },

        // DIGITAR (B1/B2)
        { tipo: 'digitar', pontos: 2, pergunta: "6. Conjugue o verbo HABLAR no Pretérito Perfecto Simple (Yo):", respostaEsperada: ["hablé", "yo hablé"] },

        // MARCAR (A2/B1)
        { tipo: 'multipla', pontos: 1, pergunta: "7. ¿Cuál es el plural de 'El lápiz'?", opcoes: ["Los lápizs", "Los lápizes", "Los lápices", "Los lapis"], resposta: "Los lápices" },

        // DIGITAR (A1/A2)
        { tipo: 'digitar', pontos: 1, pergunta: "8. Traduza para espanhol: 'A caneta é azul.'", respostaEsperada: ["el bolígrafo es azul", "la pluma es azul"] },

        // MARCAR (B1/B2 - Falso Amigo)
        { tipo: 'multipla', pontos: 2, pergunta: "9. La palabra 'Prejuicio' significa:", opcoes: ["Prejuízo financeiro", "Opinião preconcebida (Preconceito)", "Julgamento final", "Dano físico"], resposta: "Opinião preconcebida (Preconceito)" },

        // ÁUDIO (Opcional - B1/B2)
        { tipo: 'audio', pontos: 3, pergunta: "10. (Opcional) Escute e repita a frase: 'Trabajaba mucho para mejorar su fluidez.'" }
    ];

    // Variáveis de estado do teste
    let etapaAtual = 1;
    let perguntaActiveIndex = 0;
    let pontuacaoTotal = 0;
    let dadosAluno = {};
    let respostaSelecionada = null;

    // Variáveis do Gravador de Áudio
    let mediaRecorder;
    let gravando = false;
    let tempoGravacao = 0;
    let intervaloTempo;

    // Elementos da área do teste
    const btnProximoPrincipal = document.querySelector('#btn-proximo-ia');
    const containerEtapas = document.querySelectorAll('.etapa-teste');

    // Inicializa o botão principal
    if (btnProximoPrincipal) {
        btnProximoPrincipal.addEventListener('click', gerenciarFluxo);
    }

    // Gerencia a troca de etapas do teste
    function gerenciarFluxo() {
        if (etapaAtual === 1) {
            dadosAluno.nome = document.getElementById('aluno-nome')?.value.trim();
            dadosAluno.whatsapp = document.getElementById('aluno-whatsapp')?.value.trim();
            dadosAluno.objetivo = document.getElementById('aluno-objetivo')?.value.trim();

            if (dadosAluno.nome && dadosAluno.whatsapp && dadosAluno.objetivo) {
                irParaEtapa(2);
                mostrarPergunta(perguntaActiveIndex);
            } else {
                alert("Por favor, preencha todos os dados iniciais.");
            }
        } else if (etapaAtual === 2) {
            validarEPontuarPerguntaAtual();

            perguntaActiveIndex++;

            if (perguntaActiveIndex < bancoPerguntas.length) {
                mostrarPergunta(perguntaActiveIndex);
            } else {
                finalizarDiagnostico();
            }
        }
    }

    function irParaEtapa(numeroEtapa) {
        etapaAtual = numeroEtapa;
        containerEtapas.forEach(etapa => etapa.classList.remove('active'));

        const etapaAlvo = document.getElementById(`etapa-${numeroEtapa}`);
        if (etapaAlvo) etapaAlvo.classList.add('active');

        if (etapaAtual === 2 && perguntaActiveIndex === bancoPerguntas.length - 1) {
            btnProximoPrincipal.innerHTML = "Finalizar Diagnóstico 🎯";
        } else if (etapaAtual === 2) {
            btnProximoPrincipal.innerHTML = "Próxima Pergunta ➔";
        } else if (etapaAtual === 3) {
            btnProximoPrincipal.style.display = 'none';
        }
    }

    // Renderiza a pergunta dinamicamente
    function mostrarPergunta(index) {
        const perguntaData = bancoPerguntas[index];
        const areaPerguntas = document.getElementById('area-perguntas-dinamicas');

        respostaSelecionada = null;

        let htmlPergunta = `
            <div class="pergunta-corpo">
                <span class="progresso">Pregunta ${index + 1} de ${bancoPerguntas.length}</span>
                <h3>${perguntaData.pergunta}</h3>
                <div class="resposta-container">
        `;

        if (perguntaData.tipo === 'multipla') {
            htmlPergunta += `<div class="opcoes-respostas">`;
            perguntaData.opcoes.forEach(opcao => {
                htmlPergunta += `<button type="button" class="btn-opcao" onclick="definirRespostaMultipla(this, '${opcao}')">${opcao}</button>`;
            });
            htmlPergunta += `</div>`;
        } else if (perguntaData.tipo === 'digitar') {
            htmlPergunta += `<input type="text" id="resposta-digitar-${index}" placeholder="Escriba su respuesta aquí..." class="input-diagnostico">`;
        } else if (perguntaData.tipo === 'audio') {
            htmlPergunta += `
                <div class="container-audio-recorder">
                    <div class="audio-controls">
                        <button type="button" id="btn-gravar" class="btn-microfone" onclick="toggleGravacao()">
                            <span class="icone-mic">🎙️</span>
                        </button>
                        <div class="status-gravacao">
                            <span id="label-status">Clique para gravar resposta</span>
                            <span id="timer-audio" class="timer">00:00 / 00:15</span>
                        </div>
                    </div>
                    <div class="visualizador-onda" id="onda-sonora">
                        <span></span><span></span><span></span><span></span><span></span><span></span>
                    </div>
                </div>
            `;
        }

        htmlPergunta += `</div></div>`;
        areaPerguntas.innerHTML = htmlPergunta;
    }

    // Seleção de opções em perguntas de múltipla escolha
    window.definirRespostaMultipla = function (botao, opcao) {
        const botoes = botao.parentNode.querySelectorAll('.btn-opcao');
        botoes.forEach(b => b.classList.remove('selecionado'));

        botao.classList.add('selecionado');
        respostaSelecionada = opcao;
    };

    // Validação de pontuação
    function validarEPontuarPerguntaAtual() {
        const perguntaData = bancoPerguntas[perguntaActiveIndex];

        if (perguntaData.tipo === 'multipla') {
            if (respostaSelecionada === perguntaData.resposta) {
                pontuacaoTotal += perguntaData.pontos;
            }
        } else if (perguntaData.tipo === 'digitar') {
            const inputDigitar = document.getElementById(`resposta-digitar-${perguntaActiveIndex}`);
            if (inputDigitar) {
                const respostaUser = inputDigitar.value.trim().toLowerCase();
                if (perguntaData.respostaEsperada.includes(respostaUser)) {
                    pontuacaoTotal += perguntaData.pontos;
                }
            }
        }
    }

    // Gravação de Áudio
    window.toggleGravacao = async function () {
        const btn = document.getElementById('btn-gravar');
        const label = document.getElementById('label-status');
        const timer = document.getElementById('timer-audio');
        const onda = document.getElementById('onda-sonora');

        if (!gravando) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();

                gravando = true;
                btn.classList.add('gravando');
                onda.classList.add('animando');
                label.innerText = "Gravando áudio...";

                tempoGravacao = 0;
                intervaloTempo = setInterval(() => {
                    tempoGravacao++;
                    let seg = tempoGravacao < 10 ? `0${tempoGravacao}` : tempoGravacao;
                    timer.innerText = `00:${seg} / 00:15`;

                    if (tempoGravacao >= 15) {
                        window.toggleGravacao();
                    }
                }, 1000);

            } catch (err) {
                alert("Não foi possível acessar o microfone. Verifique as permissões do navegador.");
            }
        } else {
            if (mediaRecorder && mediaRecorder.state !== "inactive") {
                mediaRecorder.stop();
            }
            clearInterval(intervaloTempo);
            gravando = false;

            btn.classList.remove('gravando');
            btn.classList.add('concluido');
            btn.innerHTML = '✔';
            onda.classList.remove('animando');
            label.innerText = "Áudio gravado com sucesso!";
        }
    };

    // Cálculo final e exibição dos resultados
    function finalizarDiagnostico() {
        irParaEtapa(3);

        let nivelResult = "";
        let planoResult = "";
        let descResult = "";

        if (pontuacaoTotal <= 4) {
            nivelResult = "Iniciante (A1)";
            planoResult = "Plano Descoberta";
            descResult = "Ideal para quem nunca teve contato ou sabe apenas palavras isoladas. Vamos construir sua base juntos.";
        } else if (pontuacaoTotal <= 8) {
            nivelResult = "Básico (A2)";
            planoResult = "Plano Conexão";
            descResult = "Você entende frases simples, mas trava na fala. O foco será destravar sua conversação.";
        } else if (pontuacaoTotal <= 12) {
            nivelResult = "Intermediário (B1)";
            planoResult = "Plano Fluidez";
            descResult = "Você já se comunica, mas falta vocabulário corporativo e confiança para reuniões.";
        } else {
            nivelResult = "Avançado (B2/C1)";
            planoResult = "Plano Master/Executivo";
            descResult = "Foco em refinamento, espanhol de negócios e eliminação de erros sutis para liderança.";
        }

        const elemNivel = document.getElementById('resultado-texto-nivel');
        const elemPlano = document.getElementById('nome-plano');
        const elemDesc = document.getElementById('desc-plano');

        if (elemNivel) elemNivel.innerHTML = `Pontuação: ${pontuacaoTotal} pontos.<br>Seu nível estimado é: <strong>${nivelResult}</strong>`;
        if (elemPlano) elemPlano.innerText = planoResult;
        if (elemDesc) elemDesc.innerText = descResult;

        dadosAluno.nivelEstimado = nivelResult;
    }

    // Envio para o WhatsApp
    window.enviarDadosWhatsApp = function () {
        const mensagem = `Hola Raquel! Acabo de fazer o diagnóstico dinâmico:\n\n` +
            `*Nome:* ${dadosAluno.nome || 'Não informado'}\n` +
            `*Objetivo:* ${dadosAluno.objetivo || 'Não informado'}\n` +
            `*Nível Estimado:* ${dadosAluno.nivelEstimado || 'A determinar'}\n` +
            `*Pontuação:* ${pontuacaoTotal} pontos.\n\n` +
            `Gostaria de agendar minha aula experimental!`;

        const numeroWhats = "5585992826206";
        const urlFinal = `https://api.whatsapp.com/send?phone=${numeroWhats}&text=${encodeURIComponent(mensagem)}`;

        window.open(urlFinal, '_blank');
    };
});document.addEventListener("DOMContentLoaded", function () {
    // =======================================================
    // 1. CONFIGURAÇÃO GERAL E MENU
    // =======================================================
    const btnHamburguer = document.querySelector(".menu-hamburguer");
    const menu = document.querySelector(".menu");
    const linksMenu = document.querySelectorAll(".meu-link");
    const navBar = document.querySelector(".nav-bar");

    // Menu Mobile
    if (btnHamburguer && menu) {
        btnHamburguer.addEventListener("click", () => menu.classList.toggle("ativo"));
        linksMenu.forEach(link => link.addEventListener("click", () => menu.classList.remove("ativo")));
    }

    // Nav-bar ao rolar
    if (navBar) {
        window.addEventListener("scroll", () => {
            window.scrollY > 50 ? navBar.classList.add("nav-rolando") : navBar.classList.remove("nav-rolando");
        });
    }

    // =======================================================
    // 2. EFEITO SCROLL REVEAL (CARDS SOBEM E PARAM AO ROLAR)
    // =======================================================
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('revelado');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.card-item, .card-feedback').forEach(card => {
        observador.observe(card);
    });

    // =======================================================
    // 3. LÓGICA DO DIAGNÓSTICO INTERATIVO (IA)
    // =======================================================

    // Banco de Perguntas (10 Questões: 6 Marcar, 3 Digitar, 1 Áudio)
    const bancoPerguntas = [
        // MARCAR (A1/A2)
        { tipo: 'multipla', pontos: 1, pergunta: "1. ¿Cómo se dice 'Bom dia' en español?", opcoes: ["Buenas noches", "Hola", "Buenos días", "Adiós"], resposta: "Buenos días" },
        { tipo: 'multipla', pontos: 1, pergunta: "2. Completa la frase: 'Yo ___ brasileño.'", opcoes: ["es", "soy", "eres", "somos"], resposta: "soy" },

        // MARCAR (B1)
        { tipo: 'multipla', pontos: 2, pergunta: "3. ¿Cuál é a opção correta para: 'Se eu ___ tempo, iria com você.'?", opcoes: ["tengo", "tuve", "tuviera", "tendré"], resposta: "tuviera" },

        // DIGITAR (A1/A2)
        { tipo: 'digitar', pontos: 1, pergunta: "4. Escreva em espanhol: 'Eu tenho 25 anos.' (Dica: Yo tenho...)", respostaEsperada: ["tengo", "tengo veinticinco", "yo tengo 25"] },

        // MARCAR (B2)
        { tipo: 'multipla', pontos: 3, pergunta: "5. ¿Qué significa la expresión 'Estar en las nubes'?", opcoes: ["Estar feliz", "Estar distraído/soñando", "Estar enojado", "Estar viajando"], resposta: "Estar distraído/soñando" },

        // DIGITAR (B1/B2)
        { tipo: 'digitar', pontos: 2, pergunta: "6. Conjugue o verbo HABLAR no Pretérito Perfecto Simple (Yo):", respostaEsperada: ["hablé", "yo hablé"] },

        // MARCAR (A2/B1)
        { tipo: 'multipla', pontos: 1, pergunta: "7. ¿Cuál es el plural de 'El lápiz'?", opcoes: ["Los lápizs", "Los lápizes", "Los lápices", "Los lapis"], resposta: "Los lápices" },

        // DIGITAR (A1/A2)
        { tipo: 'digitar', pontos: 1, pergunta: "8. Traduza para espanhol: 'A caneta é azul.'", respostaEsperada: ["el bolígrafo es azul", "la pluma es azul"] },

        // MARCAR (B1/B2 - Falso Amigo)
        { tipo: 'multipla', pontos: 2, pergunta: "9. La palabra 'Prejuicio' significa:", opcoes: ["Prejuízo financeiro", "Opinião preconcebida (Preconceito)", "Julgamento final", "Dano físico"], resposta: "Opinião preconcebida (Preconceito)" },

        // ÁUDIO (Opcional - B1/B2)
        { tipo: 'audio', pontos: 3, pergunta: "10. (Opcional) Escute e repita a frase: 'Trabajaba mucho para mejorar su fluidez.'" }
    ];

    // Variáveis de estado do teste
    let etapaAtual = 1;
    let perguntaActiveIndex = 0;
    let pontuacaoTotal = 0;
    let dadosAluno = {};
    let respostaSelecionada = null;

    // Variáveis do Gravador de Áudio
    let mediaRecorder;
    let gravando = false;
    let tempoGravacao = 0;
    let intervaloTempo;

    // Elementos da área do teste
    const btnProximoPrincipal = document.querySelector('#btn-proximo-ia');
    const containerEtapas = document.querySelectorAll('.etapa-teste');

    // Inicializa o botão principal
    if (btnProximoPrincipal) {
        btnProximoPrincipal.addEventListener('click', gerenciarFluxo);
    }

    // Gerencia a troca de etapas do teste
    function gerenciarFluxo() {
        if (etapaAtual === 1) {
            dadosAluno.nome = document.getElementById('aluno-nome')?.value.trim();
            dadosAluno.whatsapp = document.getElementById('aluno-whatsapp')?.value.trim();
            dadosAluno.objetivo = document.getElementById('aluno-objetivo')?.value.trim();

            if (dadosAluno.nome && dadosAluno.whatsapp && dadosAluno.objetivo) {
                irParaEtapa(2);
                mostrarPergunta(perguntaActiveIndex);
            } else {
                alert("Por favor, preencha todos os dados iniciais.");
            }
        } else if (etapaAtual === 2) {
            validarEPontuarPerguntaAtual();

            perguntaActiveIndex++;

            if (perguntaActiveIndex < bancoPerguntas.length) {
                mostrarPergunta(perguntaActiveIndex);
            } else {
                finalizarDiagnostico();
            }
        }
    }

    function irParaEtapa(numeroEtapa) {
        etapaAtual = numeroEtapa;
        containerEtapas.forEach(etapa => etapa.classList.remove('active'));

        const etapaAlvo = document.getElementById(`etapa-${numeroEtapa}`);
        if (etapaAlvo) etapaAlvo.classList.add('active');

        if (etapaAtual === 2 && perguntaActiveIndex === bancoPerguntas.length - 1) {
            btnProximoPrincipal.innerHTML = "Finalizar Diagnóstico 🎯";
        } else if (etapaAtual === 2) {
            btnProximoPrincipal.innerHTML = "Próxima Pergunta ➔";
        } else if (etapaAtual === 3) {
            btnProximoPrincipal.style.display = 'none';
        }
    }

    // Renderiza a pergunta dinamicamente
    function mostrarPergunta(index) {
        const perguntaData = bancoPerguntas[index];
        const areaPerguntas = document.getElementById('area-perguntas-dinamicas');

        respostaSelecionada = null;

        let htmlPergunta = `
            <div class="pergunta-corpo">
                <span class="progresso">Pregunta ${index + 1} de ${bancoPerguntas.length}</span>
                <h3>${perguntaData.pergunta}</h3>
                <div class="resposta-container">
        `;

        if (perguntaData.tipo === 'multipla') {
            htmlPergunta += `<div class="opcoes-respostas">`;
            perguntaData.opcoes.forEach(opcao => {
                htmlPergunta += `<button type="button" class="btn-opcao" onclick="definirRespostaMultipla(this, '${opcao}')">${opcao}</button>`;
            });
            htmlPergunta += `</div>`;
        } else if (perguntaData.tipo === 'digitar') {
            htmlPergunta += `<input type="text" id="resposta-digitar-${index}" placeholder="Escriba su respuesta aquí..." class="input-diagnostico">`;
        } else if (perguntaData.tipo === 'audio') {
            htmlPergunta += `
                <div class="container-audio-recorder">
                    <div class="audio-controls">
                        <button type="button" id="btn-gravar" class="btn-microfone" onclick="toggleGravacao()">
                            <span class="icone-mic">🎙️</span>
                        </button>
                        <div class="status-gravacao">
                            <span id="label-status">Clique para gravar resposta</span>
                            <span id="timer-audio" class="timer">00:00 / 00:15</span>
                        </div>
                    </div>
                    <div class="visualizador-onda" id="onda-sonora">
                        <span></span><span></span><span></span><span></span><span></span><span></span>
                    </div>
                </div>
            `;
        }

        htmlPergunta += `</div></div>`;
        areaPerguntas.innerHTML = htmlPergunta;
    }

    // Seleção de opções em perguntas de múltipla escolha
    window.definirRespostaMultipla = function (botao, opcao) {
        const botoes = botao.parentNode.querySelectorAll('.btn-opcao');
        botoes.forEach(b => b.classList.remove('selecionado'));

        botao.classList.add('selecionado');
        respostaSelecionada = opcao;
    };

    // Validação de pontuação
    function validarEPontuarPerguntaAtual() {
        const perguntaData = bancoPerguntas[perguntaActiveIndex];

        if (perguntaData.tipo === 'multipla') {
            if (respostaSelecionada === perguntaData.resposta) {
                pontuacaoTotal += perguntaData.pontos;
            }
        } else if (perguntaData.tipo === 'digitar') {
            const inputDigitar = document.getElementById(`resposta-digitar-${perguntaActiveIndex}`);
            if (inputDigitar) {
                const respostaUser = inputDigitar.value.trim().toLowerCase();
                if (perguntaData.respostaEsperada.includes(respostaUser)) {
                    pontuacaoTotal += perguntaData.pontos;
                }
            }
        }
    }

    // Gravação de Áudio
    window.toggleGravacao = async function () {
        const btn = document.getElementById('btn-gravar');
        const label = document.getElementById('label-status');
        const timer = document.getElementById('timer-audio');
        const onda = document.getElementById('onda-sonora');

        if (!gravando) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();

                gravando = true;
                btn.classList.add('gravando');
                onda.classList.add('animando');
                label.innerText = "Gravando áudio...";

                tempoGravacao = 0;
                intervaloTempo = setInterval(() => {
                    tempoGravacao++;
                    let seg = tempoGravacao < 10 ? `0${tempoGravacao}` : tempoGravacao;
                    timer.innerText = `00:${seg} / 00:15`;

                    if (tempoGravacao >= 15) {
                        window.toggleGravacao();
                    }
                }, 1000);

            } catch (err) {
                alert("Não foi possível acessar o microfone. Verifique as permissões do navegador.");
            }
        } else {
            if (mediaRecorder && mediaRecorder.state !== "inactive") {
                mediaRecorder.stop();
            }
            clearInterval(intervaloTempo);
            gravando = false;

            btn.classList.remove('gravando');
            btn.classList.add('concluido');
            btn.innerHTML = '✔';
            onda.classList.remove('animando');
            label.innerText = "Áudio gravado com sucesso!";
        }
    };

    // Cálculo final e exibição dos resultados
    function finalizarDiagnostico() {
        irParaEtapa(3);

        let nivelResult = "";
        let planoResult = "";
        let descResult = "";

        if (pontuacaoTotal <= 4) {
            nivelResult = "Iniciante (A1)";
            planoResult = "Plano Descoberta";
            descResult = "Ideal para quem nunca teve contato ou sabe apenas palavras isoladas. Vamos construir sua base juntos.";
        } else if (pontuacaoTotal <= 8) {
            nivelResult = "Básico (A2)";
            planoResult = "Plano Conexão";
            descResult = "Você entende frases simples, mas trava na fala. O foco será destravar sua conversação.";
        } else if (pontuacaoTotal <= 12) {
            nivelResult = "Intermediário (B1)";
            planoResult = "Plano Fluidez";
            descResult = "Você já se comunica, mas falta vocabulário corporativo e confiança para reuniões.";
        } else {
            nivelResult = "Avançado (B2/C1)";
            planoResult = "Plano Master/Executivo";
            descResult = "Foco em refinamento, espanhol de negócios e eliminação de erros sutis para liderança.";
        }

        const elemNivel = document.getElementById('resultado-texto-nivel');
        const elemPlano = document.getElementById('nome-plano');
        const elemDesc = document.getElementById('desc-plano');

        if (elemNivel) elemNivel.innerHTML = `Pontuação: ${pontuacaoTotal} pontos.<br>Seu nível estimado é: <strong>${nivelResult}</strong>`;
        if (elemPlano) elemPlano.innerText = planoResult;
        if (elemDesc) elemDesc.innerText = descResult;

        dadosAluno.nivelEstimado = nivelResult;
    }

    // Envio para o WhatsApp
    window.enviarDadosWhatsApp = function () {
        const mensagem = `Hola Raquel! Acabo de fazer o diagnóstico dinâmico:\n\n` +
            `*Nome:* ${dadosAluno.nome || 'Não informado'}\n` +
            `*Objetivo:* ${dadosAluno.objetivo || 'Não informado'}\n` +
            `*Nível Estimado:* ${dadosAluno.nivelEstimado || 'A determinar'}\n` +
            `*Pontuação:* ${pontuacaoTotal} pontos.\n\n` +
            `Gostaria de agendar minha aula experimental!`;

        const numeroWhats = "5585992826206";
        const urlFinal = `https://api.whatsapp.com/send?phone=${numeroWhats}&text=${encodeURIComponent(mensagem)}`;

        window.open(urlFinal, '_blank');
    };
});