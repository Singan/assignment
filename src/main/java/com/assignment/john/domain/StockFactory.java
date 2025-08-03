package com.assignment.john.domain;

import com.assignment.john.presentation.dto.StockDto;

import java.time.LocalDateTime;

public class StockFactory {

    public static Stock fromDto(StockDto dto) {
        return new Stock(
                dto.name(),
                dto.currentPrice(),
                dto.dividend()
        );
    }

    public static StockDto toDto(Stock stock) {
        return new StockDto(
                stock.getName(),
                stock.getCurrentPrice(),
                stock.getDividend()
        );
    }
}
