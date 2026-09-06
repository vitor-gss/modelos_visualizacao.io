from pgmpy.models import DynamicBayesianNetwork as DBN
from pgmpy.factors.discrete import TabularCPD
from pgmpy.inference import DBNInference
import numpy as np
from database import SessionLocal, insert_student, insert_bayesian_network, insert_node, insert_edge, insert_node_probability
import random

class Student_DBN:
    def __init__(self, root: str, nodes_names: list[str]): 
        self.dbn = DBN()
        self.nodes_names = nodes_names
        self.edges, self.nodes = self.set_nodes(root, nodes_names)
        self.dbn.add_edges_from(self.edges)
        self.set_cpds()
        self.dbn.initialize_initial_state()
        self.infer = DBNInference(self.dbn)
        self.evidence_history = {}
        self.belief_history = {node: [] for node in self.nodes_names}
        self.posterior_belief = {node: [] for node in self.nodes_names}
    def set_nodes(self, root: str, nodes: list[str]) -> list[tuple[str, int]]: # Corrected type hint here
        edges_list = []
        nodes_list = [(f"UP {root}", 0), (f"UP {root}", 1)]
        edges_list.append(((f"UP {root}", 0), (f"UP {root}", 1)))
        for node in nodes:
            if node == root:
                continue
            nodes_list.append((f"UP {node}", 0))
            nodes_list.append((f"UP {node}", 1))
            nodes_list.append((f"CP {node}", 0))
            edges_list.append(((f"UP {root}", 0), (f"UP {node}", 0)))
            edges_list.append(((f"UP {node}", 0), (f"UP {node}", 1)))
            edges_list.append(((f"UP {node}", 0),(f"CP {node}", 0)))
        return edges_list, nodes_list
    def set_cpds(self):
        print(self.nodes)
        transition_matrix = np.array([[0.8, 0.25, 0.25, 0.1], 
                                      [0.2, 0.75, 0.75, 0.9]])
        up_node_matrix = [[0.8, 0.1], [0.2, 0.9]]
        cp_node_matrix = [[0.85, 0.1], [0.15, 0.9]]
        cpd_root_0 = TabularCPD(variable=self.nodes[0], variable_card=2, values=[[0.75], [0.25]]) 
        cpd_root_1 = TabularCPD(variable=self.nodes[1], variable_card=2, values=[[0.8, 0.25], 
                                                                                 [0.2, 0.75]], evidence=[self.nodes[0]], evidence_card=[2])
        self.dbn.add_cpds(cpd_root_0, cpd_root_1)
        for node in self.nodes:
            if node[0] == self.nodes[0][0]:
                continue
            if node[1] == 1 and node[0][0] == 'U':
                print(node)
                cpd = TabularCPD(variable=node, variable_card=2, values=transition_matrix, evidence=[self.nodes[1], (node[0] ,0)], evidence_card=[2, 2])
            elif node[0][0] == 'C':
                cpd = TabularCPD(variable=node, variable_card=2, values=cp_node_matrix, evidence=[tuple(self.dbn.get_parents(node)[0])], evidence_card=[2])
            else:
                cpd = TabularCPD(variable=node, variable_card=2, values=up_node_matrix, evidence=[self.nodes[0]], evidence_card=[2])
            self.dbn.add_cpds(cpd)
        return
    def do_inference(self, node: str, evidence: list[int]):
        for t, e in enumerate(evidence):
            actual_t_nodes = self.get_nodes_t_slice(t)
            posterior_t_nodes = self.get_nodes_t_slice(t+1)
            self.evidence_history[(f'CP {node}', t)] = e
            actual_belief = self.infer.query(variables=actual_t_nodes, evidence=self.evidence_history)
            posterior_belief = self.infer.query(variables=posterior_t_nodes, evidence=self.evidence_history)
            for i in range(len(self.nodes_names)):
                self.belief_history[self.nodes_names[i]].append(actual_belief[actual_t_nodes[i]].values[1])
                self.posterior_belief[self.nodes_names[i]].append(posterior_belief[posterior_t_nodes[i]].values[1])
        return
    def get_probabilities(self) -> dict:
        return
    def get_nodes_t_slice(self, t):
        nodes_t_0 = [node for node in self.nodes if node[1] == 0 and node[0][0] == 'U']
        return [(node, t) for node, i in nodes_t_0]
    def get_node_percentage():
        return

model = Student_DBN("Lógica Proposicional", ["Lógica Proposicional", "Modus Tollens", "Modus Ponens", "Operadores"])
model.do_inference("Modus Tollens", [1,1,1,1,1])
student_model = Student_DBN("Lógica Proposicional", ["Lógica Proposicional", "Modus Tollens", "Modus Ponens", "Operadores"])
student_model.do_inference("Modus Tollens", [0,0,1,1,1])
db = SessionLocal()
insert_student(db, 'Vitor Gabriel', 0)
insert_bayesian_network(db, 0, 'tutor_model', 'T', 0)
insert_bayesian_network(db, 1, 'student_model', 'S', 0)


for i, node in enumerate(model.belief_history):
    insert_node(db, i, node, 'n', 0)
    insert_node(db, len(model.belief_history)+i, node, 'n', 1)
    insert_node_probability(db, model.belief_history[node][-1], 'domina', 'domina', i, 0)
    insert_node_probability(db, student_model.belief_history[node][-1], 'domina', 'domina', len(model.belief_history)+i, 0)
        