package com.example.finance.config;

import com.example.finance.model.Role;
import com.example.finance.model.User;
import com.example.finance.repository.RoleRepository;
import com.example.finance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

	@Bean
	CommandLineRunner seedData(RoleRepository roleRepository,
			UserRepository userRepository,
			PasswordEncoder passwordEncoder) {
		return args -> {
			Role userRole = roleRepository.findByName("ROLE_USER")
					.orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_USER").build()));
			Role adminRole = roleRepository.findByName("ROLE_ADMIN")
					.orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_ADMIN").build()));

			if (userRepository.findByUsername("admin").isEmpty()) {
				User admin = User.builder()
						.username("admin")
						.email("admin@example.com")
						.passwordHash(passwordEncoder.encode("admin123"))
						.roles(Set.of(userRole, adminRole))
						.build();
				userRepository.save(admin);
			}
		};
	}
}


