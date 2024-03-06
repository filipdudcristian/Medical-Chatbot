package com.utcn.doctorulvirtual.repositories;
import com.utcn.doctorulvirtual.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
}
