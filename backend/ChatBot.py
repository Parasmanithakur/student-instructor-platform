from flask import Blueprint, request, jsonify
import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
def chat(data):
   
    print("Chat function called with data:", data)
    question = data.get('message', '')
    context = data.get('context', 'general knowledge')

    if not question:
        return jsonify({'error': 'Message is required'}), 400

    try:
        client = openai.OpenAI()
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": f"You are a helpful course assistant with expertise in {context}"},
                {"role": "user", "content": question}
            ],
            max_tokens=300,
            temperature=0.7
        )
        return jsonify({"response": response.choices[0].message.content})
    except Exception as e:
        print("Error in chat function:", e)
        return jsonify({"error": str(e)}), 500