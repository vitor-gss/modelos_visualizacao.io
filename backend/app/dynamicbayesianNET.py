from pgmpy.models import DynamicBayesianNetwork as DBN
from pgmpy.factors.discrete import TabularCPD
from pgmpy.inference import DBNInference
import numpy as np
from database import SessionLocal, insert_student, insert_bayesian_network, insert_node, insert_edge, insert_node_probability
import pyagrum as gum
import pyagrum.lib.dynamicBN as gdyn
import random

class Student_Model_DBN:
  '''
  Modeling a student learnig improve with a DBN.
  Utilizing pgmpy inference methods and bayes theorem to refresh the model as long the student answer problems.
  To visualize the DBN we use graphviz and matplotlib.
  '''
  def __init__(self, root, nodes, edges):
    self.root = root
    self.nodes = nodes
    self.edges = edges
    self.dbn = DBN()
    self.dbn.add_edges_from(edges)
    self.set_cpds_priori_dbn()
    self.add_transition_edges()

  def add_transition_edges(self):
    for node in self.get_nodes(1):
      self.dbn.add_edge((node[0], 0), node)
  def parent_weight(self, node, ret):
    '''
    In our defination of probability of nodes we calculate the priori probability
    (usually when no evidence is added) based on a child-parent relationship with influency
    '''
    node_type = node[0].split()[0]
    parents = self.dbn.get_parents(node)


    father_node_type = parents[0][0].split(' ')[0]
    if node_type == 'UP' and father_node_type == 'UP':
      influency = 0.8
    elif node_type == 'CP' and father_node_type == 'UP':
      influency = 0.8
    elif node_type == 'P' and father_node_type == 'CP':
      influency = 0.7
    elif node_type == 'S' and father_node_type == 'P':
      influency = 0.7
    else:
      influency = 0.5 # Default for other combinations

    if ret == 'i':
      return influency
    else:
      return (influency - 1/(len(parents)))/len(parents)

  def matrix_prob(self, node, parent):
    '''
    The probability equation is in the READ.me
    '''
    print(parent, self.root)
    if parent == self.root:
      p_d_d = ((1/len(self.dbn.get_parents(node)))+self.parent_weight(node, 'p'))*float(self.dbn.get_cpds(parent).values[1])
    elif len(self.dbn.get_cpds(parent).values.shape) == 2:
      print(self.dbn.get_parents(node), node, len(self.dbn.get_cpds(parent).values.shape))
      p_d_d = ((1/len(self.dbn.get_parents(node)))+self.parent_weight(node, 'p'))*float(self.dbn.get_cpds(parent).values[1][0])
    else:
      p_d_d = ((1/len(self.dbn.get_parents(node)))+self.parent_weight(node, 'p'))*float(self.dbn.get_cpds(parent).values[1][0][0])
    p_nd_d = (1-p_d_d)
    p_nd_nd = (1/len(self.dbn.get_parents(node)))
    p_d_nd = 1-p_nd_nd
    print(p_d_d, p_nd_d)
    return [[p_nd_d, p_nd_nd], [p_d_d, p_d_nd]]
  def set_cpds_priori_dbn(self):
    for node in self.get_nodes(0):
      print(node)
      if node == self.root:
        cpd = TabularCPD(node,
                      variable_card=2,
                      values=[
                          [0.75],
                          [0.25]
                      ]
                      )
        self.dbn.add_cpds(cpd)
      else:
        parents = self.dbn.get_parents(node)
        if not parents:
            raise ValueError(f"Node {node} is not the root and has no parents in the DBN.")

        cpd = TabularCPD(node,
                        variable_card=2,
                        values=self.matrix_prob(node, parents[0]),
                        evidence=parents,
                        evidence_card=[2]
                        )
        self.dbn.add_cpds(cpd)
  def matrix_prob_time_silce(self, node):
    '''
    When using a DBN when the time slice = 1, the nodes in this time slice has
    2 parents, the correspondent node in t=0, and the parent in t=1
    '''
    parents = [tuple(p) for p in self.dbn.get_parents(node)]
    if parents[0] == self.root:
      return  self.matrix_prob(node, parents[0])
    else:
      return np.concatenate((np.array(self.matrix_prob(node, parents[0])), np.array(self.matrix_prob(node, parents[1]))), axis=1)

  def set_cpds_posteriori_dbn(self):
    for node in self.get_nodes(1):
      if not (self.dbn.get_cpds(node) is None):
          self.dbn.remove_cpds(node)
      if node == (self.root[0], 1):
        cpd = TabularCPD(node,
                      variable_card=2,
                      values=self.matrix_prob(node, self.root),
                      evidence=self.dbn.get_parents(node),
                      evidence_card=[2]
                      )
        self.dbn.add_cpds(cpd)
      else:
        print(self.dbn.get_parents(node))
        cpd = TabularCPD(node,
                      variable_card=2,
                      values=self.matrix_prob_time_silce(node),
                      evidence=self.dbn.get_parents(node),
                      evidence_card=[2, 2]
                      )
        self.dbn.add_cpds(cpd)

  def matrix_prob_time_slice_propagation(self, node):
    parents = [tuple(p) for p in self.dbn.get_parents(node)]
    # print(((node[0], 0), parents[0]))
    # print(np.concatenate((np.array(self.matrix_prob((node[0], 0), parents[0])), np.array(self.matrix_prob(node, parents[1]))), axis=1))
    return np.concatenate((np.array(self.matrix_prob((node[0], 0), parents[0])), np.array(self.matrix_prob(node, parents[1]))), axis=1)
  def refresh_cpd(self, node, parent):
    '''

    '''
    infer = self.inference.query(
      variables=[parent],
      evidence={node: 1}
    )
    # print(node, parent)
    print("Inference value:", infer[parent].values[1])
    node_cpd = self.dbn.get_cpds((parent[0], 1)).values

    node_cpd[0][0] = infer[parent].values[0]
    node_cpd[1][0] = infer[parent].values[1]
    print(f"Node {(parent[0], 1)} CPD:",node_cpd)
    self.dbn.remove_cpds((parent[0], 1))
    cpd = TabularCPD((parent[0], 1),
                    variable_card=2,
                    values=node_cpd,
                    evidence=self.dbn.get_parents((parent[0], 1)),
                    evidence_card=[2]
                    )

    self.dbn.add_cpds(cpd)
    print('CPD', self.dbn.get_cpds((parent[0], 1)).values)
    return

  def evidence_parents_refresh(self, evidence, evidence_parent):
    # print(evidence, evidence_parent)
    # P(D_P|D_CP) = P(D_CP|D_P)
    matrix_cpd = np.concatenate((self.matrix_prob(self.dbn.get_parents(evidence_parent)[0], (self.root[0], 1)), np.array(self.matrix_prob((self.dbn.get_parents(evidence_parent)[0][0], 1), self.dbn.get_parents(evidence_parent)[0]))), axis=1)
    evidence_cpd = self.dbn.get_cpds(evidence).values
    p_d_d = (matrix_cpd[1][0]*evidence_cpd[0][0]+matrix_cpd[0][0]*evidence_cpd[1][0])/evidence_cpd[0][0]
    print(matrix_cpd)
    matrix_cpd[1][0] = p_d_d
    matrix_cpd[0][0] = 1 - p_d_d
    self.dbn.remove_cpds((self.dbn.get_parents(evidence_parent)[0][0], 1))
    cpd = TabularCPD((self.dbn.get_parents(evidence_parent)[0][0], 1),
                      variable_card=2,
                      values=matrix_cpd,
                      evidence=self.dbn.get_parents((self.dbn.get_parents(evidence_parent)[0][0], 1)),
                      evidence_card=[2, 2]
                      )
    self.dbn.add_cpds(cpd)
    matrix_cpd = np.concatenate((self.matrix_prob(evidence_parent, (self.dbn.get_parents(evidence_parent)[0][0], 1)), np.array(self.matrix_prob((evidence_parent[0], 1), evidence_parent))), axis=1)
    p_d_d = (matrix_cpd[1][0]*evidence_cpd[0][0]+matrix_cpd[0][0]*evidence_cpd[1][0])/evidence_cpd[0][0]
    matrix_cpd[1][0] = p_d_d
    matrix_cpd[0][0] = 1 - p_d_d
    self.dbn.remove_cpds((evidence_parent[0], 1))
    cpd = TabularCPD((evidence_parent[0], 1),
                      variable_card=2,
                      values=matrix_cpd,
                      evidence=self.dbn.get_parents((evidence_parent[0], 1)),
                      evidence_card=[2, 2]
                      )
    self.dbn.add_cpds(cpd)
    return
  def dbn_prob_propgation(self, visited_nodes, ind):
    for node in self.get_nodes(1):
      if not (node in visited_nodes):
        self.dbn.remove_cpds(node)
        if ind == 0:
          cpd = TabularCPD(node,
                    variable_card=2,
                    values=self.matrix_prob_time_slice_propagation(node),
                    evidence=self.dbn.get_parents(node),
                    evidence_card=[2, 2]
                    )
          self.dbn.add_cpds(cpd)
        elif node[0][0] == 'P':
          continue
        else:
          cpd = TabularCPD(node,
                    variable_card=2,
                    values=np.concatenate((self.evidence_parents_refresh(node, self.dbn.get_parents(node)[0]), self.matrix_prob(node,self.dbn.get_parents(node)[1]))),
                    evidence=self.dbn.get_parents(node),
                    evidence_card=[2, 2]
                    )
          self.dbn.add_cpds(cpd)

  def get_node_percentage(self, node):
    if node == self.root:
      return self.dbn.get_cpds(node).values[1]
    elif node[1] == 0 or (node[0], 1) == (self.root[0], 1):
      return self.dbn.get_cpds(node).values[1][0]
    else:
      return self.dbn.get_cpds(node).values[1][0][0]
  def initialize_dbn(self):
    self.dbn.initialize_initial_state()
    self.inference = DBNInference(self.dbn)
    return
  def transfer_prob(self):
    for node in self.get_nodes(1):
        p_d_d = self.get_node_percentage(node)
        p_nd_d = 1 - p_d_d
        if node == (self.root[0], 1):
            matrix_cpd = [[p_nd_d],
                          [p_d_d]
                          ]
            self.dbn.remove_cpds((node[0], 0))
            cpd = TabularCPD((node[0], 0),
                        variable_card=2,
                        values=matrix_cpd
                        )
            self.dbn.add_cpds(cpd)
            continue
        matrix_cpd = self.dbn.get_cpds((node[0], 0)).values
        matrix_cpd[1][0] = p_d_d
        matrix_cpd[0][0] = 1 - p_d_d
        self.dbn.remove_cpds((node[0], 0))
        cpd = TabularCPD((node[0], 0),
                        variable_card=2,
                        values=matrix_cpd,
                        evidence=self.dbn.get_parents((node[0], 0)),
                        evidence_card=[2]
                        )
        self.dbn.add_cpds(cpd)
    return
  def add_first_evidence(self, node, parent, value):
    self.dbn.add_edge(parent, node)
    self.dbn.add_edge(node, (node[0], 1))
    cpd = TabularCPD(node,
                    variable_card=2,
                    values=[
                        [value, 1-value],
                         [1-value, value]
                            ],
                    evidence=[parent],
                    evidence_card=[2]
                    )
    self.dbn.add_cpds(cpd)
    self.set_cpds_posteriori_dbn()
    self.initialize_dbn()
    self.refresh_cpd(node, self.root)
    self.evidence_parents_refresh(node, parent)
    visited_nodes = []
    def get_path(self, child):
      visited_nodes.append((child[0], 1))
      if child == self.root:
        return visited_nodes
      return get_path(self, self.dbn.get_parents(child)[0])
    print(get_path(self, node))
    self.dbn_prob_propgation(get_path(self, node), 0)
    return
  def add_evidence(self, node, parent, value):
    self.refresh_dbn()
    self.transfer_prob()
    self.dbn.add_edge(parent, node)
    self.dbn.add_edge(node, (node[0], 1))
    cpd = TabularCPD(node,
                    variable_card=2,
                    values=[
                        [value, 1-value],
                         [1-value, value]
                            ],
                    evidence=[parent],
                    evidence_card=[2]
                    )
    self.dbn.add_cpds(cpd)
    self.set_cpds_posteriori_dbn()
    self.initialize_dbn()
    self.refresh_cpd(node, self.root)
    self.evidence_parents_refresh(node, parent)
    visited_nodes = []
    def get_path(self, child):
      visited_nodes.append((child[0], 1))
      if child == self.root:
        return visited_nodes
      return get_path(self, self.dbn.get_parents(child)[0])
    # print(get_path(self, node))
    self.dbn_belief_propagation(get_path(self, node))
    return
  def dbn_belief_propagation(self, visited_nodes):
    print(visited_nodes)
    for node in self.get_nodes(0):
        if ((node[0], 1) not in visited_nodes) and (node != self.root):
          #  print('b_p', node)
          #  print('b_p', self.get_parents(node))
           matrix_cpd = self.dbn.get_cpds((node[0], 1))
          #  print(self.matrix_prob(node, (self.get_parents(node)[0], 1))[1][0], self.get_node_percentage((self.get_parents(node)[0], 1)), self.get_node_percentage(node))
          #  p_d_d = float(self.get_node_percentage(node)*self.get_node_percentage((self.get_parents(node)[0], 1))/self.matrix_prob(node, (self.get_parents(node)[0], 1))[1][0])           
          #  print(p_d_d)
           infer = self.inference.query(
            variables=[node],
            evidence={(self.get_parents(node)[0], 1): 1}
          )
           matrix_cpd.values[1][0][0] = infer[node].values[1]
           matrix_cpd.values[0][0][0] = infer[node].values[0]
           print(matrix_cpd.values)
           self.dbn.remove_cpds((node[0], 1))
           cpd = TabularCPD((node[0], 1),
                        variable_card=2,
                        values=matrix_cpd.values.reshape(2, -1),
                        evidence=self.dbn.get_parents((node[0], 1)),
                        evidence_card=[2, 2]
                        )
           self.dbn.add_cpds(cpd)

  def refresh_dbn(self):
    for node in self.get_nodes(1):
      p_d_d = self.get_node_percentage(node)
      p_nd_d = 1 - p_d_d
      if node == (self.root[0], 1):
        self.dbn.remove_cpds(self.root)
        cpd = TabularCPD(
            self.root,
            variable_card = 2,
            values = [[p_nd_d],
                      [p_d_d]
                      ]
        )
        self.dbn.add_cpds(cpd)
        continue
      # print((node[0], 0))
      matrix_cpd = self.dbn.get_cpds((node[0], 0)).values
      matrix_cpd[0][0] = p_nd_d
      matrix_cpd[1][0] = p_d_d
      self.dbn.remove_cpds((node[0], 0))
      cpd = TabularCPD(
          (node[0], 0),
          variable_card = 2,
          values = matrix_cpd,
          evidence_card = [2],
          evidence = self.dbn.get_parents((node[0], 0))
      )
      self.dbn.add_cpds(cpd)
    return
  def get_nodes(self, t):
    return [tuple(node) for node in self.dbn.nodes() if tuple(node)[1] == t]
  def get_edges(self):
    return self.dbn.edges()
  def get_parents(self, node):
    return tuple(self.dbn.get_parents(node)[0])
  def verify_model_cpds(self):
    for node in self.get_nodes(1):
      cpd = self.dbn.get_cpds(node)
      if cpd is not None:
          print(f"✓ {node}: {cpd.variable} | shape: {cpd.values.shape}")
      else:
          print(f"✗ {node}: SEM CPD!")
  def get_all_node_percentages(self):
    nodes_t1 = self.get_nodes(1)
    nodes_t0 = self.get_nodes(0)
    for i in range(len(nodes_t1)):
      print(f'{nodes_t1[i]} <- {nodes_t0[i]}\n{self.get_node_percentage(nodes_t1[i])}    {self.get_node_percentage(nodes_t0[i])}')
    return
  def get_children(self, node):
    children = []
    for edge in self.get_edges():
      if edge[0] == node:
        children.append(tuple(edge[1]))
    return children
    

