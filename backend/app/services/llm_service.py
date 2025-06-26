from datetime import datetime
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()

async def generate_response(
        user_query,
        retrieved_contexts,
        memory,
        model="llama-3.1-8b-instant"):
    llm = ChatGroq(
        model=model,
        temperature=0.2,
        max_tokens=1024,
    )

    # Create message chain
    messages = [
       ("system",
            f"""
            You are a precise and concise assistant for FinSolve Technologies.

            - ONLY answer based on the provided context
            - Respond in a short, clear format: avoid explaining your reasoning and the code
            - Give output as clean markdown with suitable emojis.
            - Address the user with a few subtle greetings.
            - Don't show the code you'r using just the final answer.
            - Cite sources using [1][2] if available
            - If you don’t know, say: "I don't have enough information, Sorry for that.🥲"
            - Do NOT repeat the question
            - Today’s date is {datetime.now().strftime("%Y-%m-%d")}
            """),
        *memory.load_memory_variables({})["chat_history"],
        ("human", f"""
        Context:
        {"\n".join(str(item) for item in retrieved_contexts)}
        
        Question:
        {user_query}
        """)
    ]

    # Get and store response
    response = llm.invoke(messages)
    memory.save_context(
        {"input": user_query},
        {"output": response.content}
    )

    return response.content
