package demo.model;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name="Post_Table")
@JsonIgnoreProperties (value = {"myOwner", "userLikesList", "commentList"}, allowSetters = true)
public class PostModel {
	
	@Id
	@Column(name="post_id")
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int postId;
		
	@Column(name="post_rating", unique=false, nullable=true)
	private int postRating;
	
	@Column(name="review_item", unique=false, nullable=true, length=14)
	private String reviewItem;
	
	@Column(name="item_type", unique=false, nullable=false)
	private ItemType itemType;
	
	@Column(name="post_content", unique=false, nullable=false)
	private String postContent;
	
	@ManyToOne(cascade=CascadeType.MERGE, fetch=FetchType.LAZY)
	@JoinColumn(name="user_id_FK")
	private UserModel myOwner;
	
	@Column(name="submit_date", unique=false, nullable=false)
	private Timestamp submitTime;
	
	@ManyToMany(cascade=CascadeType.MERGE, fetch=FetchType.LAZY)
	@JoinColumn(name="likes_id_FK")
	private List<UserModel> userLikesList;
	
	@OneToMany(mappedBy="myPost", fetch = FetchType.LAZY)
	private List<CommentModel> commentList;
	
	@Column(name="picture_url", unique=false, nullable=true)
	private String pictureURL;
	
	enum ItemType {
		Movie,
		VideoGame,
		Book
	}


	public PostModel(int postRating, String reviewItem, ItemType itemType, String postContent,
			UserModel myOwner, Timestamp submitTime, ArrayList<UserModel> userLikesList,
			ArrayList<CommentModel> commentList) {
		super();
		this.postRating = postRating;
		this.reviewItem = reviewItem;
		this.itemType = itemType;
		this.postContent = postContent;
		this.myOwner = myOwner;
		this.submitTime = submitTime;
		this.userLikesList = userLikesList;
		this.commentList = commentList;
	}
	
	public PostModel(int postId, int postRating, String reviewItem, ItemType itemType, String postContent,
			UserModel myOwner, Timestamp submitTime, ArrayList<UserModel> userLikesList,
			ArrayList<CommentModel> commentList) {
		super();
		this.postId = postId;
		this.postRating = postRating;
		this.reviewItem = reviewItem;
		this.itemType = itemType;
		this.postContent = postContent;
		this.myOwner = myOwner;
		this.submitTime = submitTime;
		this.userLikesList = userLikesList;
		this.commentList = commentList;
	}
	
	

	@Override
	public String toString() {
		return "PostModel [postId=" + postId + ", postRating=" + postRating + ", reviewItem=" + reviewItem
				+ ", itemType=" + itemType + ", postContent=" + postContent + ", myOwner=" + myOwner.getFirstName() + " " + myOwner.getLastName() + ", submitTime="
				+ submitTime + ", userLikesList=" + userLikesList + ", commentList=" + commentList + "]";
	}

	public PostModel(int postRating, String reviewItem, ItemType itemType, String postContent) {
		super();
		this.postRating = postRating;
		this.reviewItem = reviewItem;
		this.itemType = itemType;
		this.postContent = postContent;
	}

	
	
	

}
