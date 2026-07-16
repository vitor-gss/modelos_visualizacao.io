from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

engine = create_engine('sqlite:///dbn.db', connect_args={'check_same_thread': False})
SessionLocal = sessionmaker(autoflush=False, autocommit=False, bind=engine)
Base = declarative_base()

class Student(Base):
    __tablename__ = 'student'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)

class BayesianNetwork(Base):
    __tablename__ = 'bayesian_network'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    type = Column(String(100), nullable=False)
    fk_student_id = Column(Integer, ForeignKey("student.id"))

class Node(Base):
    __tablename__ = 'node'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    type = Column(String(100), nullable=False)
    fk_network_id = Column(Integer, ForeignKey("bayesian_network.id"))

class Edge(Base):
    __tablename__ = 'edge'
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(100), nullable=False)
    fk_initial_node_id = Column(Integer, ForeignKey("node.id"))
    fk_final_node_id = Column(Integer, ForeignKey("node.id"))

class NodeProbability(Base):
    __tablename__ = 'node_probability'
    id = Column(Integer, primary_key=True, index=True)
    probability = Column(Float)
    node_state = Column(String(100), nullable=False)
    parent_node_state = Column(String(100), nullable=False)
    fk_node_id = Column(Integer, ForeignKey("node.id"))
    fk_parent_node_id = Column(Integer, ForeignKey("node.id"))

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Função auxiliar para inserir dados (pode ser usada em qualquer arquivo)
def insert_student(db: Session, name: str, id:int):
    student = Student(name=name, id=id)
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

def insert_bayesian_network(db: Session, id: int, name: str, type: str, fk_student_id: int):
    network = BayesianNetwork(id=id, name=name, type=type, fk_student_id=fk_student_id)
    db.add(network)
    db.commit()
    db.refresh(network)
    return network

def insert_node(db: Session, id:int, name: str, type: str, fk_network_id: int):
    node = Node( id=id, name=name, type=type, fk_network_id=fk_network_id)
    db.add(node)
    db.commit()
    db.refresh(node)
    return node

def insert_edge(db: Session, id:int, type: str, fk_initial_node_id: int, fk_final_node_id: int):
    edge = Edge( id=id, type=type, fk_initial_node_id=fk_initial_node_id, fk_final_node_id=fk_final_node_id)
    db.add(edge)
    db.commit()
    db.refresh(edge)
    return edge

def insert_node_probability(db: Session, probability: float, node_state: str, 
                           parent_node_state: str, fk_node_id: int, fk_parent_node_id: int):
    prob = NodeProbability(
        probability=probability,
        node_state=node_state,
        parent_node_state=parent_node_state,
        fk_node_id=fk_node_id,
        fk_parent_node_id=fk_parent_node_id
    )
    db.add(prob)
    db.commit()
    db.refresh(prob)
    return prob

Base.metadata.create_all(engine)