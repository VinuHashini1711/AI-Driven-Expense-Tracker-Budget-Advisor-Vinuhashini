package com.example.finance.profile;

import com.example.finance.model.User;
import com.example.finance.model.UserProfile;
import com.example.finance.repository.UserProfileRepository;
import com.example.finance.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Optional;

record ProfileRequest(BigDecimal monthlyIncome, BigDecimal monthlySavingsTarget, BigDecimal monthlyExpenseTarget) {}

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

	private final UserProfileRepository userProfileRepository;
	private final UserRepository userRepository;

	public ProfileController(UserProfileRepository userProfileRepository, UserRepository userRepository) {
		this.userProfileRepository = userProfileRepository;
		this.userRepository = userRepository;
	}

	@GetMapping
	public ResponseEntity<UserProfile> getProfile(@AuthenticationPrincipal UserDetails principal) {
		Optional<User> userOpt = userRepository.findByUsername(principal.getUsername());
		if (userOpt.isEmpty()) return ResponseEntity.notFound().build();
		return userProfileRepository.findByUserId(userOpt.get().getId())
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.ok().build());
	}

	@PutMapping
	public ResponseEntity<UserProfile> upsertProfile(@AuthenticationPrincipal UserDetails principal,
													   @Valid @RequestBody ProfileRequest request) {
		User user = userRepository.findByUsername(principal.getUsername()).orElseThrow();
		UserProfile profile = userProfileRepository.findByUserId(user.getId()).orElseGet(() -> {
			UserProfile p = new UserProfile();
			p.setUser(user);
			return p;
		});
		profile.setMonthlyIncome(request.monthlyIncome());
		profile.setMonthlySavingsTarget(request.monthlySavingsTarget());
		profile.setMonthlyExpenseTarget(request.monthlyExpenseTarget());
		UserProfile saved = userProfileRepository.save(profile);
		return ResponseEntity.ok(saved);
	}
}


