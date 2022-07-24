package demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import demo.model.CommentModel;

public interface CommentDao extends JpaRepository<CommentModel, Integer> {

}
