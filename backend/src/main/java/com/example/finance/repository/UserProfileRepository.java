package com.example.finance.repository;

import com.example.finance.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
	Optional<UserProfile> findByUserId(Long userId);
}


