-- Crée l'utilisateur si besoin
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'root';

-- Donne tous les privilèges nécessaires
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;

-- Supprime les limitations
ALTER USER 'root'@'%' REQUIRE NONE
WITH MAX_QUERIES_PER_HOUR 0
     MAX_CONNECTIONS_PER_HOUR 0
     MAX_UPDATES_PER_HOUR 0
     MAX_USER_CONNECTIONS 0;

-- Applique les changements
FLUSH PRIVILEGES;

-- Crée les bases
CREATE DATABASE IF NOT EXISTS LinesoftRH;
CREATE DATABASE IF NOT EXISTS LinsoftAuthent;
