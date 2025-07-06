-- Supprime les anciens privilèges (optionnel)
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'root'@'%';

-- Applique tous les droits au root depuis toutes les IPs
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'root' WITH GRANT OPTION;

-- Supprime toutes les limites de ressource et contraintes SSL
ALTER USER 'root'@'%' REQUIRE NONE
WITH MAX_QUERIES_PER_HOUR 0
     MAX_CONNECTIONS_PER_HOUR 0
     MAX_UPDATES_PER_HOUR 0
     MAX_USER_CONNECTIONS 0;

-- Appliquer les changements
FLUSH PRIVILEGES;
