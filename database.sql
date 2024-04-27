-- Criação do banco de dados 'dnd'
CREATE DATABASE dnd;
USE dnd;

-- Criação da tabela 'classe'
CREATE TABLE classe (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  descricao VARCHAR(1000) NOT NULL,
  PRIMARY KEY (id)
);

-- Criação da tabela 'habilidade'
CREATE TABLE habilidade (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  descricao VARCHAR(1000) NOT NULL,
  PRIMARY KEY (id)
);

-- Criação da tabela 'raca'
CREATE TABLE raca (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  descricao VARCHAR(1000) NOT NULL,
  PRIMARY KEY (id)
);

-- Criação da tabela 'personagens'
CREATE TABLE personagens (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  classe_id INT NOT NULL,
  raca_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (classe_id) REFERENCES classe(id),
  FOREIGN KEY (raca_id) REFERENCES raca(id)
);

-- Criação da tabela 'personagem_habilidade'
CREATE TABLE personagem_habilidade (
  id INT NOT NULL AUTO_INCREMENT,
  personagem_id INT NOT NULL,
  habilidade_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (personagem_id) REFERENCES personagens(id),
  FOREIGN KEY (habilidade_id) REFERENCES habilidade(id)
);

-- Inserção de dados na tabela 'classe'
INSERT INTO classe (nome, descricao) VALUES
('Guerreiro', 'Classe focada em combate físico e armaduras pesadas.'),
('Mago', 'Classe especializada em magia e feitiços.'),
('Arqueiro', 'Classe que utiliza arcos e habilidades de longo alcance.');

-- Inserção de dados na tabela 'habilidade'
INSERT INTO habilidade (nome, descricao) VALUES
('Espada Flamejante', 'Ataque com espada que causa dano de fogo.'),
('Bola de Fogo', 'Lança uma poderosa esfera de fogo que explode ao atingir o alvo.'),
('Flecha de Gelo', 'Dispara uma flecha congelante que pode paralisar o inimigo.');

-- Inserção de dados na tabela 'raca'
INSERT INTO raca (nome, descricao) VALUES
('Humano', 'Raça versátil com capacidades equilibradas.'),
('Elfo', 'Raça ágil com afinidades mágicas.'),
('Orc', 'Raça forte e resistente, ideal para combate corpo a corpo.');

-- Inserção de dados na tabela 'personagens'
INSERT INTO personagens (nome, classe_id, raca_id) VALUES
('Aragorn', 1, 1),  -- Guerreiro Humano
('Gandalf', 2, 1),  -- Mago Humano
('Legolas', 3, 2);  -- Arqueiro Elfo

-- Inserção de dados na tabela 'personagem_habilidade'
INSERT INTO personagem_habilidade (personagem_id, habilidade_id) VALUES
(1, 1),  -- Aragorn com Espada Flamejante
(2, 2),  -- Gandalf com Bola de Fogo
(3, 3);  -- Legolas com Flecha de Gelo
