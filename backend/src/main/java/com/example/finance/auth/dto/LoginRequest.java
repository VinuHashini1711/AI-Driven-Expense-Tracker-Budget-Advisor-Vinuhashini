package com.example.finance.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
		@NotBlank String usernameOrEmail,
		@NotBlank String password
) {}


