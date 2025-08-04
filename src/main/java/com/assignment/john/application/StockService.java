package com.assignment.john.application;

import com.assignment.john.config.SinkProcessor;
import com.assignment.john.domain.Stock;
import com.assignment.john.infrastructure.StockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class StockService {

    private final StockRepository stockRepository;
    private final SinkProcessor sinkProcessor;

    public Mono<Stock> stockSave(Stock stock) {
        return stockRepository.saveStock(stock)
                .doOnNext(sinkProcessor::stockPush); // 저장 후 푸시
    }
    public Flux<ServerSentEvent<Stock>> streamingStock(String name) {

        return sinkProcessor.stockFlux(name);
    }

}
