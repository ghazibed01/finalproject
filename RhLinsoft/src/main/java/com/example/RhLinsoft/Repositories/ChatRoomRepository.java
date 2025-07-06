package com.example.RhLinsoft.Repositories;

import com.example.RhLinsoft.Entities.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> {

    Optional<ChatRoom> findBySenderIdAndRecipientId(Integer senderId, Integer recipientId);
}



