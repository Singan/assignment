package com.assignment.john.application;

import com.assignment.john.domain.Stock;
import com.assignment.john.infrastructure.StockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class StockService {

    private final StockRepository stockRepository;

    public Mono<Stock> stockSave(){
        Stock stock = Stock.builder().name("삼성전자").currentPrice(1000).dividend(500).
                build();

        return stockRepository.saveStock(stock);
    }
    public Flux<Stock> streamingStock(String name){

        return Flux.interval(Duration.ofSeconds(1))
                .flatMap(stock -> stockRepository.findByNameFirst(name));
    }

}
