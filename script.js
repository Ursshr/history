// Connected with your Supabase details!
const SUPABASE_URL = "https://biuuhmdmaclrtkevaiar.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpdXlobWRtYWNsdXJrZXZhaWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5NzkxNzcsImV4cCI6MjAzMTU1NTE3N30.8HhWpY2Cmsb-R_g9r_o-uYsh_y0-8pS6gN3l9W_FpEw";
const SECRET_PASSWORD = "taani20"; 
let currentUser = localStorage.getItem("chat_user") || "";

// Prompt setup to handle users cleanly
function askWhoIsLoggingIn() {
    let name = prompt("Who is logging in? (Type: boy or girl)");
    if (name) {
        currentUser = name.toLowerCase().trim();
        localStorage.setItem("chat_user", currentUser);
    } else {
        currentUser = "user";
    }
}

// Trigger prompt if user is completely empty or resetting
if (!currentUser || currentUser === "null" || currentUser === "") {
    askWhoIsLoggingIn();
}

function checkPassword() {
    const pin = document.getElementById('password-input').value.trim();
    if (pin === SECRET_PASSWORD) {
        document.getElementById('lock-screen').style.display = 'none';
        document.getElementById('app-container').style.display = 'flex';
        document.getElementById('password-input').value = ""; 
        
        // Load messages instantly
        fetchMessages();
        // Check for new incoming messages every 3 seconds
        setInterval(fetchMessages, 3000); 
    } else {
        alert("Wrong code! Try again.");
    }
}

async function sendTextMessage() {
    const input = document.getElementById('msg-input');
    const text = input.value.trim();
    if (text === "") return;

    try {
        await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ sender: currentUser, text: text })
        });
        
        input.value = "";
        fetchMessages(); // Instantly reload to show your sent text
    } catch (e) {
        console.error("Error sending message:", e);
    }
}

async function fetchMessages() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/messages?select=*&order=id.asc`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        const data = await response.json();
        
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages || !Array.isArray(data)) return;
        
        chatMessages.innerHTML = ""; 
        
        data.forEach(msg => {
            const newMsg = document.createElement('div');
            newMsg.classList.add('msg');
            
            // Checks if message sender matches local login tag
            if (msg.sender === currentUser) {
                newMsg.classList.add('me');
            } else {
                newMsg.classList.add('them');
            }
            
            const span = document.createElement('span');
            span.classList.add('msg-text');
            span.textContent = msg.text;
            
            newMsg.appendChild(span);
            chatMessages.appendChild(newMsg);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight; 
    } catch (err) {
        console.error("Error fetching messages:", err);
    }
}

// Allow sending text on pressing Enter key
document.getElementById('msg-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendTextMessage();
});
