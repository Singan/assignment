package com.assignment.john.infrastructure;

import com.assignment.john.domain.Stock;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Mono;

public interface StockMongoRepository extends ReactiveMongoRepository<Stock , String> {


    Mono<Stock> findFirstByNameOrderByCreatedAtDesc(String name);
}
