# Multi-stage Docker build for Java 21 Spring Boot Backend
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build production jar
RUN mvn clean package -DskipTests

# Production Runtime
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy built jar from build stage
COPY --from=build /app/target/food-analyzer-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENV PORT=8080

CMD ["java", "-jar", "app.jar"]
