package com.assignment.john.infrastructure;

import com.assignment.john.domain.Stock;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Tailable;
import reactor.core.publisher.Flux;

public interface StockMongoRepository extends ReactiveMongoRepository<Stock , String> {

    @Tailable
    @Query("{ 'name': ?0 }")
    Flux<Stock> findByName(String name);
}
