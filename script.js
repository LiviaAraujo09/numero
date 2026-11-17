
"use strict";

// ======================================
// VARIÁVEIS DO JOGO
// ======================================

let numeroSecreto;
let tentativas = 0;
let maxTentativas = 10;
let pontos = 0;
let jogoAtivo = true;
let palpites = [];

// ======================================
// ELEMENTOS HTML
// ======================================

const guessInput = document.getElementById("guess");
const guessButton = document.getElementById("guessButton");
const restartButton = document.getElementById("restartButton");
const playAgainButton = document.getElementById("playAgainButton");

const displayNumber = document.getElementById("displayNumber");
const feedback = document.getElementById("feedback");
const attemptsDisplay = document.getElementById("attempts");
const scoreDisplay = document.getElementById("score");

const hint = document.getElementById("hint");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const numberMessage = document.getElementById("numberMessage");
const numberCircle = document.getElementById("numberCircle");

const difficulty = document.getElementById("difficulty");
const modal = document.getElementById("resultModal");

// ======================================
// GERAR NÚMERO ALEATÓRIO
// ======================================

function sortearNumero() {
    return Math.floor(Math.random() * 100) + 1;
}

// ======================================
// DEFINIR DIFICULDADE
// ======================================

function definirDificuldade() {

    const nivel = difficulty.value;

    if (nivel === "easy") {
        maxTentativas = 15;
    }

    else if (nivel === "normal") {
        maxTentativas = 10;
    }

    else if (nivel === "hard") {
        maxTentativas = 7;
    }
}

// ======================================
// ATUALIZAR INFORMAÇÕES DA TELA
// ======================================

function atualizarTela() {

    attemptsDisplay.textContent =
        `${tentativas} / ${maxTentativas}`;

    scoreDisplay.textContent =
        String(pontos).padStart(4, "0");

    const progresso =
        (tentativas / maxTentativas) * 100;

    progressFill.style.width = progresso + "%";

    progressText.textContent =
        Math.round(progresso) + "%";
}

// ======================================
// INICIAR OU REINICIAR O JOGO
// ======================================

function restartGame() {

    numeroSecreto = sortearNumero();

    tentativas = 0;
    palpites = [];

    jogoAtivo = true;

    definirDificuldade();

    displayNumber.textContent = "?";

    numberMessage.textContent =
        "O número está entre 1 e 100";

    feedback.textContent =
        "💡 Digite um número e descubra se está certo!";

    hint.textContent =
        "A sorte favorece quem tenta!";

    guessInput.value = "";

    guessInput.disabled = false;
    guessButton.disabled = false;

    modal.classList.remove("active");

    numberCircle.classList.remove("pulse");

    atualizarTela();

    guessInput.focus();
}

// ======================================
// VERIFICAR PALPITE
// ======================================

function checkGuess() {

    if (!jogoAtivo) {
        return;
    }

    const valor = guessInput.value.trim();

    const palpite = Number(valor);

    // Verificar se o campo está vazio ou inválido

    if (
        valor === "" ||
        !Number.isInteger(palpite) ||
        palpite < 1 ||
        palpite > 100
    ) {

        feedback.textContent =
            "⚠️ Digite um número inteiro entre 1 e 100!";

        return;
    }

    // Verificar números repetidos

    if (palpites.includes(palpite)) {

        feedback.textContent =
            "🔁 Você já tentou esse número! Escolha outro.";

        guessInput.value = "";
        guessInput.focus();

        return;
    }

    // Registrar tentativa

    palpites.push(palpite);

    tentativas++;

    // Verificar se acertou

    if (palpite === numeroSecreto) {

        vencerJogo();

        return;
    }

    // Verificar se o número é menor

    if (palpite < numeroSecreto) {

        feedback.textContent =
            "📈 Muito baixo! Tente um número MAIOR.";

        hint.textContent =
            "O número secreto é maior que " + palpite + ".";

    }

    // Verificar se o número é maior

    else {

        feedback.textContent =
            "📉 Muito alto! Tente um número MENOR.";

        hint.textContent =
            "O número secreto é menor que " + palpite + ".";
    }

    atualizarDica(palpite);

    atualizarTela();

    guessInput.value = "";

    guessInput.focus();

    // Verificar se acabaram as tentativas

    if (tentativas >= maxTentativas) {

        perderJogo();
    }
}

// ======================================
// SISTEMA DE DICAS
// ======================================

function atualizarDica(palpite) {

    const distancia =
        Math.abs(numeroSecreto - palpite);

    if (distancia <= 5) {

        hint.textContent =
            "🔥 QUENTE! Você está muito perto!";

    }

    else if (distancia <= 15) {

        hint.textContent =
            "🌡️ Está chegando perto!";

    }

    else if (distancia <= 30) {

        hint.textContent =
            "❄️ Ainda está um pouco longe!";

    }

    else {

        hint.textContent =
            "🥶 Muito longe! Continue tentando!";
    }
}

// ======================================
// QUANDO O JOGADOR VENCE
// ======================================

function vencerJogo() {

    jogoAtivo = false;

    displayNumber.textContent =
        numeroSecreto;

    numberMessage.textContent =
        "🎉 Você encontrou o número secreto!";

    feedback.textContent =
        "🏆 PARABÉNS! VOCÊ VENCEU!";

    hint.textContent =
        "Sua sorte está em outro nível!";

    // Calcular pontos

    const pontosGanhos = Math.max(
        100,
        (maxTentativas - tentativas + 1) * 100
    );

    pontos += pontosGanhos;

    atualizarTela();

    // Bloquear os controles

    guessInput.disabled = true;
    guessButton.disabled = true;

    numberCircle.classList.add("pulse");

    // Mostrar resultado

    mostrarResultado(
        "🏆",
        "VOCÊ CONSEGUIU!",
        `O número era ${numeroSecreto}! Você ganhou ${pontosGanhos} pontos!`
    );
}

// ======================================
// QUANDO O JOGADOR PERDE
// ======================================

function perderJogo() {

    jogoAtivo = false;

    displayNumber.textContent =
        numeroSecreto;

    numberMessage.textContent =
        "O desafio terminou!";

    feedback.textContent =
        "😢 Suas tentativas acabaram!";

    hint.textContent =
        "Não desista! Tente novamente!";

    guessInput.disabled = true;
    guessButton.disabled = true;

    atualizarTela();

    mostrarResultado(
        "😢",
        "FIM DE JOGO!",
        `O número secreto era ${numeroSecreto}. Que tal tentar novamente?`
    );
}

// ======================================
// MOSTRAR JANELA DE RESULTADO
// ======================================

function mostrarResultado(emoji, titulo, mensagem) {

    document.getElementById("modalEmoji").textContent =
        emoji;

    document.getElementById("modalTitle").textContent =
        titulo;

    document.getElementById("modalText").textContent =
        mensagem;

    modal.classList.add("active");
}

// ======================================
// CONFIGURAR BOTÕES
// ======================================

// Botão TENTAR

guessButton.addEventListener("click", checkGuess);

// Botão NOVO JOGO

restartButton.addEventListener("click", restartGame);

// Botão JOGAR NOVAMENTE

playAgainButton.addEventListener("click", restartGame);

// Tecla ENTER para enviar palpite

guessInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        checkGuess();
    }

});

// Trocar dificuldade reinicia a partida

difficulty.addEventListener("change", function() {

    restartGame();

});

// ======================================
// INICIAR AUTOMATICAMENTE
// ======================================

restartGame();
