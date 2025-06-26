from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
class ChatRequest(BaseModel):
    message: str

import os
from dotenv import load_dotenv

load_dotenv()

from app.chatbot_manager import ChatbotManager

app = FastAPI()
security = HTTPBasic()

chatbot_manager: ChatbotManager = None

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGIN")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    global chatbot_manager
    chatbot_manager = ChatbotManager()


def authenticate(credentials: HTTPBasicCredentials = Depends(security)):
    user_role = chatbot_manager.authenticate_user(credentials.username, credentials.password)
    if user_role is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"username": credentials.username, "role": user_role}


@app.get("/")
def test():
    return {"message": "Hi there. Please login to chat. Use /login"}


@app.post("/register")
def register(username: str = Body(...), password: str = Body(...), role: str = Body(...)):
    message = chatbot_manager.add_user(username, password, role)
    return message

@app.get("/login")
def login(user=Depends(authenticate)):
    # Login endpoint, returns welcome message and role
    return {"message": f"Welcome {user['username']}!", "role": user["role"]}


@app.get("/logout")
def logout(user=Depends(authenticate)):
    # Logout endpoint, returns goodbye message
    return {"message": f"Goodbye {user['username']}! You've been logged out."}


@app.get("/test")
def test(user=Depends(authenticate)):
    # Authenticated test endpoint to verify login and chat access
    return {"message": f"Hello {user['username']}! You can now chat.", "role": user["role"]}


@app.get("/save_folder_data")
def save_data():
    # Trigger data extraction and saving
    message = chatbot_manager.extract_and_save_data()
    return {"message": message}

@app.post("/chat")
async def query(request: ChatRequest, user=Depends(authenticate)):
    username = user["username"]
    role = user["role"]
    print(request.message,username,role)
    response = await chatbot_manager.chat(request.message, str(username), str(role))
    print("response", response)
    return {"message": response}


@app.post("/users/add")
def add_user(username: str = Body(...), password: str = Body(...), role: str = Body(...), user=Depends(authenticate)):
    # Add a new user (admin only)
    if user["role"] != "hr":
        raise HTTPException(status_code=403, detail="Only admin can add users.")
    message = chatbot_manager.add_user(username, password, role)
    return {"message": message}


@app.put("/users/update")
def update_user(username: str = Body(...), password: str = Body(None), role: str = Body(None),
                user=Depends(authenticate)):
    # Update existing user details (admin only)
    if user["role"] != "hr":
        raise HTTPException(status_code=403, detail="Only admin can update users.")
    message = chatbot_manager.update_user(username, password, role)
    return {"message": message}


@app.delete("/users/delete")
def delete_user(username: str = Body(...), user=Depends(authenticate)):
    # Delete user by username (admin only)
    if user["role"] != "hr":
        raise HTTPException(status_code=403, detail="Only admin can delete users.")
    message = chatbot_manager.delete_user(username)
    return {"message": message}

@app.get("/users/get-all")
def get_users(user=Depends(authenticate)):
    if user["role"] != "hr":
        raise HTTPException(status_code=403, detail="Only HR can get all users.")
    
    current_user = user["username"]
    users = chatbot_manager.getAllUsers(current_user)
    return {"users": users}
