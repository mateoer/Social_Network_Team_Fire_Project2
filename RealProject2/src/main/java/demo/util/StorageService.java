package demo.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;

@Service
public class StorageService {

	private AmazonS3 amazonS3;
	
	@Autowired
	public StorageService(AmazonS3 amazonS3) {
		super();
		this.amazonS3 = amazonS3;
	}

	/**
	 * This method takes in a Multipart file and then converts it into a file and sends a putObject request to the AWS server where the bucket name matches the one in the AWSConfig class.
	 * @param Multipart file
	 * @return boolean of true if passes
	 * @throws IOException
	 */
	@CrossOrigin("/*")
	public String uploadAWSFile(MultipartFile file) throws IOException {
		System.out.println("In the service upload!");
		File fileObj = convertMultipartFileToFile(file);
		String tempFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
		amazonS3.putObject(new PutObjectRequest(AWSConfig.getBucketName(), tempFileName, fileObj));

		fileObj.delete();
		System.out.println("File Uploaded" + tempFileName);
		return tempFileName;
	}
	
	/**
	 * Use this functionality to retrieve a link for the requested image that lasts 24 hours
	 * @param fileName
	 * @return Url for HTML img src
	 * @throws IOException
	 */
	@CrossOrigin("/*")
	public String presignedUrl(String fileName) throws IOException {
		return amazonS3.generatePresignedUrl(AWSConfig.getBucketName(), fileName, convertToDateViaInstant(LocalDate.now().plusDays(1)))
				.toString();
	}
	
	
	/**
	 * Input the file name and then delete it from the database.
	 * It's functionality may not ever be used, as deleting from a database is usually not something that happens.
	 * @param fileName
	 * @return ResponseEntity of ok
	 */
	@Deprecated
	public ResponseEntity<String> deleteAWSFile(String fileName) {
		System.out.println("Deleting file: " + fileName);
		amazonS3.deleteObject(AWSConfig.getBucketName(), fileName);
		return ResponseEntity.ok().build();
	}

	private File convertMultipartFileToFile(MultipartFile file) {
		File convertedFile = new File(file.getOriginalFilename());
		try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
			fos.write(file.getBytes());
		} catch (IOException e) {
			System.out.println("Error converting multipart file to file" + e);
		}
		return convertedFile;
	}
	
	private Date convertToDateViaInstant(LocalDate dateToConvert) {
		return java.util.Date.from(dateToConvert.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant());
	}

}
