package com.assignment.john.config;

import com.assignment.john.domain.Stock;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.config.EnableReactiveMongoAuditing;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.CollectionOptions;
import org.springframework.scheduling.annotation.EnableScheduling;
import reactor.core.publisher.Mono;

@Configuration
@EnableReactiveMongoAuditing
@EnableScheduling
@Slf4j
public class MongoConfig {

}
