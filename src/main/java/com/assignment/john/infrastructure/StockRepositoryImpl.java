package com.assignment.john.infrastructure;

import com.assignment.john.domain.Stock;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
@Repository
@RequiredArgsConstructor
public class StockRepositoryImpl implements StockRepository {

    private final StockMongoRepository mongoRepository;

    @Override
    public Mono<Stock> saveStock(Stock stock) {
        return mongoRepository.save(stock);
    }

    @Override
    public Flux<Stock> findByNameFirst(String name) {
        return mongoRepository.findFirstByNameOrderByCreatedAtDesc(name);
    }
}
