# Étape 1 : build avec Maven
FROM maven:3.9.6-eclipse-temurin-17 AS builder

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers Maven
COPY pom.xml ./
COPY src ./src

# Compiler le projet (et packager le jar)
RUN mvn clean package -DskipTests

# Étape 2 : image minimale avec OpenJDK
FROM openjdk:17-jdk-alpine

# Copier le jar généré depuis le builder
COPY --from=builder /app/target/*.jar app.jar

# Point d'entrée
ENTRYPOINT ["java", "-jar", "/app.jar"]
