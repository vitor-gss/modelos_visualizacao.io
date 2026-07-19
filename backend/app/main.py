from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from .database import get_data, get_db
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Integration Dynamic Bayesian Network and SQL")

origins = [
    "http://localhost:3000",  
    "http://localhost:5173",  
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"]
)

class NodeDataResponse(BaseModel):
    name: str
    probability: float

    class Config:
        from_attributes = True



@app.get("/")
async def read_root():
    return {"message": "Welcome to FastAPI"}

@app.get("/api/network/{net_id}", response_model=List[NodeDataResponse])
async def get_network_data(net_id: int, db: Session = Depends(get_db)):
    dados = get_data(db, net_id)
    
    if not dados:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Nenhum dado encontrado para esta rede."
        )
        
    return dados