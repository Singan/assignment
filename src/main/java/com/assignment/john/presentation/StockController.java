package com.assignment.john.presentation;

import com.assignment.john.application.StockService;
import com.assignment.john.domain.Stock;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/stocks")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;
    

    @PostMapping
    public Mono<Stock> saveStock() {
        return stockService.stockSave();
    }
}
