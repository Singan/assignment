package com.assignment.john.presentation;

import com.assignment.john.application.StockService;
import com.assignment.john.domain.Stock;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/stocks")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;


    @GetMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Stock> streamStock(@RequestParam("name") String name){

        return stockService.streamingStock(name);
    }

    @PostMapping
    public Mono<Stock> saveStock() {
        return stockService.stockSave();
    }
}
