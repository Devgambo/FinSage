from langchain.memory import ConversationBufferMemory
from typing import Dict


class ChatMemoryService:
    def __init__(self):
        self.memories: Dict[str, ConversationBufferMemory] = {}

    def get_memory(self, session_id: str) -> ConversationBufferMemory:
        """Get or create memory for a session"""
        if session_id not in self.memories:
            self.memories[session_id] = self._create_new_memory()
        return self.memories[session_id]

    def _create_new_memory(self) -> ConversationBufferMemory:
        """Standardized memory creation"""
        return ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            input_key="input",
            output_key="output"
        )