BEGIN;

DROP TABLE IF EXISTS public."Questions" CASCADE;
DROP TABLE IF EXISTS public."Estatisticas" CASCADE;

-- Criação da tabela de perguntas
CREATE TABLE public."Questions" (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    "correctAnswer" VARCHAR(255) NOT NULL,
    options JSONB NOT NULL,
    difficulty INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de estatísticas
CREATE TABLE public."Estatisticas" (
    id SERIAL PRIMARY KEY,
    "totalRespondidas" INTEGER DEFAULT 0,
    acertos INTEGER DEFAULT 0,
    erros INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhorar a performance
CREATE INDEX idx_questions_difficulty ON "Questions"(difficulty);

-- Trigger para atualizar o updatedAt automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicando o trigger em todas as tabelas
CREATE TRIGGER update_questions_updated_at
    BEFORE UPDATE ON "Questions"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_estatisticas_updated_at
    BEFORE UPDATE ON "Estatisticas"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Inserindo perguntas iniciais
INSERT INTO public."Questions" (question, "correctAnswer", options, difficulty) VALUES
('Qual é a capital do Brasil?', 'Brasília', '["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"]', 1),
('Qual é o maior planeta do sistema solar?', 'Júpiter', '["Saturno", "Júpiter", "Netuno", "Urano"]', 2),
('Qual é a fórmula da água?', 'H2O', '["CO2", "H2O", "O2"]', 1),
('Qual é o símbolo químico do ouro?', 'Au', '["Ag", "Au", "Gd"]', 1),
('Quantos graus tem um ângulo reto?', '90', '["45", "90", "180"]', 1),
('Qual o maior oceano do mundo?', 'Pacífico', '["Atlântico", "Pacífico", "Índico"]', 1),
('Qual a montanha mais alta do mundo?', 'Everest', '["Everest", "Aconcágua", "K2"]', 1),
('Em que ano o homem pisou na Lua pela primeira vez?', '1969', '["1959", "1969", "1975"]', 2),
('Quem escreveu "Dom Casmurro"?', 'Machado de Assis', '["Machado de Assis", "José de Alencar", "Clarice Lispector"]', 2),
('Qual é o idioma oficial da Austrália?', 'Inglês', '["Inglês", "Francês", "Alemão"]', 1),
('Qual é o maior animal terrestre?', 'Elefante Africano', '["Girafa", "Elefante Africano", "Rinoceronte", "Hipopótamo"]', 1),
('Em que ano foi fundada a cidade de São Paulo?', '1554', '["1500", "1554", "1600", "1650"]', 3),
('Qual é o elemento químico mais abundante no universo?', 'Hidrogênio', '["Oxigênio", "Hidrogênio", "Hélio", "Carbono"]', 2),
('Quem pintou a Mona Lisa?', 'Leonardo da Vinci', '["Michelangelo", "Leonardo da Vinci", "Rafael", "Donatello"]', 1),
('Qual é o país com maior número de ilhas?', 'Suécia', '["Indonésia", "Filipinas", "Suécia", "Japão"]', 3),
('Qual é o maior deserto do mundo?', 'Antártida', '["Saara", "Antártida", "Gobi", "Atacama"]', 2),
('Em que ano foi a primeira Copa do Mundo de Futebol?', '1930', '["1920", "1930", "1940", "1950"]', 2),
('Qual é o maior osso do corpo humano?', 'Fêmur', '["Fêmur", "Tíbia", "Úmero", "Rádio"]', 1),
('Quem foi o primeiro presidente do Brasil?', 'Deodoro da Fonseca', '["Prudente de Morais", "Deodoro da Fonseca", "Floriano Peixoto", "Campos Sales"]', 2),
('Qual é o maior mamífero marinho?', 'Baleia-azul', '["Tubarão-baleia", "Baleia-azul", "Orca", "Elefante-marinho"]', 1),
('Em que ano foi a independência do Brasil?', '1822', '["1808", "1822", "1889", "1891"]', 1),
('Qual é o país com maior número de vulcões ativos?', 'Indonésia', '["Japão", "Indonésia", "Itália", "Islândia"]', 2),
('Quem escreveu "Os Lusíadas"?', 'Luís de Camões', '["Fernando Pessoa", "Luís de Camões", "Eça de Queirós", "Almeida Garrett"]', 2),
('Qual é o maior lago de água doce do mundo?', 'Lago Superior', '["Lago Vitória", "Lago Superior", "Lago Baikal", "Mar Cáspio"]', 3),
('Em que ano foi a primeira edição dos Jogos Olímpicos modernos?', '1896', '["1886", "1896", "1906", "1916"]', 2);

-- Inserindo estatísticas iniciais
INSERT INTO public."Estatisticas" ("totalRespondidas", acertos, erros) VALUES
(0, 0, 0);

COMMIT; 