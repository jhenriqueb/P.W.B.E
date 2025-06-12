-- Arquivo para armazenar consultas SQL específicas do projeto
-- Aqui você pode adicionar queries complexas ou frequentemente utilizadas 

-- Buscar uma pergunta aleatória
SELECT * FROM "Questions" ORDER BY RANDOM() LIMIT 1;

-- Buscar todas as perguntas ordenadas por dificuldade
SELECT * FROM "Questions" ORDER BY difficulty;

-- Buscar estatísticas atuais
SELECT * FROM "Estatisticas" ORDER BY id DESC LIMIT 1;

-- Atualizar estatísticas após uma resposta
UPDATE "Estatisticas"
SET 
    "totalRespondidas" = "totalRespondidas" + 1,
    acertos = acertos + CASE WHEN $1 THEN 1 ELSE 0 END,
    erros = erros + CASE WHEN NOT $1 THEN 1 ELSE 0 END
WHERE id = (SELECT id FROM "Estatisticas" ORDER BY id DESC LIMIT 1);

-- Buscar perguntas por dificuldade
SELECT * FROM "Questions" WHERE difficulty = $1;

-- Verificar resposta correta
SELECT 
    CASE 
        WHEN "correctAnswer" = $1 THEN true 
        ELSE false 
    END as is_correct
FROM "Questions"
WHERE id = $2; 