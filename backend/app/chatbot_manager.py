from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.services.chat_memory_service import ChatMemoryService
from app.services.llm_service import generate_response
from app.services.embedding_service import EmbeddingService
from app.services.user_database_service import UserDatabaseService
from app.services.vector_db_service import VectorStore

from app.utils.file_reader import read_files_in_folder


class ChatbotManager:
    def __init__(self):
        # Initialize required services
        self.user_db = UserDatabaseService()
        self.vector_store = VectorStore()
        self.embedding_service = EmbeddingService()
        self.memory_service = ChatMemoryService()

    def authenticate_user(self, username, password):
        # Authenticate user credentials and return role if valid
        user = self.user_db.get_user(username)
        if not user or user["password"] != password:
            return None
        return user["role"]

    def extract_and_save_data(self):
        try:
            # Extract text from files, split, embed and save in vector store
            folder_file_data = read_files_in_folder()

            if not folder_file_data:
                return "No files found to process"

            extracted_data = {
                "docs": [],
                "embeddings": [],
                "access_role": [],
                "ids": []
            }

            # Configure text splitter for chunking large text
            text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
                chunk_size=1024,
                chunk_overlap=256,
            )

            # Process each file's content
            for file_data in folder_file_data:
                file_content = file_data["content"]
                if not file_content.strip():  # Skip empty files
                    continue

                # Split text into chunks
                text_chunks = text_splitter.split_text(file_content)

                for i, chunk in enumerate(text_chunks):
                    try:
                        # Generate embedding for each chunk
                        embedding = self.embedding_service.get_embedding(chunk)
                        
                        if embedding is not None:  # Only add if embedding was generated successfully
                            extracted_data["embeddings"].append(embedding)
                            extracted_data["docs"].append(chunk)
                            extracted_data["access_role"].append({"role_access": file_data["subfolder"]})
                            extracted_data["ids"].append(f"{file_data['file_name']}_part_{i + 1}")
                    except Exception as e:
                        print(f"Error processing chunk {i} from file {file_data['file_name']}: {str(e)}")
                        continue

            if not extracted_data["docs"]:
                return "No valid documents were processed"

            # Save all chunks and embeddings to vector store with metadata
            self.vector_store.save_documents(
                documents=extracted_data["docs"],
                metadatas=extracted_data["access_role"],
                ids=extracted_data["ids"],
                embeddings=extracted_data["embeddings"]
            )

            return f"Successfully processed {len(extracted_data['docs'])} document chunks"
        except Exception as e:
            error_message = f"Error during data extraction and saving: {str(e)}"
            print(error_message)
            return error_message

    async def chat(self, message, username, role):
        # Generate embedding for query and retrieve relevant documents by role
        retrieved_contexts = self.vector_store.query(
            query_embeddings=self.embedding_service.get_embedding(
                query=message
            ),
            where={'role_access': {'$in': [role, 'general']}},  # Filter by role access or general
            n_results=3  # Retrieve top 3 results
        )
        # Generate response from LLM using retrieved docs and user chat memory
        response = await generate_response(user_query=message,
                                           retrieved_contexts=retrieved_contexts['documents'],
                                           memory=self.memory_service.get_memory(username)
                                           )
        # Return response with source document info
        return {"response": response, "source_locations": retrieved_contexts["ids"],
                "source_content": retrieved_contexts["documents"]}

    def add_user(self, username, password, role):
        # Add a new user to database
        self.user_db.add_user(username, password, role)
        return "User added successfully"

    def update_user(self, username, password, role):
        # Update existing user information
        self.user_db.update_user(username, password, role)
        return "User updated successfully"

    def delete_user(self, username):
        # Delete user from database
        self.user_db.delete_user(username)
        return "User deleted successfully"
        
    def getAllUsers(self, current_username):
        users = self.user_db.get_all_users()
        filtered_users = [user for user in users if user["username"] != current_username]
        return filtered_users
