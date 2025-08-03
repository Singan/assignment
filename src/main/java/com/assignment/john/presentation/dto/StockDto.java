package com.assignment.john.presentation.dto;
public record StockDto(
        String name,            // 종목명
        int currentPrice,       // 현재가 (원 단위)
        int dividend           // 연간 배당금 (원)
) {}

