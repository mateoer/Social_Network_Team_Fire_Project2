package demo.controller;

import java.io.IOException;
import java.sql.Timestamp;

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
import demo.model.UserModel;
import demo.model.UserModel.UserType;
import demo.util.ProfanityFilter;
import demo.util.StorageService;

@RestController
@CrossOrigin(origins = "http://54.147.157.227:9001/")
public class UserController {

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
	public UserController(UserDao userDao, PostDao postDao, CommentDao commentDao) {
		super();
		this.userDao = userDao;
		this.postDao = postDao;
		this.commentDao = commentDao;
	}

	// ENDPOINTS\\

	// DB ACCESSING\\

	/**
	 * This sends the user info to the helper method that checks to make sure the
	 * login was accurate and then sets the "loggedUser" attr in the session. The
	 * user is then sent to the home.html.
	 * 
	 * @author CalebJGulledge
	 * @param session
	 * @param reqUser
	 * @return
	 */
	@PostMapping("/l-authentication")
	public String loginToHomePage(HttpSession session, @RequestBody UserModel reqUser) {
		System.out.println("In the user/login controller");

		UserModel dbUser = loginAuthentication(reqUser);
		if (dbUser == null) {
			return "/login";
		}
		session.setAttribute("loggedUser", dbUser);

		return "/home";
	}

	/**
	 * Takes in all of the registration information from the user. It sets the
	 * default values to the UserModel, before sending it to the DB. What the DB
	 * returns is set to the "loggedUser" in the session. The user is then sent to
	 * the home.html page.
	 * 
	 * @author CalebJGulledge
	 * @param session
	 * @param reqUser
	 * @return Path to Home
	 */
	@PostMapping("/r-authentication")
	public String registerToHomePage(HttpSession session, @RequestBody UserModel reqUser) {
		System.out.println("In the user/register controller");

		// PROFANITY FILTER
		reqUser.setFirstName(pFilter.getCleanContent(reqUser.getFirstName()));
		reqUser.setLastName(pFilter.getCleanContent(reqUser.getLastName()));

		UserModel dbCheck = loginAuthentication(reqUser);
		if (dbCheck != null) {
			return "/login";
		}

		reqUser.setUserType(UserType.General);
		reqUser.setCreationDate(new Timestamp(System.currentTimeMillis()));
		UserModel newUser = userDao.save(reqUser);

		session.setAttribute("loggedUser", newUser);

		return "/home";
	}

	/**
	 * Checks that user is logged in and then returns the requested User
	 * 
	 * @author CalebJGulledge
	 * @param username
	 * @return Gets the requested UserModel from the DB
	 */
	@PostMapping("/get/profile/{username}")
	public UserModel pathUserProfile(@PathVariable("username") String username) {
		UserModel tempUser = userDao.findByUsername(username);
		if (tempUser == null)
			return null;

		return tempUser;
	}

	/**
	 * Checks that the user is logged in and then returns the current user in the
	 * session.
	 * 
	 * @author CalebJGulledge
	 * @param session
	 * @return Current user in the session
	 */
	@PostMapping("/get/currentuser")
	public UserModel getCurrentUser(HttpSession session) {
		UserModel currentUser = (UserModel) session.getAttribute("loggedUser");
		if (currentUser == null) {
			return null;
		}
		return currentUser;
	}

	/**
	 * Checks that the user is logged in and then uses a helper method in the Model
	 * that updates the fields. It then saves it to the DB and returns what the DB
	 * returns. Also, updates the currentUser in the session.
	 * 
	 * @author CalebJGulledge
	 * @param session
	 * @param reqUser
	 * @return Updated Current User.
	 */
	@PostMapping("/profile/update")
	public UserModel updateUserProfile(HttpSession session, @RequestBody UserModel reqUser) {
		UserModel currentUser = (UserModel) session.getAttribute("loggedUser");
		if (reqUser != null) {
			currentUser.updateObject(reqUser);
			session.setAttribute("loggedUser", currentUser);
			return userDao.save(currentUser);
		}

		return currentUser;
	}

	/**
	 * Finds the
	 * 
	 * @author CalebJGulledge
	 * @param reqUser
	 * @return
	 */
	@PostMapping("/profile/passwordreset/{resetKey}")
	public String updateUserPassword(@PathVariable("resetKey") String resetKey, @RequestBody UserModel reqUser) {
		System.out.println("In the functional reset password URI");
		UserModel tempUser = userDao.findByUsername(reqUser.getUsername());
		if (resetAuthentication(resetKey, tempUser)) {
			tempUser.setPassword(reqUser.getPassword());
			tempUser.setPasswordResetKey("");
			userDao.save(tempUser);
			return "true";
		}
		return "false";

	}

	/**
	 * @author CalebJGulledge
	 * @param session
	 * @param file
	 * @return
	 * @throws IOException
	 */
	@PostMapping("/profile/picture")
	public String updateProfilePicture(HttpSession session, @RequestParam(value = "file") MultipartFile file)
			throws IOException {
		UserModel currentUser = (UserModel) session.getAttribute("loggedUser");
		if (currentUser != null) {
			String newFileName = storageServ.uploadAWSFile(file);
			currentUser.setProfilePicName(newFileName);
			userDao.save(currentUser);

			return storageServ.presignedUrl(newFileName);
		}

		return null;
	}

	/**
	 * 
	 * @param session
	 * @param fileName
	 * @return
	 * @throws IOException
	 */
	@PostMapping("/photo")
	public String getPictureURL(HttpSession session, @RequestParam("picName") String fileName) throws IOException {
		System.out.println("In the get Photo method");
		UserModel currentUser = (UserModel) session.getAttribute("loggedUser");
		if (currentUser != null) {
			String URL = storageServ.presignedUrl(fileName);
			System.out.println("\n\n" + URL + "\n\n");
			return URL;
		}
		return null;

	}

	// HELPER METHODS\\
	/**
	 * 
	 * @param reqUser
	 * @return
	 */
	public UserModel loginAuthentication(UserModel reqUser) {
		UserModel dbUser = userDao.findByUsername(reqUser.getUsername());
		if (dbUser != null) {

			if (dbUser.getPassword().equals(reqUser.getPassword())) {
				return dbUser;
			}
		}

		return null;
	}

	public boolean resetAuthentication(String resetKey, UserModel currentUser) {
		if (currentUser != null) {
			System.out.println("The user/resetpasswordauth is not null");
			if (currentUser.getPasswordResetKey().equals(resetKey)) {
				System.out.println("The user/resetpasswordauth resetKey matches");
				return true;
			}
		}
		return false;
	}

}