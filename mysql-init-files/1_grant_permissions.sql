-- Crée l'utilisateur si nécessaire
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'root';

-- Donne tous les privilèges à root@'%'
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;

-- Supprime les limitations
ALTER USER 'root'@'%' REQUIRE NONE
WITH MAX_QUERIES_PER_HOUR 0
     MAX_CONNECTIONS_PER_HOUR 0
     MAX_UPDATES_PER_HOUR 0
     MAX_USER_CONNECTIONS 0;

-- Applique les changements
FLUSH PRIVILEGES;

-- Crée les bases de données si elles n'existent pas
CREATE DATABASE IF NOT EXISTS LinesoftRH;
CREATE DATABASE IF NOT EXISTS LinsoftAuthent;
