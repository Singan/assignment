package com.assignment.john.infrastructure;

import com.assignment.john.domain.Stock;
import reactor.core.publisher.Mono;

public interface StockRepository {

    Mono<Stock> saveStock(Stock stock);


    Mono<Stock> findByNameFirst(String name);
}
