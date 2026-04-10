// --- AUTO-DETECT LOGIC ---
document.getElementById('analyze-btn').addEventListener('click', async () => {
    const email = document.getElementById('email-input').value;
    const analyzeBtn = document.getElementById('analyze-btn');
    
    if (!email.trim()) {
        alert("Please paste an incoming thread first.");
        return;
    }
    
    const originalText = analyzeBtn.innerHTML;
    analyzeBtn.innerHTML = "Analyzing...";
    analyzeBtn.disabled = true;
    
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const toneSelect = document.getElementById('tone-select');
            const urgencySelect = document.getElementById('urgency-select');
            
            toneSelect.value = data.tone || "Professional & Executive";
            urgencySelect.value = data.urgency || "Normal";
            
            [toneSelect, urgencySelect].forEach(el => {
                el.style.borderColor = '#7928CA';
                el.style.boxShadow = '0 0 0 4px rgba(121, 40, 202, 0.15)';
                setTimeout(() => {
                    el.style.borderColor = '';
                    el.style.boxShadow = '';
                }, 1000);
            });
            
            analyzeBtn.innerHTML = "Vibe Detected!";
        } else {
            analyzeBtn.innerHTML = "Error";
        }
    } catch(err) {
        analyzeBtn.innerHTML = "Failed";
    }
    
    setTimeout(() => {
        analyzeBtn.innerHTML = originalText;
        analyzeBtn.disabled = false;
    }, 2000);
});

// --- GENERATION LOGIC ---
document.getElementById('generate-btn').addEventListener('click', async () => {
    const email = document.getElementById('email-input').value;
    const context = document.getElementById('context-input').value;
    const tone = document.getElementById('tone-select').value;
    const length = document.getElementById('length-select').value;
    const urgency = document.getElementById('urgency-select').value;
    const outputBox = document.getElementById('output-box');
    const statusMsg = document.getElementById('status-msg');

    if (!email.trim()) {
        statusMsg.style.color = '#e11d48'; // Red for light theme
        statusMsg.style.borderColor = '#e11d48';
        statusMsg.innerText = 'Missing email context';
        return;
    }

    statusMsg.style.color = '#7928CA'; // Deep purple to indicate processing
    statusMsg.style.borderColor = '#7928CA';
    statusMsg.innerText = 'Synthesizing...';
    
    outputBox.classList.remove('placeholder-active');
    outputBox.innerHTML = '<span style="color: #646473; font-style: italic;">Processing intent structure through neural core...</span>';
    
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, context, tone, length, urgency })
        });

        const data = await response.json();

        if (response.ok) {
            statusMsg.style.color = '#10b981'; // Green for success
            statusMsg.style.borderColor = '#10b981';
            statusMsg.innerText = 'Complete';
            
            outputBox.innerHTML = '';
            let i = 0;
            const text = data.reply;
            
            const interval = setInterval(() => {
                outputBox.innerHTML += text.charAt(i);
                i++;
                if (i >= text.length) clearInterval(interval);
            }, 3);

        } else {
            statusMsg.style.color = '#e11d48';
            statusMsg.style.borderColor = '#e11d48';
            statusMsg.innerText = 'Server Error';
            outputBox.innerHTML = `<span style="color: #e11d48;">Error: ${data.detail}</span>`;
        }

    } catch (err) {
        statusMsg.style.color = '#e11d48';
        statusMsg.style.borderColor = '#e11d48';
        statusMsg.innerText = 'Network Error';
        outputBox.innerHTML = `<span style="color: #e11d48;">Network Error: ${err.message}</span>`;
    }
});

// --- COPY LOGIC ---
document.getElementById('copy-btn').addEventListener('click', () => {
    const textToCopy = document.getElementById('output-box').innerText;
    
    if (textToCopy && !textToCopy.includes('Provide an email') && !textToCopy.includes('Processing intent')) {
        navigator.clipboard.writeText(textToCopy);
        const copyBtn = document.getElementById('copy-btn');
        const originalHTML = copyBtn.innerHTML;
        
        copyBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        copyBtn.style.color = "#10b981";
        copyBtn.style.borderColor = "#10b981";
        
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.color = "";
            copyBtn.style.borderColor = "";
        }, 1500);
    }
});
