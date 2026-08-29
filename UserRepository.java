package com.smartcomplaint.repository;

import com.smartcomplaint.entity.User;
import com.smartcomplaint.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(User.Role role);
    List<User> findByDepartmentAndAvailableTrue(Department department);
    List<User> findByDepartment(Department department);
}
