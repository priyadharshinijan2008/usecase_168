package com.smartcomplaint.repository;

import com.smartcomplaint.entity.Complaint;
import com.smartcomplaint.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    Optional<Complaint> findByTicketNumber(String ticketNumber);
    List<Complaint> findByCustomerEmail(String customerEmail);
    List<Complaint> findByAssignedAgent(User agent);
    List<Complaint> findByStatus(Complaint.Status status);

    long countByStatus(Complaint.Status status);
    long countBySlaBreachedTrue();
    long countByEscalatedTrue();

    @Query("SELECT c.assignedAgent.id, COUNT(c) FROM Complaint c WHERE c.status IN ('NEW', 'ASSIGNED', 'IN_PROGRESS') AND c.assignedAgent IS NOT NULL GROUP BY c.assignedAgent.id")
    List<Object[]> findActiveWorkloadPerAgent();

    List<Complaint> findBySlaDeadlineBeforeAndStatusNotIn(LocalDateTime now, List<Complaint.Status> statuses);

    @Query("SELECT c FROM Complaint c WHERE c.status NOT IN ('RESOLVED', 'CLOSED') AND c.slaBreached = false AND c.slaDeadline IS NOT NULL")
    List<Complaint> findOpenTicketsForSlaMonitoring();
}
