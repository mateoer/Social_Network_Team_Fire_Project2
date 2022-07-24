package demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import demo.model.UserModel;

public interface UserDao extends JpaRepository<UserModel, Integer> {
	
	public UserModel findByUsername(String username);
	
	public UserModel findByUserEmail(String userEmail);
	
	

}
