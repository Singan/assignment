package com.assignment.john.domain;

import com.assignment.john.presentation.dto.StockDto;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Document(collection = "stocks")
public class Stock {

    @Id
    private String id;                 // MongoDB ObjectId (자동 생성)

    private String name;              // 종목명
    private int currentPrice;         // 현재가 (원)
    private int dividend;             // 배당금 (원)
    @CreatedDate
    private LocalDateTime createdAt;  // 데이터 갱신 시각


    @Builder
    public Stock(String name, int currentPrice, int dividend) {
        this.name = name;
        this.currentPrice = currentPrice;
        this.dividend = dividend;
    }


}
