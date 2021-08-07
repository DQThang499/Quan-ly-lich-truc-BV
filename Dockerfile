FROM openjdk:8-jdk-alpine
VOLUME /tmp
COPY ./target/*.jar app.jar
EXPOSE 9090
ENTRYPOINT ["java", "-jar", "/app.jar", "--spring.profiles.active=docker"]
