package demo.controller;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import demo.dao.CommentDao;
import demo.dao.PostDao;
import demo.dao.UserDao;
import demo.model.UserModel;
import demo.util.StorageService;

@Controller
@CrossOrigin(origins = "http://54.147.157.227:9001/")
public class MainController {

	// FIELDS\\
	private UserDao userDao;
	private PostDao postDao;
	private CommentDao commentDao;
	private StorageService storageServ;

	// CONSTRUCTORS\\
	@Autowired
	public MainController(UserDao userDao, PostDao postDao, CommentDao commentDao, StorageService storageServ) {
		super();
		this.userDao = userDao;
		this.postDao = postDao;
		this.commentDao = commentDao;
		this.storageServ = storageServ;
	}
	

	// ROUTING\\
	@GetMapping("/")
	public String routeLandingPage() {
		System.out.println("In the main router");
		return "/landing.html";
	}

	@GetMapping("/login")
	public String routeLoginPage() {
		System.out.println("In the main/login router");
		return "/html/login.html";
	}

	@GetMapping("/register")
	public String routeRegisterPage() {
		System.out.println("In the main/register router");
		return "/html/register.html";
	}

	@GetMapping("/aboutus")
	public String routeAboutUsPage() {
		System.out.println("In the main/aboutus router");
		return "/html/aboutus.html";
	}

	@GetMapping("/home")
	public String routeHomePage(HttpSession session) {
		System.out.println("In the main/home router");
		// MAKE SURE THE USER IS LOGGED IN
		UserModel currentUser = (UserModel) session.getAttribute("loggedUser");
		if (currentUser == null)
			return "/landing.html";

		return "/html/home.html";
	}

	@GetMapping("/user/{username}")
	public String routeProfilePage(HttpSession session, @PathVariable("username") String username) {
		System.out.println("In the main/profile router");
		// MAKE SURE THE USER IS LOGGED IN
		UserModel currentUser = (UserModel) session.getAttribute("loggedUser");
		System.out.println(currentUser);
		if (currentUser == null)
			return "/landing.html";

		System.out.println("Not NULL");
		return "/html/profile.html";
	}

	@GetMapping("/logout")
	public String logoutMethod(HttpSession session) {
		System.out.println("Logging out");
		session.invalidate();
		return "/landing.html";
	}
	
	@GetMapping("/finalizepasswordreset/{resetKey}")
	public String routeResetPassword() {
		System.out.println("Pathing to reset password");
		return "/html/password-reset.html";
		
	}
	

}
