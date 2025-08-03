package com.assignment.john.infrastructure;

import com.assignment.john.domain.Stock;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

public interface StockMongoRepository extends ReactiveMongoRepository<Stock , String> {


    Flux<Stock> findFirstByNameOrderByCreatedAtDesc(String name);
}
