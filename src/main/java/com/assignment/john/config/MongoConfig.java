package com.assignment.john.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.config.EnableReactiveMongoAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableReactiveMongoAuditing
@EnableScheduling
public class MongoConfig {
}
