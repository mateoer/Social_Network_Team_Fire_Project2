package demo.controller;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import demo.dao.CommentDao;
import demo.dao.PostDao;
import demo.dao.UserDao;
import demo.model.CommentModel;
import demo.model.PostModel;
import demo.model.UserModel;
import demo.util.ProfanityFilter;
import demo.util.StorageService;

@RestController
@CrossOrigin(origins = "http://54.147.157.227:9001/")
public class PostController {

	// FIELDS\\
	private UserDao userDao;
	private PostDao postDao;
	private CommentDao commentDao;

	@Autowired
	private StorageService storageServ;

	@Autowired
	private ProfanityFilter pFilter;

	// CONSTRUCTORS\\
	@Autowired
	public PostController(UserDao userDao, PostDao postDao, CommentDao commentDao) {
		super();
		this.userDao = userDao;
		this.postDao = postDao;
		this.commentDao = commentDao;
	}

	public PostController(UserDao userDao, PostDao postDao, CommentDao commentDao, StorageService storageServ,
			ProfanityFilter pFilter) {
		super();
		this.userDao = userDao;
		this.postDao = postDao;
		this.commentDao = commentDao;
		this.storageServ = storageServ;
		this.pFilter = pFilter;
	}



	// ENDPOINTS\\

	// DB ACCESS\\
	/**
	 * 
	 * @param postModel
	 * @param session
	 * @return
	 */
	@PostMapping("/post")
	public PostModel postToDataBase(@RequestBody PostModel postModel, HttpSession session) {
		System.out.println("In the /Post");
		UserModel currentUser = (UserModel) session.getAttribute("loggedUser");
		if (currentUser != null) {

			// PROFANITY FILTER
			postModel.setReviewItem(pFilter.getCleanContent(postModel.getReviewItem()));
			postModel.setPostContent(pFilter.getCleanContent(postModel.getPostContent()));

			// PostgreSQL DB actions
			postModel.setSubmitTime(new Timestamp(System.currentTimeMillis()));
			postModel.setMyOwner(currentUser);
			return postDao.save(postModel);
			
		}

		return null;
	}

	/**
	 * 
	 * @param file
	 * @return returns a URL that will last for 24 hours.
	 * @throws IOException
	 */
	@PostMapping("/post/photo/{id}")
	public PostModel postPhotoToDataBase(HttpSession session, @RequestParam(value = "file") MultipartFile file, @PathVariable("id") int postId) throws IOException {
		System.out.println("In the /Post/photo");
		UserModel currentUser = (UserModel) session.getAttribute("loggedUser");
		if (currentUser != null) {
			PostModel postModel = postDao.findByPostId(postId);
			String newFileName = storageServ.uploadAWSFile(file);
			postModel.setPictureURL(newFileName);

			postModel.setMyOwner(currentUser);
			postModel.setSubmitTime(new Timestamp(System.currentTimeMillis()));
			return postDao.save(postModel);

		}
		return null;

	}
	
	@PostMapping("/get/postownerpic/{id}")
	public String getpostOwnerPic(HttpSession session, @PathVariable("id") int postId) {
		
		UserModel currentUser = (UserModel) session.getAttribute("loggedUser");
		if (currentUser != null) {
			PostModel tempPost = postDao.findByPostId(postId);
			return tempPost.getMyOwner().getUsername() + "|" + tempPost.getMyOwner().getProfilePicName();
		}
		return null;
	}

	@PostMapping("/getall/posts")
	public List<PostModel> getAllPosts(HttpSession session) {
		
		UserModel currentUser = (UserModel) session.getAttribute("loggedUser");
		if (currentUser != null) {
			return postDao.findAll();
		}
		return null;
	}
	
	@PostMapping("/getall/userposts/{username}")
	public List<PostModel> getAllPostsByUser(HttpSession session, @PathVariable("username") String username) {
		
		UserModel currentUser = (UserModel) session.getAttribute("loggedUser");
		if (currentUser != null) {
			UserModel tempUser = userDao.findByUsername(username);
			
			return postDao.findAllByMyOwner(tempUser);
		}
		return null;
	}
	
	@PostMapping("/post/{id}/comment")
	public boolean postCommentToDataBase(HttpSession session, @PathVariable("id") String postStr, CommentModel comModel) {
		UserModel currentUser = (UserModel) session.getAttribute("loggedUser");
		int postId = Integer.parseInt(postStr);
		if (currentUser != null) {

			// PROFANITY FILTER
			comModel.setCommentContent(pFilter.getCleanContent(comModel.getCommentContent()));

			PostModel tempPost = postDao.findByPostId(postId);
			tempPost.getCommentList().add(comModel);
			postDao.save(tempPost);
			return true;
		}
		return false;
	}

	@PostMapping("/post/{id}/like")
	public boolean postLikeToDataBase(HttpSession session, @PathVariable("id") int postId) {
		UserModel currentUser = (UserModel) session.getAttribute("loggedUser");
		if (currentUser != null) {
			PostModel tempPost = postDao.findByPostId(postId);
			tempPost.getUserLikesList().add(currentUser);
			postDao.save(tempPost);
			return true;

		}

		return false;
	}

}
