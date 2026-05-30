// Connected with your Supabase details!
const SUPABASE_URL = "https://biuuhmdmaclrtkevaiar.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpdXlobWRtYWNsdXJrZXZhaWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5NzkxNzcsImV4cCI6MjAzMTU1NTE3N30.8HhWpY2Cmsb-R_g9r_o-uYsh_y0-8pS6gN3l9W_FpEw";

const SECRET_PASSWORD = "taani20"; 
let currentUser = localStorage.getItem("chat_user") || "";

// login setup window
if (!currentUser || currentUser === "null" || currentUser === "") {
    currentUser = prompt("Who is logging in? (Type: boy or girl)");
    if (currentUser) {
        currentUser = currentUser.toLowerCase().trim();
        localStorage.setItem("chat_user", currentUser);
    } else {
        currentUser = "user";
    }
}

function checkPassword() {
    const pin = document.getElementById('password-input').value;
    if(pin === SECRET_PASSWORD) {
        document.getElementById('lock-screen').style.display = 'none';
        document.getElementById('app-container').style.display = 'flex';
        document.getElementById('password-input').value = ""; 
        fetchMessages();
        // Har 3 second mein automatically naye messages screen par lekar aayega
        setInterval(fetchMessages, 3000); 
    } else {
        alert("Wrong code! Try again.");
    }
}

// Message Database mein send karne ke liye
async function sendTextMessage() {
    const input = document.getElementById('msg-input');
    const text = input.value.trim();
    if(text === "") return;

    await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sender: currentUser, text: text })
    });

    input.value = "";
    fetchMessages(); // Turant refresh karo messages
}

// Messages Supabase se fetch (load) karne ke liye
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
        if (!chatMessages) return;
        chatMessages.innerHTML = ""; // Purana reset karo
        
        data.forEach(msg => {
            const newMsg = document.createElement('div');
            newMsg.classList.add('msg');
            
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
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto scroll to bottom
    } catch(err) {
        console.log("Error fetching messages:", err);
    }
}

// Enter daba kar chat send ho sake
document.getElementById('msg-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendTextMessage();
});

function lockApp() {
    document.getElementById('app-container').style.display = 'none';
    document.getElementById('lock-screen').style.display = 'flex';
}

function switchTab(tabName, tabElement) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active-screen'));
    tabElement.classList.add('active');
    
    const targetScreen = document.getElementById(`${tabName}-screen`);
    if(targetScreen) {
        targetScreen.classList.add('active-screen');
    }
}
