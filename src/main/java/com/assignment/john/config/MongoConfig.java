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
@RequiredArgsConstructor
@Slf4j
public class MongoConfig {

    private final ReactiveMongoTemplate mongoTemplate;

    @PostConstruct
    public void initializeDatabase() {
        // Stock 컬렉션을 Capped Collection으로 생성
        // @Tailable이 작동하려면 Capped Collection이 필요
        createCappedCollectionIfNotExists("stock", Stock.class)
                .doOnSuccess(created -> {
                    if (created) {
                        log.info("Stock Capped Collection 생성 완료 - WebFlux @Tailable 스트리밍 준비됨");
                    } else {
                        log.info("Stock Capped Collection 이미 존재함");
                    }
                })
                .doOnError(error -> log.error("Stock Capped Collection 생성 실패", error))
                .subscribe();
    }

    private Mono<Boolean> createCappedCollectionIfNotExists(String collectionName, Class<?> entityClass) {
        return mongoTemplate.collectionExists(collectionName)
                .flatMap(exists -> {
                    if (!exists) {
                        // Capped Collection 옵션 설정
                        // 최대 1000개 문서, 최대 1MB 크기
                        CollectionOptions options = CollectionOptions.empty()
                                .capped()
                                .size(1024 * 1024) // 1MB
                                .maxDocuments(1000);
                        
                        return mongoTemplate.createCollection(collectionName, options)
                                .then(Mono.just(true));
                    }
                    return Mono.just(false);
                });
    }
}
