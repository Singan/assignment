package com.assignment.john;

import com.assignment.john.domain.Stock;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.reactive.server.WebTestClient;

@SpringBootTest
@AutoConfigureWebTestClient
public class StockControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @Test
    void saveStock_shouldReturnSavedStock() {
        webTestClient.post()
                .uri("/stocks")
                .exchange()
                .expectStatus().isOk()
                .expectBody(Stock.class)
                .consumeWith(response -> {
                    Stock stock = response.getResponseBody();
                    System.out.println("저장된 결과: " + stock);
                });
    }
}