package com.assignment.john.infrastructure;

import com.assignment.john.domain.Stock;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface StockRepository {

    Mono<Stock> saveStock(Stock stock);


    Flux<Stock> findByNameFirst(String name);
}
