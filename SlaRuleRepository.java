package com.smartcomplaint.repository;

import com.smartcomplaint.entity.SlaRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SlaRuleRepository extends JpaRepository<SlaRule, Long> {
    Optional<SlaRule> findByPriority(SlaRule.Priority priority);
}
