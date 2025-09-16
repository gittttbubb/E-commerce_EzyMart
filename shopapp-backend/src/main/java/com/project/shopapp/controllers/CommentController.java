package com.project.shopapp.controllers;
import com.github.javafaker.Faker;
import com.project.shopapp.components.SecurityUtils;
import com.project.shopapp.dtos.*;
import com.project.shopapp.models.Category;
import com.project.shopapp.models.Comment;
import com.project.shopapp.models.Product;
import com.project.shopapp.models.User;
import com.project.shopapp.repositories.CommentRepository;
import com.project.shopapp.responses.ResponseObject;
import com.project.shopapp.responses.comment.CommentResponse;
import com.project.shopapp.services.comment.CommentService;
import com.project.shopapp.services.product.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("${api.prefix}/comments")
//@Validated
//Dependency Injection
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;
    private final SecurityUtils securityUtils;
    private final CommentRepository commentRepository;

    @GetMapping("")
    public ResponseEntity<ResponseObject> getAllComments(
            @RequestParam(value = "user_id", required = false) Long userId,
            @RequestParam("product_id") Long productId
    ) {
        List<CommentResponse> commentResponses;
        if (userId == null) {
            commentResponses = commentService.getCommentsByProduct(productId);
        } else {
            commentResponses = commentService.getCommentsByUserAndProduct(userId, productId);
        }
        return ResponseEntity.ok().body(ResponseObject.builder()
                .message("Get comments successfully")
                .status(HttpStatus.OK)
                .data(commentResponses)
                .build());
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<ResponseObject> updateComment(
            @PathVariable("id") Long commentId,
            @Valid @RequestBody CommentDTO commentDTO
    ) throws Exception {
        User loginUser = securityUtils.getLoggedInUser();
        if (!Objects.equals(loginUser.getId(), commentDTO.getUserId())) {
            return ResponseEntity.badRequest().body(
                    new ResponseObject(
                            "You cannot update another user's comment",
                            HttpStatus.BAD_REQUEST,
                            null));

        }
        commentService.updateComment(commentId, commentDTO);
        return ResponseEntity.ok(
                new ResponseObject(
                        "Update comment successfully",
                        HttpStatus.OK, null));
    }
    @PostMapping("")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<ResponseObject> insertComment(
            @Valid @RequestBody CommentDTO commentDTO
    ) {
        // Insert the new comment
        User loginUser = securityUtils.getLoggedInUser();
        if(loginUser.getId() != commentDTO.getUserId()) {
            return ResponseEntity.badRequest().body(
                    new ResponseObject(
                            "You cannot comment as another user",
                            HttpStatus.BAD_REQUEST,
                            null));
        }
        commentService.insertComment(commentDTO);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .message("Insert comment successfully")
                        .status(HttpStatus.OK)
                        .build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<ResponseObject> deleteComment(@PathVariable("id") Long id) throws Exception {
        User loginUser = securityUtils.getLoggedInUser();
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ChangeSetPersister.NotFoundException());
        // Nếu không phải admin thì phải là chủ comment mới được xóa
        if (!loginUser.getRole().getName().equals("ROLE_ADMIN") &&
                !comment.getUser().getId().equals(loginUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    new ResponseObject(
                            "You cannot delete another user's comment",
                            HttpStatus.FORBIDDEN,
                            null
                    )
            );
        }
        commentService.deleteComment(id);
        return ResponseEntity.ok(
                new ResponseObject(
                        "Delete comment successfully",
                        HttpStatus.OK,
                        null
                )
        );
    }

    @PostMapping("/generateFakeComments")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseObject> generateFakeComments() throws Exception {
        commentService.generateFakeComments();
        return ResponseEntity.ok(ResponseObject.builder()
                .message("Insert fake comments succcessfully")
                .data(null)
                .status(HttpStatus.OK)
                .build());
    }
}