model = Student_Model_DBN(root=("UP Estatística Básica", 0), nodes=[
    ("UP Estatística Básica", 0),
    ("UP Média", 0),
    ("UP Mediana", 0),
    ("UP Moda", 0),
    ("UP Probabilidade Básica", 0),

    ("CP Média Fácil", 0),
    ("CP Mediana Fácil", 0),
    ("CP Moda Fácil", 0),
    ("CP Probabilidade Fácil", 0)
], edges= [
    (("UP Estatística Básica", 0), ("UP Média", 0)),
    (("UP Estatística Básica", 0), ("UP Mediana", 0)),
    (("UP Estatística Básica", 0), ("UP Moda", 0)),
    (("UP Estatística Básica", 0), ("UP Probabilidade Básica", 0)),

    (("UP Média", 0), ("CP Média Fácil", 0)),
    (("UP Mediana", 0), ("CP Mediana Fácil", 0)),
    (("UP Moda", 0), ("CP Moda Fácil", 0)),
    (("UP Probabilidade Básica", 0), ("CP Probabilidade Fácil", 0))
])

def weighted_average(node, parent):
    if node == 0:
        p_d_d = 0.8*parent + 0.2*(1-parent)
        p_nd_d = 1 - p_d_d
        return [[0.8, 0.2],
                [p_nd_d, p_d_d ]]
    else:
        p_d_d = node*parent + (1-node)*(1-parent)
        p_nd_d = 1 - p_d_d
        return [[0.8, 0.2],
                [p_nd_d, p_d_d ]]
