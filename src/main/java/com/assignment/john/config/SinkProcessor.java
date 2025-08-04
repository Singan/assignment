package com.assignment.john.config;

import com.assignment.john.domain.Stock;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SinkProcessor {


    private final Map<String, Sinks.Many<ServerSentEvent<Stock>>> sinksMap = new ConcurrentHashMap<>();


    public void stockPush(Stock stock) {
        sinksMap.computeIfAbsent(stock.getName(), s -> Sinks.many().multicast().onBackpressureBuffer())
                .tryEmitNext(
                ServerSentEvent.<Stock>builder()
                        .id(stock.getId())
                        .data(stock)
                        .build()
        );
    }

    public Flux<ServerSentEvent<Stock>> stockFlux(String name){
        return sinksMap.computeIfAbsent(name, s -> Sinks.many().multicast().onBackpressureBuffer()).asFlux();
    }

}
