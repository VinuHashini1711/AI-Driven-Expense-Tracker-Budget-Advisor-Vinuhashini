package com.example.finance.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne
	@JoinColumn(name = "user_id", nullable = false, unique = true)
	private User user;

	@Column(precision = 19, scale = 2)
	private BigDecimal monthlyIncome;

	@Column(precision = 19, scale = 2)
	private BigDecimal monthlySavingsTarget;

	@Column(precision = 19, scale = 2)
	private BigDecimal monthlyExpenseTarget;
}


