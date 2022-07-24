package demo.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

@Configuration
public class AWSConfig {

	 @Value("${cloud.aws.credentials.access-key}")
	    private String awsAccessKey;

	    @Value("${cloud.aws.credentials.secret-key}")
	    private String awsSecretKey;

	    @Value("${cloud.aws.region.static}")
	    private String region;

	    private static String bucketName = "project2fireteam";

	    @Primary
	    @Bean
	    public AmazonS3 amazonS3Client() {
	        return AmazonS3ClientBuilder
	                .standard()
	                .withRegion(region)
	                .withCredentials(new AWSStaticCredentialsProvider(
	                        new BasicAWSCredentials(awsAccessKey, awsSecretKey)))
	                .build();
	    }

		public static String getBucketName() {
			return bucketName;
		}
	
}
