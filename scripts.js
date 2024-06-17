async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    const chatWindow = document.getElementById('chat-window');

    // pesan user
    const userMessage = document.createElement('div');
    userMessage.className = 'message user';
    userMessage.innerHTML = `<p>${userInput}</p>`;
    chatWindow.appendChild(userMessage);

    // clearr
    document.getElementById('user-input').value = '';

    // Simulasi AI response with typing animation
    const aiMessage = document.createElement('div');
    aiMessage.className = 'message ai typing';
    aiMessage.innerHTML = `<p>...</p>`;
    chatWindow.appendChild(aiMessage);

    // Scroll to the bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // Get AI response using Groq API
    try {
        const response = await getGroqChatCompletion(userInput);
        aiMessage.innerHTML = formatAIResponse(response);
        aiMessage.classList.remove('typing');
    } catch (error) {
        aiMessage.innerHTML = `<p>Sorry, something went wrong.</p>`;
        aiMessage.classList.remove('typing');
    }

    // Scroll to the bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function getGroqChatCompletion(userInput) {
    const apiKey = prompt("input apikey anda"); // Isi
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messages: [
                {
                    role: 'user',
                    content: userInput
                }
            ],
            model: 'llama3-70b-8192' //Ini adalah model Ai nya, bisa diganti. sesuai yang ada di grooq Ai
        })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "Sorry, I couldn't understand that.";
}

function formatAIResponse(response) {
    const boldPattern = /\*\*(.*?)\*\*/g;
    const codePattern = /```([\s\S]*?)```|`([^`]+)`/g;

    response = response.replace(boldPattern, '<strong>$1</strong>');
    response = response.replace(codePattern, (match, p1, p2) => {
        const code = p1 || p2;
        return `<div class="code-block">${code}</div>`;
    });

    return `<p>${response}</p>`;
} 
