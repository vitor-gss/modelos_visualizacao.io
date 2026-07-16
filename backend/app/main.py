from fastapi import FastAPI, HTTPException, status, Path, Depends

app = FastAPI(title="Integration Dynamic Bayesian Network and SQL")

@app.get("/")
def root():
    return {"message": "Hello World"}