document.addEventListener("DOMContentLoaded", function () {
    // Respuestas correctas
    const correctAnswers = {
        question1: "1914",
        question2: "Fidel Castro",
        question3: ["Los Egipcios"],
        question4: "Segunda Guerra Mundial",
        question5: "Dionisio",
        question6: "Atenea",
        question7: ["Apolo"],
        question8: "Esfinge",
        question9: "1989",
        question10: "Heracles" // Respuesta correcta por defecto
    };

    // Función para comparar arrays sin importar el orden
    function arraysEqual(a, b) {
        if (!a || !b) return false;
        if (a.length !== b.length) return false;
        return a.sort().join(",") === b.sort().join(",");
    }

    // Función para calcular la puntuación
    function calculateScore(userAnswers) {
        let score = 0;

        for (const question in correctAnswers) {
            const userAnswer = userAnswers[question];
            const correctAnswer = correctAnswers[question];

            if (userAnswer !== undefined && userAnswer !== null && userAnswer !== "") {
                if (Array.isArray(correctAnswer)) {
                    // Preguntas de tipo checkbox
                    if (arraysEqual(userAnswer, correctAnswer)) {
                        score += 1; // Suma 1 punto si es correcta
                    } else {
                        score -= 0.33; // Resta 0.33 puntos si es incorrecta
                    }
                } else {
                    // Preguntas de tipo radio, select o texto
                    if (question === "question10") {
                        // Validación especial para la pregunta 10
                        if (
                            userAnswer.toLowerCase() === "heracles" ||
                            userAnswer.toLowerCase() === "hércules"
                        ) {
                            score += 1; // Suma 1 punto si es correcta
                        } else {
                            score -= 0.33; // Resta 0.33 puntos si es incorrecta
                        }
                    } else {
                        // Validación normal para las demás preguntas
                        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                            score += 1; // Suma 1 punto si es correcta
                        } else {
                            score -= 0.33; // Resta 0.33 puntos si es incorrecta
                        }
                    }
                }
            }
        }

        // Asegurar que la nota no sea inferior a 0 ni superior a 10
        return Math.max(0, Math.min(10, score));
    }

    // Función para mostrar la corrección y la puntuación
    function showCorrection(userAnswers, score) {
        const resultsContainer = document.getElementById("results-container");
        resultsContainer.innerHTML = `
            <h2>Resultados:</h2>
            <div id="score-container">Tu nota final es: ${score.toFixed(2)}</div>
        `;

        for (const question in correctAnswers) {
            const userAnswer = userAnswers[question];
            const correctAnswer = correctAnswers[question];
            const questionElement = document.querySelector(`[name="${question}"]`)?.closest(".question");

            if (questionElement) {
                if (userAnswer !== undefined && userAnswer !== null && userAnswer !== "") {
                    if (Array.isArray(correctAnswer)) {
                        // Preguntas de tipo checkbox
                        if (arraysEqual(userAnswer, correctAnswer)) {
                            questionElement.style.backgroundColor = "#d4edda"; // Verde si es correcta
                        } else {
                            questionElement.style.backgroundColor = "#f8d7da"; // Rojo si es incorrecta
                            const correctAnswerText = document.createElement("p");
                            correctAnswerText.textContent = `Respuesta correcta: ${correctAnswer.join(", ")}`;
                            correctAnswerText.style.color = "#721c24";
                            questionElement.appendChild(correctAnswerText);
                        }
                    } else {
                        // Preguntas de tipo radio, select o texto
                        if (question === "question10") {
                            // Validación especial para la pregunta 10
                            if (
                                userAnswer.toLowerCase() === "heracles" ||
                                userAnswer.toLowerCase() === "hércules"
                            ) {
                                questionElement.style.backgroundColor = "#d4edda"; // Verde si es correcta
                            } else {
                                questionElement.style.backgroundColor = "#f8d7da"; // Rojo si es incorrecta
                                const correctAnswerText = document.createElement("p");
                                correctAnswerText.textContent = `Respuesta correcta: Heracles o Hércules`;
                                correctAnswerText.style.color = "#721c24";
                                questionElement.appendChild(correctAnswerText);
                            }
                        } else {
                            // Validación normal para las demás preguntas
                            if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                                questionElement.style.backgroundColor = "#d4edda"; // Verde si es correcta
                            } else {
                                questionElement.style.backgroundColor = "#f8d7da"; // Rojo si es incorrecta
                                const correctAnswerText = document.createElement("p");
                                correctAnswerText.textContent = `Respuesta correcta: ${correctAnswer}`;
                                correctAnswerText.style.color = "#721c24";
                                questionElement.appendChild(correctAnswerText);
                            }
                        }
                    }
                }
            }
        }

        resultsContainer.style.display = "block"; // Mostrar resultados
    }

    // Función para validar respuestas
    function validateAnswers(event) {
        event.preventDefault(); // Evita recargar la página

        clearInterval(intervalo); // Detiene el temporizador

        const userAnswers = {
            question1: document.querySelector('input[name="question1"]:checked')?.value,
            question2: document.getElementById('question2')?.value.trim(),
            question3: Array.from(document.querySelectorAll('input[name="question3"]:checked')).map(el => el.value),
            question4: document.getElementById('question4')?.value.trim(),
            question5: document.querySelector('input[name="question5"]:checked')?.value,
            question6: document.getElementById('question6')?.value,
            question7: Array.from(document.querySelectorAll('input[name="question7"]:checked')).map(el => el.value),
            question8: document.getElementById('question8')?.value.trim(),
            question9: document.querySelector('input[name="question9"]:checked')?.value,
            question10: document.getElementById('question10')?.value
        };

        const score = calculateScore(userAnswers);

        showCorrection(userAnswers, score); // Mostrar resultados y puntuación
    }

    // Variables del temporizador
    let tiempoRestante = 300; // 5 minutos en segundos
    const timerElement = document.getElementById("timer");
    const startButton = document.getElementById("start-button");
    const stopButton = document.getElementById("stop-button");
    let intervalo;

    // Función para actualizar el temporizador
    function actualizarTemporizador() {
        if (tiempoRestante > 0) {
            tiempoRestante--;
            const minutos = Math.floor(tiempoRestante / 60);
            const segundos = tiempoRestante % 60;
            timerElement.textContent = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;

            // Mostrar advertencia cuando queden 15 segundos
            if (tiempoRestante === 15) {
                timerElement.style.color = "red";
                alert("¡Quedan 15 segundos!");
            }
        } else {
            clearInterval(intervalo);
            timerElement.textContent = "⏳ TIEMPO AGOTADO";
            timerElement.classList.add("fin");
        }
    }

    // Función para iniciar el temporizador
    function startTimer() {
        clearInterval(intervalo); // Limpiar el intervalo anterior (si existe)
        intervalo = setInterval(actualizarTemporizador, 1000); // Iniciar el intervalo
    }

    // Función para detener el temporizador
    function stopTimer() {
        clearInterval(intervalo);
    }

    // Función para reiniciar el formulario
    function resetForm() {
        console.log("Función resetForm ejecutada."); // Mensaje de depuración

        const form = document.getElementById("quizForm");
        const resultsContainer = document.getElementById("results-container");

        if (form) {
            console.log("Formulario encontrado. Restableciendo..."); // Mensaje de depuración
            form.reset(); // Restablece todos los campos del formulario
        } else {
            console.error("No se encontró el formulario con ID 'quizForm'.");
        }

        if (resultsContainer) {
            console.log("Contenedor de resultados encontrado. Ocultando..."); // Mensaje de depuración
            resultsContainer.style.display = "none";
        } else {
            console.error("No se encontró el contenedor de resultados con ID 'results-container'.");
        }

        console.log("Reiniciando temporizador..."); // Mensaje de depuración
        clearInterval(intervalo); // Detiene el temporizador actual
        tiempoRestante = 300; // Reinicia el tiempo a 5 minutos
        timerElement.textContent = "5:00"; // Actualiza el texto del temporizador
        timerElement.style.color = ""; // Restablece el color del temporizador
        timerElement.classList.remove("fin"); // Elimina la clase "fin" si está presente

        startTimer(); // Reinicia el temporizador
        console.log("Formulario reiniciado correctamente."); // Mensaje de depuración
    }

    // Event Listeners
    if (startButton) {
        startButton.addEventListener("click", startTimer);
    }
    if (stopButton) {
        stopButton.addEventListener("click", stopTimer);
    }

    // Iniciar temporizador automáticamente al cargar la página
    startTimer();

    // Event Listener para el formulario
    const form = document.getElementById("quizForm");
    if (form) {
        form.addEventListener("submit", validateAnswers);
    }
});