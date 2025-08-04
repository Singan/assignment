package com.assignment.john;

import com.assignment.john.application.StockService;
import com.assignment.john.domain.Stock;
import com.assignment.john.infrastructure.StockRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

import java.time.Duration;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Profile("dev")
@Slf4j
public class StockInitializer {

    private final StockService stockService;

    private final Random random = new Random();

    private final String[] names = {"SK", "삼성전자", "LG"};
    @Scheduled(fixedRate = 10000)
    public void saveRandomStocks() {
        for (String name : names) {
            int currentPrice = 500 + random.nextInt(500);
            int dividend = 100 + random.nextInt(400);

            Stock stock = Stock.builder()
                    .name(name)
                    .currentPrice(currentPrice)
                    .dividend(dividend)
                    .build();
            log.info("stock 스케쥴러 : {}" , stock);
            stockService.stockSave(stock).subscribe();
        }
    }
}