import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLAlchemy setup
Base = declarative_base()


class User(Base):
    __tablename__ = 'users'
    username = Column(String, primary_key=True)
    password = Column(String)
    role = Column(String)


class UserDatabaseService:
    def __init__(self, file_name="users.db", folder_path="../database"):
        db_dir = os.path.abspath(folder_path)
        os.makedirs(db_dir, exist_ok=True)

        self.engine = create_engine(f'sqlite:///{folder_path}/{file_name}', echo=False)
        Base.metadata.create_all(self.engine)
        self.session = sessionmaker(bind=self.engine)

    def add_user(self, username: str, password: str, role: str):
        session = self.session()
        try:
            if session.query(User).filter_by(username=username).first():
                return f"User '{username}' already exists."
            user = User(username=username, password=password, role=role)
            session.add(user)
            session.commit()
            return f"User '{username}' added successfully."
        finally:
            session.close()

    def update_user(self, username: str, password: str = None, role: str = None):
        session = self.session()
        try:
            user = session.query(User).filter_by(username=username).first()
            if not user:
                return f"User '{username}' not found."
            if password:
                user.password = password
            if role:
                user.role = role
            session.commit()
            return f"User '{username}' updated successfully."
        finally:
            session.close()

    def get_user(self, username: str):
        session = self.session()
        try:
            user = session.query(User).filter_by(username=username).first()
            if user:
                return {"username": user.username, "password": user.password, "role": user.role}
            return None
        finally:
            session.close()

    def delete_user(self, username: str):
        session = self.session()
        try:
            user = session.query(User).filter_by(username=username).first()
            if not user:
                return f"User '{username}' not found."
            session.delete(user)
            session.commit()
            return f"User '{username}' deleted successfully."
        finally:
            session.close()

    def get_all_users(self):
        session = self.session()
        try:
            users = session.query(User).all()
            return [
                {"username": u.username, "password": u.password, "role": u.role}
                for u in users
            ]
        finally:
            session.close()
