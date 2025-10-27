package com.example.finance.auth;

import com.example.finance.auth.dto.AuthResponse;
import com.example.finance.auth.dto.LoginRequest;
import com.example.finance.auth.dto.RegisterRequest;
import com.example.finance.model.Role;
import com.example.finance.model.User;
import com.example.finance.repository.RoleRepository;
import com.example.finance.repository.UserRepository;
import com.example.finance.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthenticationManager authenticationManager;
	private final JwtService jwtService;
	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final PasswordEncoder passwordEncoder;

	public AuthController(AuthenticationManager authenticationManager, JwtService jwtService, UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
		this.authenticationManager = authenticationManager;
		this.jwtService = jwtService;
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
		UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
				request.usernameOrEmail(), request.password());
		var authentication = authenticationManager.authenticate(authToken);
		// Use the authenticated principal's username to ensure the token subject
		// always matches the user's username (avoids mismatch when logging in with email)
		String username = authentication.getName();
		String token = jwtService.generateToken(username, Map.of());
		return ResponseEntity.ok(new AuthResponse(token));
	}

	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
		if (userRepository.existsByUsername(request.username()) || userRepository.existsByEmail(request.email())) {
			return ResponseEntity.badRequest().build();
		}
		Role userRole = roleRepository.findByName("ROLE_USER").orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_USER").build()));
		User user = User.builder()
				.username(request.username())
				.email(request.email())
				.passwordHash(passwordEncoder.encode(request.password()))
				.roles(Set.of(userRole))
				.build();
		userRepository.save(user);
		String token = jwtService.generateToken(user.getUsername(), Map.of());
		return ResponseEntity.ok(new AuthResponse(token));
	}
}


