package demo.controller;

import java.io.IOException;
import java.util.Date;
import java.util.Properties;
import java.util.UUID;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import demo.dao.UserDao;
import demo.model.UserModel;

@RestController
@CrossOrigin(origins = "http://54.147.157.227:9001/")
public class MailController {
	
	
	private UserDao userDao;
	
	
	@Autowired
	public MailController(UserDao userDao) {
		super();
		this.userDao = userDao;
	}


	String messageContent1 = "Someone has logged into your account and requested a password reset. If you did not do this, then please call Trevin Chester at Revature. "
			+ "<br><br>Otherwise, please click on the link below to go to our reset page"
			+ "<br><br><a href='http://localhost:9001/finalizepasswordreset/";
	String messageContent2 = "'>Password Reset</a>"
			+ "<br><br>Thanks,<br>HotTakes Security Team";

	
	/**
	 * 
	 * @param email
	 * @author CalebJGulledge
	 * @return
	 * @throws AddressException
	 * @throws MessagingException
	 * @throws IOException
	 */
	@PostMapping("/sendemail")
	public String sendEmail(@RequestParam(value="emailName") String email) throws AddressException, MessagingException, IOException {
		System.out.println(email);
		sendMail(email);
		
		return "Email sent successfully";
	}
	
	
	
	
	/**
	 * This function takes in the email given by the user. It then sets the properties and the Gmail properties. It sets the gmail to a hardcoded value.
	 * The password is hidden in the system environments variables.
	 * @author CalebJGulledge
	 * @param email
	 * @throws AddressException
	 * @throws MessagingException
	 * @throws IOException
	 */
	private void sendMail(String email) throws AddressException, MessagingException, IOException {
		
		String resetKey = UUID.randomUUID() + "";
		
		UserModel tempUser = userDao.findByUserEmail(email);
		tempUser.setPasswordResetKey(resetKey);
		userDao.save(tempUser);
		
		
		Properties props = new Properties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.port", "587");

		Session session = Session.getInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication("hottakesreview@gmail.com", System.getenv("USER_SALT"));
			}
		});

		Message msg = new MimeMessage(session);
		msg.setFrom(new InternetAddress("hottakesreview@gmail.com", false));
		msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
		msg.setSubject("Hot Takes Review Password Reset");
		msg.setContent(messageContent1 + resetKey + messageContent2, "text/html");
		msg.setSentDate(new Date());

		MimeBodyPart messageBodyPart = new MimeBodyPart();
		messageBodyPart.setContent("Hot Takes Review Password Reset", "text/html");

		Multipart multipart = new MimeMultipart();
		multipart.addBodyPart(messageBodyPart);
//		MimeBodyPart attachPart = new MimeBodyPart();
//
//		attachPart.attachFile("favicon.ico");
//		multipart.addBodyPart(attachPart);
//		msg.setContent(multipart);
		Transport.send(msg);
	}
	
	
	

}
