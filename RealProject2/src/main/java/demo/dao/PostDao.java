package demo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import demo.model.PostModel;
import demo.model.UserModel;

public interface PostDao extends JpaRepository<PostModel, Integer> {
	
	public PostModel findByPostId(int postId);
	
	public UserModel findUserIdByPostId(int postId);
	
	public List<PostModel> findAllByMyOwner(UserModel myOwner);


}
