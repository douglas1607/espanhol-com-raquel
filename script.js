document.addEventListener("DOMContentLoaded", function () {
    // =======================================================
    // 1. CONFIGURAÇÃO GERAL E MENU MOBILE
    // =======================================================
    const btnHamburguer = document.querySelector(".menu-hamburguer");
    const menu = document.querySelector(".menu");
    const linksMenu = document.querySelectorAll(".meu-link, .menu a");
    const navBar = document.querySelector(".nav-bar");

    // Função para alternar o menu mobile com suporte a toque
    function alternarMenu(event) {
        if (event.type === 'touchstart') event.preventDefault();
        
        if (menu) {
            menu.classList.toggle("ativo");
            if (btnHamburguer) btnHamburguer.classList.toggle("ativo");
        }
    }

    if (btnHamburguer && menu) {
        btnHamburguer.addEventListener("click", alternarMenu);
        btnHamburguer.addEventListener("touchstart", alternarMenu);

        // Fecha o menu ao clicar/tocar em qualquer link de navegação
        linksMenu.forEach(link => {
            link.addEventListener("click", () => {
                menu.classList.remove("ativo");
                if (btnHamburguer) btnHamburguer.classList.remove("ativo");
            });
        });
    }

    // Efeito na Nav-bar ao rolar a página
    if (navBar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                navBar.classList.add("nav-rolando");
            } else {
                navBar.classList.remove("nav-rolando");
            }
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

    // Banco de Perguntas (20 Questões: 18 Múltipla Escolha, 1 Tradução/Digitar, 1 Áudio)
    const bancoPerguntas = [
        // 1–5 | Básico (1 ponto cada)
        { 
            tipo: 'multipla', 
            pontos: 1, 
            pergunta: "1. Complete: Yo ___ brasileña.", 
            opcoes: ["a) soy", "b) estoy", "c) tengo", "d) es"], 
            resposta: "a) soy" 
        },
        { 
            tipo: 'multipla', 
            pontos: 1, 
            pergunta: "2. ¿Cuál frase está correcta?", 
            opcoes: ["a) Me gusta mucho viajar.", "b) Me gusto mucho viajar.", "c) Yo gusta mucho viajar.", "d) Me gustan mucho viajar."], 
            resposta: "a) Me gusta mucho viajar." 
        },
        { 
            tipo: 'multipla', 
            pontos: 1, 
            pergunta: "3. ¿Qué significa “Tengo hambre”?", 
            opcoes: ["a) Estou cansado.", "b) Estou com fome.", "c) Estou com frio.", "d) Estou com medo."], 
            resposta: "b) Estou com fome." 
        },
        { 
            tipo: 'multipla', 
            pontos: 1, 
            pergunta: "4. Complete: Ayer ___ al supermercado.", 
            opcoes: ["a) voy", "b) fui", "c) iba", "d) iré"], 
            resposta: "b) fui" 
        },
        { 
            tipo: 'multipla', 
            pontos: 1, 
            pergunta: "5. ¿Cuál opción completa correctamente?<br><em>Mañana ___ a estudiar para el examen.</em>", 
            opcoes: ["a) voy", "b) fui", "c) voy a", "d) estaba"], 
            resposta: "c) voy a" 
        },

        // 6–10 | Básico / Intermediário (2 pontos cada)
        { 
            tipo: 'multipla', 
            pontos: 2, 
            pergunta: "6. Complete: Cuando era niña, ___ mucho con mis amigos.", 
            opcoes: ["a) jugué", "b) jugaba", "c) jugaré", "d) he jugado"], 
            resposta: "b) jugaba" 
        },
        { 
            tipo: 'multipla', 
            pontos: 2, 
            pergunta: "7. ¿Cuál frase significa “Eu já terminei o trabalho”?", 
            opcoes: ["a) Ya terminé el trabajo.", "b) Ya terminaba el trabajo.", "c) Ya terminaré el trabajo.", "d) Ya terminaría el trabajo."], 
            resposta: "a) Ya terminé el trabajo." 
        },
        { 
            tipo: 'multipla', 
            pontos: 2, 
            pergunta: "8. Escolha a opção correta: No conozco a María. ¿Tú ___ conoces?", 
            opcoes: ["a) le", "b) la", "c) lo", "d) se"], 
            resposta: "b) la" 
        },
        { 
            tipo: 'multipla', 
            pontos: 2, 
            pergunta: "9. ¿Cuál frase está más natural?", 
            opcoes: ["a) Hace dos años que estudio español.", "b) Tengo dos años estudiando español.", "c) Hago dos años que estudio español.", "d) Estoy dos años estudiar español."], 
            resposta: "a) Hace dos años que estudio español." 
        },
        { 
            tipo: 'multipla', 
            pontos: 2, 
            pergunta: "10. Complete: Si tuviera más tiempo, ___ más español.", 
            opcoes: ["a) estudio", "b) estudié", "c) estudiaría", "d) estudiaré"], 
            resposta: "c) estudiaría" 
        },

        // 11–18 | Intermediário / Avançado (2 pontos cada)
        { 
            tipo: 'multipla', 
            pontos: 2, 
            pergunta: "11. Leia e responda:<br><br><em>“Aunque estaba cansada, decidió continuar trabajando porque tenía que terminar el proyecto antes del viernes.”</em><br><br>¿Por qué decidió continuar trabajando?", 
            opcoes: ["a) Porque quería descansar.", "b) Porque tenía que terminar un proyecto.", "c) Porque no tenía trabajo.", "d) Porque era viernes."], 
            resposta: "b) Porque tenía que terminar un proyecto." 
        },
        { 
            tipo: 'multipla', 
            pontos: 2, 
            pergunta: "12. Complete: Cuando llegué a la estación, el tren ya ___.", 
            opcoes: ["a) salió", "b) salía", "c) había salido", "d) ha salido"], 
            resposta: "c) había salido" 
        },
        { 
            tipo: 'multipla', 
            pontos: 2, 
            pergunta: "13. ¿Cuál opción expresa correctamente esta idea?<br><em>“Se eu soubesse disso antes, teria feito diferente.”</em>", 
            opcoes: ["a) Si lo sabía antes, lo habría hecho diferente.", "b) Si lo hubiera sabido antes, lo habría hecho diferente.", "c) Si lo sabría antes, lo hubiera hecho diferente.", "d) Si lo hubiera sabido antes, lo haría diferente."], 
            resposta: "b) Si lo hubiera sabido antes, lo habría hecho diferente." 
        },
        { 
            tipo: 'multipla', 
            pontos: 2, 
            pergunta: "14. Escolha a alternativa mais adequada: No creo que él ___ razón.", 
            opcoes: ["a) tiene", "b) tenga", "c) tendría", "d) tuvo"], 
            resposta: "b) tenga" 
        },
        { 
            tipo: 'multipla', 
            pontos: 2, 
            pergunta: "15. ¿Cuál frase expresa mejor una opinión con cierto grado de duda?", 
            opcoes: ["a) Sin duda, esta es la mejor opción.", "b) Es posible que esta sea la mejor opción.", "c) Esta es la mejor opción.", "d) Esta será la mejor opción."], 
            resposta: "b) Es posible que esta sea la mejor opción." 
        },
        { 
            tipo: 'multipla', 
            pontos: 2, 
            pergunta: "16. Leia:<br><br><em>“A pesar de que la empresa había anunciado importantes cambios, muchos empleados seguían mostrando cierta resistencia, ya que consideraban que las nuevas medidas podían afectar negativamente sus condiciones laborales.”</em><br><br>¿Por qué algunos empleados se resistían a los cambios?", 
            opcoes: ["a) Porque no conocían la empresa.", "b) Porque pensaban que las medidas podían perjudicarlos.", "c) Porque querían cambiar de trabajo.", "d) Porque la empresa había cerrado."], 
            resposta: "b) Porque pensaban que las medidas podían perjudicarlos." 
        },
        { 
            tipo: 'multipla', 
            pontos: 2, 
            pergunta: "17. Complete corretamente: De haber sabido que la situación terminaría así, probablemente no ___ aquella decisión.", 
            opcoes: ["a) tomaría", "b) habría tomado", "c) había tomado", "d) tomara"], 
            resposta: "b) habría tomado" 
        },
        { 
            tipo: 'multipla', 
            pontos: 2, 
            pergunta: "18. Qual alternativa soa mais natural e sofisticada em espanhol?", 
            opcoes: ["a) Quiero que me expliques eso otra vez.", "b) Me gustaría que me explicaras eso de nuevo.", "c) Yo quiero que tú explicas eso nuevamente.", "d) Me gustaría que explicas eso otra vez."], 
            resposta: "b) Me gustaría que me explicaras eso de nuevo." 
        },

        // 19 | Tradução (3 pontos)
        { 
            tipo: 'digitar', 
            pontos: 3, 
            pergunta: "19. 🌎 Tradução:<br>Traduza para o espanhol:<br><em>“Se eu tivesse mais tempo, viajaria para a Espanha e passaria alguns meses conhecendo diferentes cidades.”</em>", 
            respostaEsperada: [
                "si tuviera más tiempo, viajaría a españa y pasaría algunos meses conociendo diferentes ciudades",
                "si tuviera mas tiempo, viajaria a españa y pasaria algunos meses conociendo diferentes ciudades",
                "si tuviese más tiempo, viajaría a españa y pasaría algunos meses conociendo diferentes ciudades",
                "si tuviese mas tiempo, viajaria a españa y pasaria algunos meses conociendo diferentes ciudades"
            ] 
        },

        // 20 | Áudio de Pronúncia (3 pontos)
        { 
            tipo: 'audio', 
            pontos: 3, 
            pergunta: "20. 🎙️ Avalie sua pronúncia:<br>Leia a frase abaixo em voz alta e grave um áudio:<br><br><em>“Aunque al principio me costaba mucho hablar español, con el tiempo fui ganando confianza y ahora puedo comunicarme con personas de diferentes países sin sentirme tan inseguro.”</em>" 
        }
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
                htmlPergunta += `<button type="button" class="btn-opcao" onclick="definirRespostaMultipla(this, '${opcao.replace(/'/g, "\\'")}')">${opcao}</button>`;
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
                            <span id="timer-audio" class="timer">00:00 / 00:20</span>
                        </div>
                    </div>
                    <div class="visualizador-onda" id="onda-sonora">
                        <span></span><span></span><span></span><span></span><span></span><span></span>
                    </div>
                </div>
            `;
        }

        htmlPergunta += `</div></div>`;
        if (areaPerguntas) areaPerguntas.innerHTML = htmlPergunta;

        // Atualiza texto do botão na última pergunta
        if (index === bancoPerguntas.length - 1 && btnProximoPrincipal) {
            btnProximoPrincipal.innerHTML = "Finalizar Diagnóstico 🎯";
        }
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
                const respostaUser = inputDigitar.value.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                const acertou = perguntaData.respostaEsperada.some(exp => {
                    const cleanExp = exp.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                    return respostaUser === cleanExp;
                });
                if (acertou) {
                    pontuacaoTotal += perguntaData.pontos;
                }
            }
        } else if (perguntaData.tipo === 'audio') {
            if (tempoGravacao > 0) {
                pontuacaoTotal += perguntaData.pontos;
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
                if (btn) btn.classList.add('gravando');
                if (onda) onda.classList.add('animando');
                if (label) label.innerText = "Gravando áudio...";

                tempoGravacao = 0;
                intervaloTempo = setInterval(() => {
                    tempoGravacao++;
                    let seg = tempoGravacao < 10 ? `0${tempoGravacao}` : tempoGravacao;
                    if (timer) timer.innerText = `00:${seg} / 00:20`;

                    if (tempoGravacao >= 20) {
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

            if (btn) {
                btn.classList.remove('gravando');
                btn.classList.add('concluido');
                btn.innerHTML = '✔';
            }
            if (onda) onda.classList.remove('animando');
            if (label) label.innerText = "Áudio gravado com sucesso!";
        }
    };

    // Cálculo final e exibição dos resultados (Pontuação máxima = 37)
    function finalizarDiagnostico() {
        irParaEtapa(3);

        let nivelResult = "";
        let planoResult = "";
        let descResult = "";

        if (pontuacaoTotal <= 8) {
            nivelResult = "Iniciante (A1)";
            planoResult = "Plano Descoberta";
            descResult = "Ideal para quem está no começo ou deseja recomeçar com uma base sólida e sem vícios.";
        } else if (pontuacaoTotal <= 18) {
            nivelResult = "Básico (A2)";
            planoResult = "Plano Conexão";
            descResult = "Você já entende estruturas básicas, mas precisa destravar sua fala e ganhar vocabulário.";
        } else if (pontuacaoTotal <= 28) {
            nivelResult = "Intermediário (B1/B2)";
            planoResult = "Plano Fluidez";
            descResult = "Sua comunicação flui, mas falta refinamento gramatical e segurança para situações profissionais.";
        } else {
            nivelResult = "Avançado (B2/C1)";
            planoResult = "Plano Master / Executivo";
            descResult = "Excelente domínio! Foco na eliminação de pequenos erros sutis, sofisticação e conversação avançada.";
        }

        const elemNivel = document.getElementById('resultado-texto-nivel');
        const elemPlano = document.getElementById('nome-plano');
        const elemDesc = document.getElementById('desc-plano');

        if (elemNivel) elemNivel.innerHTML = `Pontuação: <strong>${pontuacaoTotal}</strong> de 37 pontos.<br>Seu nível estimado é: <strong>${nivelResult}</strong>`;
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

    // =======================================================
    // 4. LÓGICA DE ABRIR E FECHAR O MODAL SOBRE MÍ
    // =======================================================
    const modal = document.getElementById("modal-sobre");
    const btnFechar = document.getElementById("fechar-modal");
    const linksSobre = document.querySelectorAll('a[href="#sobre-raquel"]');

    if (modal && btnFechar) {
        linksSobre.forEach(link => {
            link.addEventListener("click", function (e) {
                e.preventDefault();
                modal.classList.add("ativo");
            });
        });

        btnFechar.addEventListener("click", function () {
            modal.classList.remove("ativo");
        });

        modal.addEventListener("click", function (e) {
            if (e.target === modal) {
                modal.classList.remove("ativo");
            }
        });
    }
});