def forgetfulness_rate(node, trust, evidence):
    return trust*node + (1-trust)*evidence
def filter(node, t):
    belief = 1-np.e**(-node*t)
    return belief


def bayes_net(problem_range):
  node_count = {node[0]:0 for node in model.get_nodes(0)}
  nodes_prob = {node[0]:[] for node in model.get_nodes(0)}
  nodes_problem_rate = {node[0]:[] for node in model.get_nodes(0)}
  nodes_belief = {node[0]:[] for node in model.get_nodes(0)}
  nodes_trust = {node[0]:[] for node in model.get_nodes(0)}
  index = []
  columns = ['problem', 'node', 'probability', 'problem_rate','problem_count']
  root_inference = []
  evidence_prob= []
  line = []

  twotbn = gum.BayesNet()
  net_nodes_base = [node[0] for node in model.get_nodes(0)] # Get just the names, e.g., 'UP Média'

  for node_name in net_nodes_base:
        twotbn.add(gum.LabelizedVariable(f'{node_name}_0', f'{node_name} at t=0', ['nao_domina', 'domina']))
        twotbn.add(gum.LabelizedVariable(f'{node_name}_t', f'{node_name} at t=t', ['nao_domina', 'domina']))

  edges = [edge for edge in model.get_edges() if edge[1][1] == 0]
  print(edges)
  for source, target in edges:
      source_name = source[0]
      target_name = target[0]
      twotbn.addArc(f'{source_name}_0', f'{target_name}_0')
      twotbn.addArc(f'{source_name}_t', f'{target_name}_t')
  for nodes in model.get_nodes(0):
      node_name = nodes[0]
      twotbn.addArc(f'{node_name}_0', f'{node_name}_t')
  unrolled_net = gdyn.unroll2TBN(twotbn, 20)
  for node in model.get_nodes(0):
      node_name = node[0]
      if node_name == 'UP Estatística Básica':
          unrolled_net.cpt(f'{node_name}_0')[:] = [0.75, 0.25]
          nodes_prob[node[0]].append(0.25)
      else:
        print(node, model.get_parents(node)[0])
        unrolled_net.cpt(f'{node_name}_0')[{f'{model.get_parents(node)[0]}_0':'nao_domina'}] = [0.8, 0.2]
        unrolled_net.cpt(f'{node_name}_0')[{f'{model.get_parents(node)[0]}_0':'domina'}] = [1-model.get_node_percentage(node), model.get_node_percentage(node)]
        nodes_prob[node[0]].append(model.get_node_percentage(node))

  for i in range(1, 20):
      for node in model.get_nodes(0):
          node_name = node[0]

          if node_name == 'UP Estatística Básica':
              if i-1 == 0:
                  cpt = weighted_average(0, unrolled_net.cpt(f'{node_name}_{i-1}')[1])

              else:
                  cpt = weighted_average(unrolled_net.cpt(f'{node_name}_{i-1}')[1][0], unrolled_net.cpt(f'{node_name}_{i-1}')[1][1])
          else:
              parent_name = model.get_parents(node)[0]
              print(parent_name)
              # print([[0.9,0.1],weighted_average(unrolled_net.cpt(f'{node_name}_{i-1}')[1][0], unrolled_net.cpt(f'{parent_name}_{i}')[1][1])[0],weighted_average(0, unrolled_net.cpt(f'{node_name}_{i-1}')[1][1])[1],weighted_average(0, unrolled_net.cpt(f'{parent_name}_{i}')[1][1])[1]])
              if i-1 == 0:
                  if node_name[0] == 'C':
                      cpt = np.array([[0.9,0.1],weighted_average(unrolled_net.cpt(f'{node_name}_{i-1}')[1][0], unrolled_net.cpt(f'{parent_name}_{i}')[1][1])[0],weighted_average(0, unrolled_net.cpt(f'{node_name}_{i-1}')[1][1])[1],weighted_average(0, unrolled_net.cpt(f'{parent_name}_{i}')[1][1][1])[1]]).reshape(2,2,2)
                  else:
                      cpt = np.array([[0.9,0.1],weighted_average(unrolled_net.cpt(f'{node_name}_{i-1}')[1][0], unrolled_net.cpt(f'{parent_name}_{i}')[1][1])[0],weighted_average(0, unrolled_net.cpt(f'{node_name}_{i-1}')[1][1])[1],weighted_average(0, unrolled_net.cpt(f'{parent_name}_{i}')[1][1])[1]]).reshape(2,2,2)
              else:
                  if node_name[0] == 'C':
                      cpt = np.array([[0.9,0.1],weighted_average(unrolled_net.cpt(f'{node_name}_{i-1}')[1][1][0], unrolled_net.cpt(f'{parent_name}_{i}')[1][1])[0],weighted_average(0, unrolled_net.cpt(f'{node_name}_{i-1}')[1][1][1])[1],weighted_average(0, unrolled_net.cpt(f'{parent_name}_{i}')[1][1][1])[1]]).reshape(2,2,2)
                  else:
                      cpt = np.array([[0.9,0.1],weighted_average(unrolled_net.cpt(f'{node_name}_{i-1}')[1][1][0], unrolled_net.cpt(f'{parent_name}_{i}')[1][1])[0],weighted_average(0, unrolled_net.cpt(f'{node_name}_{i-1}')[1][1][1])[1],weighted_average(0, unrolled_net.cpt(f'{parent_name}_{i}')[1][1])[1]]).reshape(2,2,2)
          unrolled_net.cpt(f'{node_name}_{i}')[:] = cpt
  nodes =[ node for node in model.get_nodes(0) if node[0][0] == 'C' ]
  ie = gum.LazyPropagation(unrolled_net)

  for i in range(1, 20):
      node_name = random.choice(nodes)[0]
      # if node_count[node_name] == 3:
      #     a = node_name
      #     while node_name == a:
      #         node_name = random.choice(nodes)[0]
      node = f'{node_name}_{i}'
      evidence = f'P {i}_{i}'
      # if i < 10:
      #     tx = random.uniform(0.1+(i/10), 0.99)
      # else:
      tx = random.uniform(problem_range[0], problem_range[1])
      nodes_problem_rate[node_name].append(tx)
      p = gum.LabelizedVariable(evidence, 'Taxa de acerto do problema',  ['baixo', 'alto'])
      trust_rate = [0.8,0.2]
      unrolled_net.add(p)
      unrolled_net.addArc(node, evidence)
      unrolled_net.cpt(evidence)[{node: 'nao_domina'}] = trust_rate
      unrolled_net.cpt(evidence)[{node: 'domina'}] = [1-tx, tx]
      # if i != 1:
      #     unrolled_net.erase(f'P {i-1}_{i-1}')
      ie.addEvidence(evidence, 1)
      ie.makeInference()
      # print(node, evidence, tx)
      evidence_prob.append(tx)
      node_count[node_name] += 1
      for node in model.get_nodes(0):
          line.append(i)
          line.append(node[0])
          line.append(ie.posterior(f'{node[0]}_{i}')[1])
          line.append(tx)
          line.append(node_count[node[0]])
          index.append(line)
          line = []
          nodes_prob[node[0]].append(ie.posterior(f'{node[0]}_{i}')[1])

      for node in model.get_nodes(0):
          if node[0] == model.root[0]:
              belief = forgetfulness_rate(nodes_prob[node[0]][i-2], unrolled_net.cpt(f'{node[0]}_{i}')[0][1], nodes_prob[node_name][i-1])
              p_intraslice = [1-filter(belief, i), filter(belief,  i)]
              if i+1 < 20:
                  unrolled_net.cpt(f'{node[0]}_{i+1}')[:] = [p_intraslice,[belief, 1-belief]]
                  print(belief)
              nodes_belief[node[0]].append(belief)
              nodes_trust[node[0]].append(p_intraslice[1])
          elif node[0] == node_name:
              print(nodes_prob[node_name][i-2])
              belief = forgetfulness_rate(nodes_prob[node[0]][i-2], unrolled_net.cpt(f'{node[0]}_{i}')[1][0][1], tx)
              cpt = [[[0.9, 0.1], [0.8, 0.2]], [[1-filter(belief, i), filter(belief,  i)], [belief, 1-belief]]]
              # cpt[0][0] = [1-belief, belief
              # cpt[1][1] = [1-belief, belief]
              unrolled_net.cpt(f'{node[0]}_{i}')[:] = cpt
              nodes_belief[node[0]].append(belief)
              nodes_trust[node[0]].append(filter(belief, i))
          else:
              print(nodes_prob[model.root[0]][i-1])
              belief = forgetfulness_rate(nodes_prob[node[0]][i-2], unrolled_net.cpt(f'{node[0]}_{i}')[1][0][1], nodes_prob[model.root[0]][i-1])
              cpt = [[[0.9, 0.1], [0.8, 0.2]], [[1-filter(belief, i), filter(belief,  i)], [belief, 1-belief]]]
              unrolled_net.cpt(f'{node[0]}_{i}')[:] = cpt            
              nodes_belief[node[0]].append(belief)
              nodes_trust[node[0]].append(filter(belief, i))
      # ie.makeInference()
  return nodes_belief

