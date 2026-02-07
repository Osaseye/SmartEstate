// AI Service Logic
// Handles hybrid response generation: Local Rules -> OpenAI Fallback

const LOCAL_KNOWLEDGE = [
  {
    keywords: ['pay', 'payment', 'rent', 'bank', 'transfer', 'account'],
    response: "You can manage all your payments in the 'Payments' tab. We support direct bank transfers and proof-of-payment uploads. Check the details on the payment page for the estate account info."
  },
  {
    keywords: ['maintenance', 'repair', 'broken', 'fix', 'plumbing', 'electric', 'leaking'],
    response: "For any repairs, please submit a maintenance request in the 'Maintenance' section. You can upload photos and track the status of your ticket there. Our team usually responds within 24 hours."
  },
  {
    keywords: ['tenant', 'add tenant', 'register', 'code', 'estate code'],
    response: "To join an estate, you'll need the unique Estate Code from your manager. If you are a manager, you can find this code in your Dashboard settings to share with new residents."
  },
  {
    keywords: ['password', 'reset', 'login', 'account'],
    response: "If you're having trouble logging in, ensure your email is correct. You can update your password in the 'Settings' tab if you are already logged in."
  },
  {
    keywords: ['announcement', 'news', 'update', 'community'],
    response: "Check the 'Community' tab for the latest news and announcements from your estate manager. Important notices are also highlighted on your main dashboard."
  },
  {
    keywords: ['contact', 'email', 'phone', 'support', 'help'],
    response: "You can contact support at support@smartestate.com or call our helpline. For estate-specific issues, please contact your estate manager directly via the Community feature."
  }
];

export async function generateAIResponse(userMessage, apiKey) {
    const lowerMsg = userMessage.toLowerCase();

    // 1. Check Local Knowledge Base
    for (const rule of LOCAL_KNOWLEDGE) {
        if (rule.keywords.some(k => lowerMsg.includes(k))) {
            // Simulate a small delay for "thinking" feel
            await new Promise(r => setTimeout(r, 600)); 
            return rule.response;
        }
    }

    // 2. Fallback to OpenAI API
    if (apiKey) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo", // Cost-effective model
                    messages: [
                        { role: "system", content: "You are a helpful assistant for the SmartEstate application. Keep answers concise (under 50 words) and relevant to property management, tenants, and estate managers." },
                        { role: "user", content: userMessage }
                    ],
                    max_tokens: 100
                })
            });

            const data = await response.json();
            
            if (data.error) {
                console.warn("OpenAI API Error:", data.error);
                return "I'm currently unable to connect to my brain. Please try again later or contact support.";
            }

            return data.choices?.[0]?.message?.content || "I didn't quite catch that. Could you rephrase?";
        } catch (error) {
            console.error("AI Request Failed:", error);
            return "I'm having trouble connecting to the server. Please check your internet connection.";
        }
    }

    // 3. Fallback if no API key and no local match
    await new Promise(r => setTimeout(r, 1000));
    return "I'm currently running in offline mode with limited knowledge. Please ask about payments, maintenance, or estate codes, or configure an API key for more capabilities.";
}