db = SessionLocal()
insert_student(db, 'Vitor Gabriel', 0)
insert_bayesian_network(db, 0, 'tutor_model', 'T', 0)
insert_bayesian_network(db, 1, 'student_model', 'S', 0)
beliefs = bayes_net([0.9,0.99])
nodes_ids = {node.replace('UP', ''):0 for node in beliefs.keys()}
nodes_parent_id = {node.replace('UP', ''):0 for node in beliefs.keys()}
edges = [edge for edge in model.get_edges() if edge[1][1] == 0]


i=0
for node in beliefs.keys():
   node_name = node.replace('UP', '')
   insert_node(db, i, node_name, 't', 0)
   nodes_ids[node_name] = i
   i += 1
f = 0
for source, target in edges:
    source_name = source[0].replace('UP', '')
    target_name = target[0].replace('UP', '')
    nodes_parent_id[target] = nodes_ids[source_name]
    insert_edge(db, f, 'n', nodes_ids[source_name], nodes_ids[target_name])
    f+=1
for node in beliefs.keys():
  node_name = node.replace('UP', '')
  insert_node_probability(db, beliefs[node][-1], 'domina', 'domina', nodes_ids[node_name], nodes_parent_id[node_name])
beliefs = bayes_net([0.1,0.99])
nodes_ids = {node.replace('UP', ''):0 for node in beliefs.keys()}
nodes_parent_id = {node.replace('UP', ''):0 for node in beliefs.keys()}
for node in beliefs.keys():
   node_name = node.replace('UP', '')
   insert_node(db, i, node_name, 's', 1)
   nodes_ids[node_name] = i
   i += 1
for source, target in edges:
    source_name = source[0].replace('UP', '')
    target_name = target[0].replace('UP', '')
    nodes_parent_id[target] = nodes_ids[source_name]
    insert_edge(db, f, 'n', nodes_ids[source_name], nodes_ids[target_name])
    f+=1
for node in beliefs.keys():
  node_name = node.replace('UP', '')
  insert_node_probability(db, beliefs[node][-1], 'domina', 'domina', nodes_ids[node_name], nodes_parent_id[node_name])
